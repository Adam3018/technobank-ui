import React from 'react'

import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    EditButton,
    DeleteWithConfirmButton,
} from "react-admin";

import { ListActionsEmail } from '../../customComponents/ListActionsEmail';

export default function EmailTemplatesList() {
    return (
        <List
            sort={{ field: 'created_at', order: 'DESC' }}
            actions={<ListActionsEmail onImport={() => setOpen(true)} />}
            perPage={10} // Set the number of records per page to 10
        >
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