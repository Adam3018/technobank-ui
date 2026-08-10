import React, { useRef } from 'react';
import {
    SimpleForm,
    TextInput,
    BooleanInput,
    required,
    maxLength,
} from "react-admin";
import { 
    RichTextInput, 
    RichTextInputToolbar,
    LevelSelect,
    FormatButtons,
    ListButtons,
    LinkButtons,
    QuoteButtons,
    DefaultEditorOptions,
    ImageButtons,
} from "ra-input-rich-text";
import { Button, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function EmailTemplateForm() {
    const editorRef = useRef(null);

    const handleInsert = (e, text) => {
        e.preventDefault();
        e.stopPropagation();

        if (editorRef.current) {
            editorRef.current.chain().focus().insertContent(text).run();
        }
    };

    const placeholders = [
        { label: 'First Name', value: '{{first_name}}' },
        { label: 'Last Name', value: '{{last_name}}' },
        { label: 'Email', value: '{{email}}' },
        { label: 'Company', value: '{{company}}' },
    ];

    const CustomToolbar = () => (
        <RichTextInputToolbar>
            <LevelSelect />
            <FormatButtons />
            <ListButtons />
            <LinkButtons />
            <QuoteButtons />
            <ImageButtons />
            <Box display="flex" gap={0.5} mx={1} alignItems="center">
                {placeholders.map((item) => (
                    <Button
                        key={item.value}
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon fontSize="small" />}
                        onMouseDown={(e) => handleInsert(e, item.value)}
                        sx={{ textTransform: 'none', py: 0.2, px: 1, fontSize: '1rem', marginLeft: '4px', height: '35px' }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
        </RichTextInputToolbar>
    );

    return (
        <SimpleForm redirect="list">
            <TextInput source="name" label="Template Name" fullWidth validate={[required(), maxLength(255)]} />
            <TextInput source="subject" fullWidth validate={[required(), maxLength(500)]} />

            <RichTextInput 
                source="body" 
                fullWidth
                validate={[required()]}
                toolbar={<CustomToolbar />}
                editorOptions={{
                    ...DefaultEditorOptions, // 👈 Fixes the schema missing 'doc' error!
                    onUpdate: ({ editor }) => {
                        editorRef.current = editor;
                    },
                    onFocus: ({ editor }) => {
                        editorRef.current = editor;
                    },
                }}
            />

            <BooleanInput source="is_active" label="Active" />
        </SimpleForm>
    );
}