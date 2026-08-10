import React, { useState } from 'react';
import { 
    TopToolbar, 
    CreateButton, 
    ExportButton, 
    Button, 
    useGetList, 
    useNotify 
} from "react-admin";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MuiButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import EmailIcon from "@mui/icons-material/Email";

export const ListActionsEmail = () => {
    const [open, setOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [selectedVisitorIds, setSelectedVisitorIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const notify = useNotify();

    // 1. Fetch email templates
    const { data: templates, isLoading: loadingTemplates } = useGetList('email-templates', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' }
    });

    // 2. Fetch visitors list
    const { data: visitors, isLoading: loadingVisitors } = useGetList('visitors', {
        pagination: { page: 1, perPage: 500 },
        sort: { field: 'first_name', order: 'ASC' }
    });

    const handleVisitorChange = (event) => {
        const { target: { value } } = event;
        setSelectedVisitorIds(typeof value === 'string' ? value.split(',') : value);
    };

    // Toggle Select All / Deselect All visitors
    const handleToggleSelectAll = () => {
        if (!visitors || visitors.length === 0) return;

        if (selectedVisitorIds.length === visitors.length) {
            // Deselect all
            setSelectedVisitorIds([]);
        } else {
            // Select all
            const allIds = visitors.map((v) => v.id);
            setSelectedVisitorIds(allIds);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setOpen(false);
            setSelectedTemplateId('');
            setSelectedVisitorIds([]);
        }
    };

    const handleSendEmails = async () => {
        if (!selectedTemplateId) {
            notify('Please select an email template', { type: 'warning' });
            return;
        }

        if (selectedVisitorIds.length === 0) {
            notify('Please select at least one visitor', { type: 'warning' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Build query params: visitor_ids=3&visitor_ids=1&visitor_ids=2
            const queryParams = new URLSearchParams();
            selectedVisitorIds.forEach((id) => queryParams.append('visitor_ids', id));

            // Calls: http://localhost:8000/email-templates/send/2?visitor_ids=3&visitor_ids=1&visitor_ids=2
            const endpointUrl = `http://localhost:8000/email-templates/send/${selectedTemplateId}?${queryParams.toString()}`;

            const response = await fetch(endpointUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail?.message || errorData.detail || 'Failed to send emails');
            }

            const data = await response.json();
            notify(`Successfully queued ${data.total_queued || data.total_recipients} emails!`, { type: 'success' });
            
            handleClose();
        } catch (error) {
            notify(`Error: ${error.message}`, { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAllSelected = visitors && visitors.length > 0 && selectedVisitorIds.length === visitors.length;

    return (
        <TopToolbar>
            <CreateButton />
            <ExportButton />
            <Button label="Send Emails" onClick={() => setOpen(true)}>
                <EmailIcon />
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Send Bulk Emails</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        
                        {/* 1. SINGLE SELECT: Email Template */}
                        <FormControl fullWidth disabled={loadingTemplates || isSubmitting}>
                            <InputLabel id="template-select-label">Select Email Template</InputLabel>
                            <Select
                                labelId="template-select-label"
                                value={selectedTemplateId}
                                label="Select Email Template"
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                            >
                                {loadingTemplates ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} sx={{ mr: 1 }} /> Loading templates...
                                    </MenuItem>
                                ) : (
                                    templates?.map((template) => (
                                        <MenuItem key={template.id} value={template.id}>
                                            {template.name || `Template #${template.id}`}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {/* 2. MULTI SELECT WITH CHECKBOXES: Visitors */}
                        <Box>
                            {/* Select All Toggle Bar */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {selectedVisitorIds.length} of {visitors?.length || 0} selected
                                </Typography>
                                <MuiButton 
                                    size="small" 
                                    onClick={handleToggleSelectAll}
                                    disabled={loadingVisitors || isSubmitting || !visitors || visitors.length === 0}
                                >
                                    {isAllSelected ? 'Deselect All' : 'Select All Visitors'}
                                </MuiButton>
                            </Box>

                            <FormControl fullWidth disabled={loadingVisitors || isSubmitting}>
                                <InputLabel id="visitors-checkbox-label">Select Visitors</InputLabel>
                                <Select
                                    labelId="visitors-checkbox-label"
                                    multiple
                                    value={selectedVisitorIds}
                                    onChange={handleVisitorChange}
                                    label="Select Visitors"
                                    renderValue={(selected) => {
                                        if (!visitors) return '';
                                        const selectedNames = visitors
                                            .filter((v) => selected.includes(v.id))
                                            .map((v) => `${v.first_name || ''} ${v.last_name || ''}`.trim() || v.email);
                                        return selectedNames.join(', ');
                                    }}
                                >
                                    {loadingVisitors ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading visitors...
                                        </MenuItem>
                                    ) : (
                                        visitors?.map((visitor) => (
                                            <MenuItem key={visitor.id} value={visitor.id}>
                                                <Checkbox checked={selectedVisitorIds.indexOf(visitor.id) > -1} />
                                                <ListItemText 
                                                    primary={`${visitor.first_name || ''} ${visitor.last_name || ''}`.trim() || 'No Name'} 
                                                    secondary={visitor.email || 'No Email'} 
                                                />
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Box>

                    </Box>
                </DialogContent>

                <DialogActions>
                    <MuiButton onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </MuiButton>
                    <MuiButton
                        variant="contained"
                        color="primary"
                        onClick={handleSendEmails}
                        disabled={isSubmitting || !selectedTemplateId || selectedVisitorIds.length === 0}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
                    >
                        {isSubmitting ? 'Sending...' : `Send (${selectedVisitorIds.length})`}
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </TopToolbar>
    );
};