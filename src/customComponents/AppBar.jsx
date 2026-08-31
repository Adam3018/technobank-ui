import React from 'react'
import { AppBar as RaAppBar } from 'react-admin'
import { Box, Typography } from '@mui/material'

export default function AppBar(props) {
  return (
    <RaAppBar
      {...props}
      sx={{
        bgcolor: '#12233B',
        color: '#F5F6F4',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        '& .RaAppBar-menuButton': { color: '#F5F6F4' },
        '& .MuiIconButton-root': { color: '#F5F6F4' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <img
          src="/logo-white-nobg.png"
          alt="TechnoBank Logo"
          style={{ height: 28, width: 'auto' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
          TechnoBank Hermes
        </Typography>
      </Box>
    </RaAppBar>
  )
}