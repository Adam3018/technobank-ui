import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteWithConfirmButton,
  TextInput,
  Filter,
} from 'react-admin'

import { ListActions } from '../../customComponents/ListActions'
import { clearanceChoices } from '../../utils/clearanceChoices'
import VisitorAccreditationPreview from '../../customComponents/VisitorAccreditationPreview'

import SearchIcon from '@mui/icons-material/Search'

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

        <TextField
          source="clearance_level"
          label="Clearance"
          choices={clearanceChoices}
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