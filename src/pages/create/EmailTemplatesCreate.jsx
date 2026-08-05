import React from 'react'


import { Create } from "react-admin";
import EmailTemplateForm from "../reusableForms/EmailTemplateForm";

export default function EmailTemplatesCreate() {
    return (
        <Create>
            <EmailTemplateForm />
        </Create>
    );
}