import React, { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material'
import { useNotify } from 'react-admin'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const steps = ['Visitor ID', 'Choose Talk', 'Write Question']

export default function AskPresenterWizard() {
  const notify = useNotify()
  const [activeStep, setActiveStep] = useState(0)
  const [visitorId, setVisitorId] = useState('')
  const [visitor, setVisitor] = useState(null)
  const [conference, setConference] = useState(null)
  const [selectedTalk, setSelectedTalk] = useState(null)
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lookupMode, setLookupMode] = useState('id')
  const [firstNameInput, setFirstNameInput] = useState('')
  const [lastNameInput, setLastNameInput] = useState('')

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    let payload = null
    const text = await response.text()
    if (text) {
      try {
        payload = JSON.parse(text)
      } catch {
        payload = { detail: text }
      }
    }

    if (!response.ok) {
      throw new Error(payload?.detail || payload?.message || 'Request failed')
    }

    return payload
  }

  const loadActiveConference = async () => {
    const data = await fetchJson(`${API_BASE}/conferences?skip=0&limit=100`)
    const active =
      data.find((item) => item.status?.toLowerCase() === 'active') ||
      data.find((item) => item.status?.toLowerCase() === 'upcoming') ||
      data[0]

    if (!active) {
      throw new Error('No active conference was found.')
    }

    return active
  }

  const onStepOneSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      if (lookupMode === 'name') {
        const firstName = firstNameInput.trim()
        const lastName = lastNameInput.trim()

        if (!firstName || !lastName) {
          throw new Error('Please enter both first name and last name.')
        }

        setVisitor({
          id: null,
          first_name: firstName,
          last_name: lastName,
        })
        setConference(await loadActiveConference())
        setSelectedTalk(null)
        setActiveStep(1)
        return
      }

      const id = Number(visitorId)
      if (!visitorId || Number.isNaN(id) || id <= 0) {
        setError('Please enter a valid visitor ID.')
        return
      }

      const visitorData = await fetchJson(`${API_BASE}/visitors/${id}`)
      await continueWithVisitor(visitorData)
    } catch (e) {
      if (lookupMode === 'id') {
        setLookupMode('name')
        setError(`${e.message || 'Could not load this visitor. Please check the ID.'} You can enter the visitor name instead.`)
      } else {
        setError(e.message || 'Could not continue with the entered visitor name.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitQuestion = async () => {
    if (!selectedTalk) {
      setError('Please choose a talk before sending your question.')
      return
    }

    if (!question.trim()) {
      setError('Please write your question before sending it.')
      return
    }

    if (!selectedTalk.speaker_id) {
      setError('This talk does not have a presenter assigned yet.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const speakerId = Number(selectedTalk.speaker_id)
      const payload = {
        visitor_id: visitor?.id ?? null,
        visitor_name: visitor?.first_name && visitor?.last_name
          ? `${visitor.first_name} ${visitor.last_name}`
          : displayVisitorName,
        speaker_id: speakerId,
        conference_id: conference?.id ?? null,
        conference_name: conference?.name ?? 'Conference',
        talk_title: selectedTalk.title,
        question: question.trim(),
      }

      const response = await fetchJson(`${API_BASE}/email-templates/send-question`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      notify(response?.message || 'Question sent to presenter.', { type: 'success' })
      setQuestion('')
      setSelectedTalk(null)
      setActiveStep(0)
      setVisitor(null)
      setConference(null)
      setVisitorId('')
    } catch (e) {
      setError(e.message || 'Could not send the question.')
    } finally {
      setIsLoading(false)
    }
  }

  const lookupVisitorByName = async () => {
    return null
  }

  const continueWithVisitor = async (visitorData) => {
    setVisitor(visitorData)
    setConference(await loadActiveConference())
    setSelectedTalk(null)
    setActiveStep(1)
  }

  const displayVisitorName = (() => {
    const fromVisitor = `${(visitor?.first_name || '').trim()} ${(visitor?.last_name || '').trim()}`.trim()
    if (fromVisitor) {
      return fromVisitor
    }

    if (lookupMode === 'name') {
      const typed = `${(firstNameInput || '').trim()} ${(lastNameInput || '').trim()}`.trim()
      if (typed) {
        return typed
      }
    }

    if (visitorId) {
      return `Visitor ID: ${visitorId}`
    }

    return 'Visitor not selected'
  })()

  const lookupToggleButtonSx = {
    borderRadius: 999,
    textTransform: 'none',
    px: 1.5,
    fontWeight: 600,
  }

  const lookupCardSx = {
    p: 2,
    borderRadius: 2,
    border: '1px solid #dfe3e8',
    backgroundColor: '#f7f7f8',
    mb: 2,
  }

  const agendaItems = Array.isArray(conference?.agenda) ? conference.agenda : []

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Ask a Presenter
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {activeStep === 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Step 1: Enter visitor details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {lookupMode === 'id'
                ? 'Start by entering the visitor ID who wants to submit the question.'
                : 'Enter the visitor name if the visitor ID is not available.'}
            </Typography>

            {lookupMode === 'id' ? (
              <Box sx={lookupCardSx}>
                <TextField
                  fullWidth
                  label="Visitor ID"
                  value={visitorId}
                  onChange={(event) => setVisitorId(event.target.value)}
                  type="number"
                  placeholder="e.g. 12"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setLookupMode('name')
                      setError('')
                    }}
                    sx={lookupToggleButtonSx}
                  >
                    Use name instead
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={lookupCardSx}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="First name"
                    value={firstNameInput}
                    onChange={(event) => setFirstNameInput(event.target.value)}
                    placeholder="e.g. Sarah"
                  />
                  <TextField
                    fullWidth
                    label="Last name"
                    value={lastNameInput}
                    onChange={(event) => setLastNameInput(event.target.value)}
                    placeholder="e.g. Smith"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setLookupMode('id')
                      setError('')
                    }}
                    sx={lookupToggleButtonSx}
                  >
                    Use visitor ID instead
                  </Button>
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={onStepOneSubmit}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Step 2: Choose a talk from the active conference
            </Typography>

            {conference ? (
              <>
                <Box sx={lookupCardSx}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Visitor
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {displayVisitorName}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {conference.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {conference.venue || 'Venue not specified'}
                  </Typography>
                </Box>

                {agendaItems.length === 0 ? (
                  <Alert severity="info">
                    There are no agenda items in the active conference yet.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {agendaItems.map((item, index) => {
                      const isSelected = selectedTalk?.title === item.title && selectedTalk?.start_time === item.start_time
                      const itemSpeakerLabel = item.speaker_id ? `Speaker ID: ${item.speaker_id}` : 'Speaker not assigned'

                      return (
                        <Box
                          key={`${item.title}-${index}`}
                          onClick={() => setSelectedTalk(item)}
                          sx={{
                            border: `1px solid ${isSelected ? '#2596be' : '#dfe3e8'}`,
                            borderRadius: 2,
                            p: 2,
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#f1f9ff' : '#fff',
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: '#2596be', boxShadow: 1 },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.type || 'Talk'} • {item.start_time || 'Time not set'}
                              </Typography>
                            </Box>
                            <Chip label={itemSpeakerLabel} size="small" variant={isSelected ? 'filled' : 'outlined'} />
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="warning">Loading active conference...</Alert>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={() => setActiveStep(0)}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (!selectedTalk) {
                    setError('Please select a talk first.')
                    return
                  }
                  setError('')
                  setActiveStep(2)
                }}
                disabled={!selectedTalk}
              >
                Continue
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Step 3: Send your question to the presenter
            </Typography>

            <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: '#f6f9fc', border: '1px solid #e0e6ed' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Selected talk
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {selectedTalk?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {conference?.name} • {selectedTalk?.type || 'Talk'} • {selectedTalk?.start_time || 'Time not set'}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Your question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask the presenter about the talk, the topic, or anything you want clarified..."
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={() => setActiveStep(1)}>
                Back
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={onSubmitQuestion}
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Question'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
