import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  EditButton,
  DeleteWithConfirmButton,
} from 'react-admin'
import { Chip } from '@mui/material'

const statusStyles = {
  draft: { label: 'Draft', color: '#6B7280', bg: '#EEF0F2' },
  scheduled: { label: 'Scheduled', color: '#B0791B', bg: '#FBF0DD' },
  ongoing: { label: 'Ongoing', color: '#2F7A5A', bg: '#E7F3ED' },
  completed: { label: 'Completed', color: '#5B6B7F', bg: '#EEF1F4' },
  cancelled: { label: 'Cancelled', color: '#B3261E', bg: '#FBEAE9' },
}

export default function ConferencesList() {
  return (
    <List perPage={10} >
      <Datagrid
        rowClick="edit"
        bulkActionButtons={false}
        sx={{
          '& .RaDatagrid-headerCell': {
            fontSize: '0.85rem',
            py: 1.5,
          },
          '& .RaDatagrid-rowCell': {
            fontSize: '0.9rem',
            py: 2,
          },
        }}
      >
        <TextField source="id" />

        <TextField source="name" label="Conference Name" />

        <DateField
          source="start_time"
          label="Start"
          sortable={false}
          showTime
          options={{ hour12: false }}
        />

        <DateField
          source="end_time"
          label="End"
          sortable={false}
          showTime
          options={{ hour12: false }}
        />

        <TextField source="venue" sortable={false} />

        <TextField source="organizer" sortable={false} />

        <FunctionField
          source="status"
          label="Status"
          sortable={false}
          render={(record) => {
            const style = statusStyles[record.status] || statusStyles.draft
            return (
              <Chip
                label={style.label}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )
          }}
        />

        <EditButton />

        <DeleteWithConfirmButton />
      </Datagrid>
    </List>
  )
}