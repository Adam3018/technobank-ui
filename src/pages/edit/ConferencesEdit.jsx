import React from 'react'
import { Edit, SimpleForm, TextInput, required } from 'react-admin'

export default function ConferencesEdit() {
  return (
    <Edit mutationMode="pessimistic">
      <SimpleForm>
        <TextInput source="title" validate={required()} fullWidth />
      </SimpleForm>
    </Edit>
  )
}
