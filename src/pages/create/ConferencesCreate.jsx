import React from 'react'
import { Create, SimpleForm, TextInput, required } from 'react-admin'

export default function ConferencesCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={required()} fullWidth />
      </SimpleForm>
    </Create>
  )
}
