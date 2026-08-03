import React from 'react'
import { Layout as RaLayout } from 'react-admin'
import AppBar from './AppBar'

export default function Layout(props) {
    return <RaLayout {...props} appBar={AppBar} />
}