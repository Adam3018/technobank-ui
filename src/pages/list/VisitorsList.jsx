import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteWithConfirmButton,
} from 'react-admin'
import { ListActions } from '../../customComponents/ListActions';
import { clearanceChoices } from '../../utils/clearanceChoices'

export default function VisitorsList() {
  return (
    <List
      sort={{ field: 'created_at', order: 'DESC' }}
      actions={<ListActions onImport={() => setOpen(true)} />}
      perPage={10} // Set the number of records per page to 10
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="first_name" label="First Name" sortable={false} />
        <TextField source="last_name" label="Last Name" sortable={false} />
        <EmailField source="email" sortable={false} />
        <TextField source="company" />
        <TextField source="position" />
        <TextField source="clearance_level" label="Clearance" choices={clearanceChoices} />
        <TextField source="phone" sortable={false} />
        <EditButton />
        <DeleteWithConfirmButton />
      </Datagrid>
    </List>
  )
}
