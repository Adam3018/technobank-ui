import React from 'react'

import {
  TextInput,
  SelectInput,
  required,
  email,
} from 'react-admin'

import {
  Box,
  Typography,
  Divider,
} from '@mui/material'

import { clearanceChoices } from '../utils/clearanceChoices'

export default function VisitorAccreditationForm() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 700,
        margin: '20px auto',
        backgroundColor: 'white',
        border: '2px solid #222',
        borderRadius: 2,
        padding: {
          xs: 2,
          sm: 4,
        },
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
      >
        TechnoBanka
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        Visitor Information
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
          },
          gap: 2,
        }}
      >
        <TextInput
          source="first_name"
          label="First Name"
          validate={required()}
          fullWidth
        />

        <TextInput
          source="last_name"
          label="Last Name"
          validate={required()}
          fullWidth
        />

        <TextInput
          source="email"
          label="Email"
          validate={[required(), email()]}
          fullWidth
        />

        <TextInput
          source="phone"
          label="Phone"
          fullWidth
        />

        <TextInput
          source="company"
          label="Company"
          fullWidth
        />

        <TextInput
          source="position"
          label="Position"
          fullWidth
        />

        <SelectInput
          source="clearance_level"
          label="Clearance Level"
          choices={clearanceChoices}
          validate={required()}
          fullWidth
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <TextInput
          source="notes"
          label="Notes"
          multiline
          fullWidth
        />
      </Box>
    </Box>
  )
}