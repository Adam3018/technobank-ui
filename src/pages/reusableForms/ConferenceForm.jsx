import React from 'react'
import {
  SimpleForm,
  TextInput,
  SelectInput,
  TimeInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  useDataProvider,
  required,
  useGetList,
  AutocompleteInput,
  DateInput,
} from 'react-admin'

import { useFormContext, useFieldArray, useWatch } from 'react-hook-form'

import {
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import DateTimePickerInput from '../../customComponents/DateTimePickerInput'
import FloorPlanEditor from '../../customComponents/FloorPlanEditor'
import SendSpeakerEmailButton from '../../customComponents/SendSpeakerEmailButton'

const statusChoices = [
  { id: 'draft', name: 'Draft' },
  { id: 'scheduled', name: 'Scheduled' },
  { id: 'ongoing', name: 'Ongoing' },
  { id: 'completed', name: 'Completed' },
  { id: 'cancelled', name: 'Cancelled' },
]

const agendaTypeChoices = [
  { id: 'talk', name: 'Talk' },
  { id: 'panel', name: 'Panel' },
  { id: 'break', name: 'Break' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'networking', name: 'Networking' },
]

function SelectAllVisitorsButton() {
  const dataProvider = useDataProvider()
  const { setValue } = useFormContext()

  const handleSelectAll = async () => {
    const { data } = await dataProvider.getList('visitors', {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    })

    setValue(
      'visitor_ids',
      data.map((v) => v.id),
      { shouldDirty: true }
    )
  }

  return (
    <Button size="small" variant="outlined" onClick={handleSelectAll}>
      Select all
    </Button>
  )
}

function ClearVisitorsButton() {
  const { setValue } = useFormContext()

  return (
    <Button
      size="small"
      variant="text"
      onClick={() => setValue('visitor_ids', [], { shouldDirty: true })}
    >
      Clear
    </Button>
  )
}

function AgendaRow({ index, remove, presenters, presentersLoading, minDate, maxDate }) {
  const { setValue } = useFormContext()

  const type = useWatch({ name: `agenda.${index}.type` })
  const speakerId = useWatch({ name: `agenda.${index}.speaker_id` })

  const speakerActive = type === 'talk' || type === 'panel'

  const selectedSpeaker = React.useMemo(
    () => presenters.find((p) => p.id === speakerId),
    [presenters, speakerId]
  )

  React.useEffect(() => {
    if (!speakerActive) {
      setValue(`agenda.${index}.speaker_id`, null, { shouldDirty: true })
    }
  }, [speakerActive, index, setValue])

  const validateAgendaDate = (value) => {
    if (!value) {
      return 'Date is required'
    }
    if (minDate && value < minDate) {
      return `Date cannot be before ${minDate}`
    }
    if (maxDate && value > maxDate) {
      return `Date cannot be after ${maxDate}`
    }
    return undefined
  }

  return (
    <TableRow>
      <TableCell sx={{ minWidth: 160 }}>
        <SelectInput
          source={`agenda.${index}.type`}
          label={false}
          choices={agendaTypeChoices}
          helperText={false}
          fullWidth
          sx={{ mt: '0px', mb: '0px' }}
        />
      </TableCell>

      <TableCell sx={{ minWidth: 240 }}>
        <AutocompleteInput
          source={`agenda.${index}.speaker_id`}
          label={false}
          choices={presenters}
          loading={presentersLoading}
          disabled={!speakerActive}
          helperText={false}
          optionText={(record) => (record ? `${record.first_name} ${record.last_name}` : '')}
          optionValue="id"
          fullWidth
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          noOptionsText={speakerActive ? 'No presenters found' : 'Speaker not required'}
        />
      </TableCell>

      <TableCell sx={{ minWidth: 240 }}>
        <TextInput
          source={`agenda.${index}.title`}
          label={false}
          helperText={false}
          validate={required()}
          fullWidth
        />
      </TableCell>

      <TableCell sx={{ minWidth: 130 }}>
        <TimeInput
          source={`agenda.${index}.start_time`}
          label={false}
          helperText={false}
          validate={required()}
          fullWidth
        />
      </TableCell>

      <TableCell sx={{ minWidth: 130 }}>
        <TimeInput
          source={`agenda.${index}.end_time`}
          label={false}
          helperText={false}
          fullWidth
        />
      </TableCell>

      <TableCell sx={{ minWidth: 150 }}>
        <DateInput
          source={`agenda.${index}.date`}
          label={false}
          helperText={false}
          validate={validateAgendaDate}
          fullWidth
          inputProps={{ min: minDate || undefined, max: maxDate || undefined }}
        />
      </TableCell>

      <TableCell align="center" sx={{ minWidth: 110 }}>
        <SendSpeakerEmailButton
          speakerId={speakerActive ? speakerId : null}
          speakerName={
            selectedSpeaker ? `${selectedSpeaker.first_name} ${selectedSpeaker.last_name}` : ''
          }
        />
      </TableCell>

      <TableCell align="center" sx={{ width: 70 }}>
        <Tooltip title="Delete agenda item">
          <IconButton color="error" onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

function AgendaEditor() {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({ control, name: 'agenda' })

  const conferenceStart = useWatch({ control, name: 'start_time' })
  const conferenceEnd = useWatch({ control, name: 'end_time' })

  const minDate = React.useMemo(() => {
    if (!conferenceStart) return ''
    return String(conferenceStart).substring(0, 10)
  }, [conferenceStart])

  const maxDate = React.useMemo(() => {
    if (!conferenceEnd) return ''
    return String(conferenceEnd).substring(0, 10)
  }, [conferenceEnd])

  const { data: presenters = [], isLoading: presentersLoading } = useGetList('visitors', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'first_name', order: 'ASC' },
    filter: { clearance_level: 'presenter' },
  })

  const addAgendaItem = () => {
    append({
      date: minDate || '',
      type: 'talk',
      speaker_id: null,
      title: '',
      start_time: '',
      end_time: '',
    })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Agenda</Typography>

        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1.5 }}>
          Add each talk, panel, break, lunch, or networking session. Speaker is only available
          for talks and panels.
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={addAgendaItem}>
          Add agenda item
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          sx={{
            minWidth: 1250,
            '& .MuiTableCell-root': { verticalAlign: 'top', padding: '10px 8px' },
            '& .MuiInputBase-root': { fontSize: 14 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Speaker</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Session title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Start</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>End</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 70 }}>Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => (
              <AgendaRow
                key={field.id}
                index={index}
                remove={remove}
                presenters={presenters}
                presentersLoading={presentersLoading}
                minDate={minDate}
                maxDate={maxDate}
              />
            ))}

            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No agenda items yet.
                  <Box>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={addAgendaItem}
                      sx={{ mt: 1 }}
                    >
                      Add the first agenda item
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function InvitedVisitorsInput() {
  const { data: visitors = [], isLoading } = useGetList('visitors', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'first_name', order: 'ASC' },
  })

  return (
    <AutocompleteArrayInput
      source="visitor_ids"
      label="Invited Visitors"
      choices={visitors}
      loading={isLoading}
      optionText={(record) =>
        record
          ? `${record.first_name} ${record.last_name}${record.company ? ' — ' + record.company : ''}`
          : ''
      }
      optionValue="id"
      fullWidth
    />
  )
}

