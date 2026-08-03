import React from 'react'
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  required,
  email,
} from 'react-admin'
import { clearanceChoices } from '../../utils/clearanceChoices'

export default function VisitorsEdit() {
  return (
    <Edit mutationMode="pessimistic">
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
    </Edit>
  )
}
