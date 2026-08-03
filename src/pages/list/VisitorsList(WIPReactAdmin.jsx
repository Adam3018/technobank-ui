import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteButton,
} from "react-admin";

export default function VisitorsList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />

        <TextField source="first_name" label="First Name" />
        <TextField source="last_name" label="Last Name" />

        <EmailField source="email" />

        <TextField source="company" />
        <TextField source="position" />

        <TextField source="clearance_level" label="Clearance" />

        <TextField source="phone" />

        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}