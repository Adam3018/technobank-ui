import React from 'react'

import {
  Edit,
  SimpleForm,
} from 'react-admin'

import VisitorAccreditationForm from '../../customComponents/VisitorAccreditationForm'

export default function VisitorsEdit() {
  return (
    <Edit mutationMode="pessimistic">
      <SimpleForm
        sx={{
          '& .RaSimpleForm-main': {
            width: '100%',
          },

          '& .RaToolbar-root': {
            justifyContent: 'center',
            padding: '16px 0 8px',
            gap: 2,
          },
        }}
      >
        <VisitorAccreditationForm />
      </SimpleForm>
    </Edit>
  )
}