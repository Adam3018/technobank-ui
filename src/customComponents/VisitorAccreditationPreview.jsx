import React, { useState } from 'react'

import {
  Button,
  useRecordContext,
  useCreate,
  useNotify,
} from 'react-admin'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  TextField,
} from '@mui/material'

import PrintIcon from '@mui/icons-material/Print'
import RateReviewIcon from '@mui/icons-material/RateReview'
import SaveIcon from '@mui/icons-material/Save'

import accreditationHtml from './AccreditationPrint.html?raw'

export default function VisitorAccreditationPreview({ manual = false }) {
  const record = useRecordContext()

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    position: '',
    clearance_level: '',
    // id: '',
  })

  const [create] = useCreate()
  const notify = useNotify()

  if (!manual && !record) {
    return null
  }

  const data = manual
    ? form
    : {
      first_name: record?.first_name ?? '',
      last_name: record?.last_name ?? '',
      email: record?.email ?? '',
      company: record?.company ?? '',
      position: record?.position ?? '',
      clearance_level: record?.clearance_level ?? '',
      // id: record?.id ?? '',
    }

  const handleOpen = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (manual) {
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        company: '',
        position: '',
        clearance_level: '',
        // id: '',
      })
    }

    setOpen(true)
  }

  const handleClose = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (!saving) {
      setOpen(false)
    }
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const printAccreditation = (visitorData) => {
    const printWindow = window.open(
      '',
      '_blank',
      'width=900,height=700'
    )

    if (!printWindow) {
      alert('Please allow pop-ups to print the accreditation.')
      return
    }

    const html = accreditationHtml
      .replaceAll('{{first_name}}', visitorData.first_name ?? '')
      .replaceAll('{{last_name}}', visitorData.last_name ?? '')
      .replaceAll('{{email}}', visitorData.email ?? '')
      .replaceAll('{{company}}', visitorData.company ?? '')
      .replaceAll('{{position}}', visitorData.position ?? '')
      .replaceAll(
        '{{clearance_level}}',
        visitorData.clearance_level ?? ''
      )

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const handlePrint = (event) => {
    event.preventDefault()
    event.stopPropagation()

    printAccreditation(data)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!form.first_name || !form.last_name) {
      notify('First name and last name are required.', { type: 'warning' })
      return
    }

    setSaving(true)

    try {
      const { data: createdVisitor } = await create(
        'visitors',
        {
          data: {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            company: form.company,
            position: form.position,
            clearance_level: form.clearance_level,
          },
        },
        { returnPromise: true }
      )

      notify('Visitor saved successfully.', { type: 'success' })

      setOpen(false)

      printAccreditation(createdVisitor ?? form)
    } catch (error) {
      console.error('Create visitor error:', error)

      const status = error?.status
      const message = error?.message || ''
      const isDuplicate =
        status === 409 || /duplicate|unique/i.test(message)

      notify(
        isDuplicate
          ? 'A visitor with this email already exists.'
          : message || 'Failed to create visitor.',
        { type: 'error' }
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button
        label={manual ? 'Manual Print' : 'Print'}
        onClick={handleOpen}
      >
        {manual ? <RateReviewIcon /> : <PrintIcon />}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        onClick={(event) => event.stopPropagation()}
      >
        <DialogTitle>
          {manual
            ? 'Manual Accreditation'
            : 'Accreditation Preview'}
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {manual
              ? 'Enter the visitor information below before printing.'
              : 'Please review the accreditation before printing.'}
          </Typography>

          {manual && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 4,
              }}
            >
              <TextField
                label="First Name"
                value={form.first_name}
                onChange={handleChange('first_name')}
                fullWidth
                required
              />

              <TextField
                label="Last Name"
                value={form.last_name}
                onChange={handleChange('last_name')}
                fullWidth
                required
              />

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                fullWidth
              />

              <TextField
                label="Company"
                value={form.company}
                onChange={handleChange('company')}
                fullWidth
              />

              <TextField
                label="Position"
                value={form.position}
                onChange={handleChange('position')}
                fullWidth
              />

              <TextField
                label="Clearance"
                value={form.clearance_level}
                onChange={handleChange('clearance_level')}
                fullWidth
              />

              {/* <TextField
                label="ID"
                value={form.id}
                onChange={handleChange('id')}
                fullWidth
              /> */}
            </Box>
          )}

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Preview
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                width: 500,
                minHeight: 300,
                backgroundColor: 'white',
                border: '2px solid #222',
                borderRadius: 2,
                padding: 4,
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h5"
                align="center"
                fontWeight="bold"
                gutterBottom
              >
                TechnoBank
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h4"
                align="center"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                {data.first_name} {data.last_name}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Company:</strong>{' '}
                {data.company}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Position:</strong>{' '}
                {data.position}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Email:</strong>{' '}
                {data.email}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Clearance:</strong>{' '}
                {data.clearance_level}
              </Typography>

              {/* <Typography>
                <strong>ID:</strong>{' '}
                {data.id}
              </Typography> */}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            label="Cancel"
            onClick={handleClose}
            disabled={saving}
          />

          {manual && (
            <Button
              label={saving ? 'Saving...' : 'Save Visitor & Print'}
              onClick={handleSave}
              disabled={saving}
            >
              <SaveIcon />
            </Button>
          )}

          <Button
            label="Print Accreditation"
            onClick={handlePrint}
            disabled={saving}
          >
            <PrintIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}