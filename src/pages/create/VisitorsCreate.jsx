import React from 'react'
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  required,
  email,
} from 'react-admin'
import { clearanceChoices } from '../../utils/clearanceChoices'

export default function VisitorsCreate() {
  return (
    <Create>
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
        <BooleanInput source="is_active" label="Active" defaultValue={true} />
      </SimpleForm>
    </Create>
  )
}