export default function ConferenceForm() {
  return (
    <SimpleForm>
      <TextInput source="name" label="Conference Name" validate={required()} fullWidth />

      <TextInput
        source="description"
        label="Description"
        multiline
        minRows={4}
        fullWidth
      />

      <Box display="flex" gap={3} width="100%" sx={{ mb: 4 }}>
        <Box flex={1}>
          <DateTimePickerInput source="start_time" label="Start Time" validate={required()} />
        </Box>

        <Box flex={1} sx={{ mt: 3 }}>
          <DateTimePickerInput source="end_time" label="End Time" />
        </Box>
      </Box>

      <TextInput source="venue" label="Venue" fullWidth sx={{ mb: 3 }} />

      <TextInput source="address" label="Address" multiline minRows={2} fullWidth />

      <TextInput source="organizer" label="Organizer" fullWidth />

      <SelectInput
        source="status"
        label="Status"
        choices={statusChoices}
        validate={required()}
        fullWidth
      />

      <Divider sx={{ width: '100%', my: 4 }} />

      <AgendaEditor />

      <Divider sx={{ width: '100%', my: 4 }} />

      <FloorPlanEditor />

      <Divider sx={{ width: '100%', my: 4 }} />

      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>Invited Visitors</Typography>

      <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2 }}>
        Search and select who's invited. Use "Select all" if everyone in the system should be
        included.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <SelectAllVisitorsButton />
        <ClearVisitorsButton />
      </Stack>

      <InvitedVisitorsInput />
    </SimpleForm>
  )
}