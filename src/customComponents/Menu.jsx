import React from 'react'
import { Menu } from 'react-admin'
import { Box } from '@mui/material'

export default function CustomMenu() {
  return (
    <Menu>
      <Box sx={{ height: 40 }} />

      <Menu.ResourceItem name="conferences" />
      <Menu.ResourceItem name="visitors" />
      <Menu.ResourceItem name="email-templates" />
    </Menu>
  )
}