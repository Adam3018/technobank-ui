import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  email,
} from 'react-admin'
import { clearanceChoices } from '../../utils/clearanceChoices'
import { redirect } from 'react-router-dom'

export default function VisitorsCreate() {
  return (
    <Create redirect="/visitors">
      <SimpleForm>
        <TextInput source="first_name" label="First Name" validate={required()} />
        <TextInput source="last_name" label="Last Name" validate={required()} />
        <TextInput source="email" validate={[required(), email()]} />
        <TextInput source="phone" label="Phone" />
        <TextInput source="company" />
        <TextInput source="position" />
        <SelectInput
          source="clearance_level"
          label="Clearance Level"
          choices={clearanceChoices}
          validate={required()}
        />
        <TextInput source="notes" multiline fullWidth />
      </SimpleForm>
    </Create>
  )
}
