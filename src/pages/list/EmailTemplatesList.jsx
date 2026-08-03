import React from 'react'

import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin'

export default function EmailTemplatesList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
}
