import React from 'react'

import { Edit } from "react-admin";
import EmailTemplateForm from "../reusableForms/EmailTemplateForm.jsx";

export default function EmailTemplatesEdit() {
    return (
        <Edit>
            <EmailTemplateForm />
        </Edit>
    );
}