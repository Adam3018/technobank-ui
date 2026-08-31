import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  EmailField,
  FunctionField,
  EditButton,
  DeleteWithConfirmButton,
  TextInput,
} from 'react-admin'
import { Chip } from '@mui/material'

import { ListActions } from '../../customComponents/ListActions'
import { clearanceChoices } from '../../utils/clearanceChoices'
import VisitorAccreditationPreview from '../../customComponents/VisitorAccreditationPreview'

import SearchIcon from '@mui/icons-material/Search'

const clearanceStyles = {
  visitor: { color: '#5B6B7F', bg: '#EEF1F4' },
  staff: { color: '#2F6B7A', bg: '#E4F1F4' },
  vip: { color: '#B0791B', bg: '#FBF0DD' },
  admin: { color: '#B3261E', bg: '#FBEAE9' },
  presenter: { color: '#6B3FA0', bg: '#F1E9F8' },
}

const visitorFilters = [
  <TextInput
    source="name"
    label="Search visitor"
    placeholder="Name or surname..."
    alwaysOn
    InputProps={{
      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
    }}
    sx={{
      '& .MuiInputBase-root': {
        height: 40,
        minWidth: 220,
      },
      '& .MuiInputBase-input': {
        fontSize: '0.9rem',
      },
    }}
  />,

  <TextInput
    source="company"
    label="Search company"
    placeholder="Company name..."
    alwaysOn
    InputProps={{
      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
    }}
    sx={{
      '& .MuiInputBase-root': {
        height: 40,
        minWidth: 220,
      },
      '& .MuiInputBase-input': {
        fontSize: '0.9rem',
      },
    }}
  />,
]

export default function VisitorsList() {
  return (
    <List
      sort={{ field: 'created_at', order: 'DESC' }}
      actions={<ListActions />}
      filters={visitorFilters}
      perPage={10}
      empty={false}
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />

        <TextField
          source="first_name"
          label="First Name"
          sortable={false}
        />

        <TextField
          source="last_name"
          label="Last Name"
          sortable={false}
        />

        <EmailField
          source="email"
          sortable={false}
        />

        <TextField source="company" />

        <TextField source="position" />

        <FunctionField
          source="clearance_level"
          label="Clearance"
          sortable={false}
          render={(record) => {
            const choice = clearanceChoices.find((c) => c.id === record.clearance_level)
            const style = clearanceStyles[record.clearance_level] || clearanceStyles.visitor
            return (
              <Chip
                label={choice ? choice.name : record.clearance_level}
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

        <TextField
          source="phone"
          sortable={false}
        />

        <EditButton />

        <DeleteWithConfirmButton />

        <VisitorAccreditationPreview />
      </Datagrid>
    </List>
  )
}