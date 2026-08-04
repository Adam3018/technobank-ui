import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteWithConfirmButton,
} from 'react-admin'
import { ListPaginationWithActions } from '../../customComponents/ListPaginationWithActions';
import { clearanceChoices } from '../../utils/clearanceChoices'

export const VisitorsList = (props) => {
  return (
    <List
      {...props}
      actions={false} // Hides top action bar (Create/Export)
      pagination={<ListPaginationWithActions />} // Places actions in bottom bar
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="first_name" label="First Name" />
        <TextField source="last_name" label="Last Name" />
        <EmailField source="email" />
        <TextField source="company" />
        <TextField source="position" />
        <TextField source="clearance_level" label="Clearance" choices={clearanceChoices} />
        <TextField source="phone" />
        <EditButton />
        <DeleteWithConfirmButton  />
      </Datagrid>
    </List>
  )
}
