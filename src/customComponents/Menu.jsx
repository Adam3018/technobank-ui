import React from 'react'
import { Menu, TitlePortal } from 'react-admin'
import { Box, Divider } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'

export default function CustomMenu() {
  return (
    <Menu
      sx={{
        bgcolor: '#172841',
        height: '100%',
        px: 1,
        py: 2,
        '& a, & a *': {
          color: '#F5F6F4 !important',
        },
        '& .RaMenuItemLink-root': {
          borderRadius: 1,
          mx: 0.5,
          mb: 0.5,
          fontSize: '0.9rem',
          fontWeight: 500,
          borderLeft: '3px solid transparent',
        },
        '& .RaMenuItemLink-root:hover': {
          bgcolor: 'rgba(255,255,255,0.06)',
        },
        '& a[aria-current="page"]': {
          bgcolor: 'rgba(232,163,61,0.12)',
          borderLeft: '3px solid #E8A33D',
        },
      }}
    >
      <Box sx={{ px: 2, pb: 2, pt: 1.5 }}>
        <Box sx={{ color: '#8FA3B8', fontSize: '0.8rem', mt: 0.5 }}>
          <TitlePortal />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1.5 }} />

      <Menu.Item to="/conferences" primaryText="Conferences" leftIcon={<EventIcon />} />
      <Menu.Item to="/visitors" primaryText="Visitors" leftIcon={<PeopleAltIcon />} />
      <Menu.Item to="/email-templates" primaryText="Email Templates" leftIcon={<EmailOutlinedIcon />} />
    </Menu>
  )
}