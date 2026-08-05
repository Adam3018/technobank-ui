import React from 'react'
import { Layout as RaLayout } from 'react-admin'
import AppBar from './customComponents/AppBar'
import CustomMenu from './customComponents/Menu'

export default function Layout(props) {
    return (
        <RaLayout
            {...props}
            appBar={AppBar}
            menu={CustomMenu}
        />
    )
}