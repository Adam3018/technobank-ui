import React, { useState } from 'react'
import {
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import { useGetList, useNotify } from 'react-admin'

/*
 * Sends an email to a single, already-known visitor
 * (e.g. the speaker assigned to an agenda item).
 *
 * Reuses the same /email-templates/send/:id endpoint
 * as the bulk email action, just with one visitor_id.
 */
export default function SendSpeakerEmailButton({ speakerId, speakerName }) {
  const [open, setOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const notify = useNotify()

  const { data: templates, isLoading: loadingTemplates } = useGetList(
    'email-templates',
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
    },
    {
      enabled: open,
    }
  )

  const handleOpen = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setOpen(false)
      setSelectedTemplateId('')
    }
  }

  const handleSend = async () => {
    if (!selectedTemplateId) {
      notify('Please select an email template', { type: 'warning' })
      return
    }

    if (!speakerId) {
      notify('No speaker selected', { type: 'warning' })
      return
    }

    setIsSubmitting(true)

    try {
      const queryParams = new URLSearchParams()
      queryParams.append('visitor_ids', speakerId)

      const endpointUrl = `http://localhost:8000/email-templates/send/${selectedTemplateId}?${queryParams.toString()}`

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.detail?.message || errorData.detail || 'Failed to send email'
        )
      }

      const data = await response.json()
      notify(
        `Email queued for ${speakerName || 'speaker'} (${data.total_queued || data.total_recipients})`,
        { type: 'success' }
      )

      handleClose()
    } catch (error) {
      notify(`Error: ${error.message}`, { type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const disabled = !speakerId

  return (
    <>
      <Tooltip title={disabled ? 'Select a speaker first' : `Email ${speakerName}`}>
        {/* span wrapper so tooltip still works on a disabled button */}
        <span>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EmailIcon />}
            onClick={handleOpen}
            disabled={disabled}
            sx={{
              whiteSpace: 'nowrap',
              textTransform: 'none',
              minWidth: 100,
            }}
          >
            Email
          </Button>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Email Speaker</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Sending to: <strong>{speakerName}</strong>
            </Typography>

            <FormControl fullWidth disabled={loadingTemplates || isSubmitting}>
              <InputLabel id="speaker-template-select-label">
                Select Email Template
              </InputLabel>
              <Select
                labelId="speaker-template-select-label"
                value={selectedTemplateId}
                label="Select Email Template"
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                {loadingTemplates ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading templates...
                  </MenuItem>
                ) : (
                  templates?.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name || `Template #${template.id}`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <MuiButton onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </MuiButton>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={isSubmitting || !selectedTemplateId}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  )
}