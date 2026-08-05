import React from 'react'
import { AppBar as RaAppBar, TitlePortal } from 'react-admin'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

export default function AppBar(props) {
  return (
    <RaAppBar {...props}>
      <Typography
        variant="h6"
        color="inherit"
        sx={{ flex: 1, fontWeight: 600 }}
      >
        TechnoBank Hermes
      </Typography>
      {/* Renders nothing visible, but keeps react-admin's internal title
          plumbing happy so pages don't throw looking for a portal target */}
      <TitlePortal sx={{ display: 'none' }} />

    </RaAppBar>
  )
}
