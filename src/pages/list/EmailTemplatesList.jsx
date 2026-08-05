import React from 'react'

import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    EditButton,
    DeleteWithConfirmButton,
} from "react-admin";

export default function EmailTemplatesList() {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" sortable={false} />
                <TextField source="subject" sortable={false} />
                <BooleanField source="is_active" />
                <EditButton />
                <DeleteWithConfirmButton />
            </Datagrid>
        </List>
    );
}