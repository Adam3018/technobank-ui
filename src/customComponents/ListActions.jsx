import React from 'react'

import { TopToolbar, CreateButton, ExportButton, Button, useListContext, useNotify, useRefresh } from "react-admin";
import { useState } from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button as MuiButton, 
    Typography 
} from '@mui/material';
import UploadIcon from "@mui/icons-material/Upload";
import VisitorAccreditationPreview from './VisitorAccreditationPreview';

export const ListActions = ({ onImport }) => {
    const { resource } = useListContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const [open, setOpen] = useState(false);
    const [openPrint, setOpenPrint] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Point this to your FastAPI backend endpoint
            const response = await fetch(`http://127.0.0.1:8000/${resource}/import`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Import failed');
            }

            const data = await response.json();
            notify(`Imported ${data.imported_count} records and skipped ${data.skipped_count} records!`, { type: 'success' });
            setOpen(false);
            setSelectedFile(null);
            refresh(); // Refreshes the React Admin list automatically
        } catch (error) {
            notify(`Error: ${error.message}`, { type: 'error' });
        } finally {
            setUploading(false);
        }
    };


    return (
        <TopToolbar>
            <CreateButton />
            <VisitorAccreditationPreview manual />
            <ExportButton />
            <Button label="Import" onClick={() => setOpen(true)}>
                <UploadIcon />
            </Button>

            {/* File Upload Modal Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Import Data ({resource})</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Upload a .csv or .xlsx file to import records directly into your list.
                    </Typography>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpen(false)} disabled={uploading}>
                        Cancel
                    </MuiButton>
                    <MuiButton
                        onClick={handleUpload}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload & Import'}
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </TopToolbar>
    )
};