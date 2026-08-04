import React from 'react'
import { Layout as RaLayout } from 'react-admin'
import AppBar from './AppBar'
import CustomMenu from './Menu'

export default function Layout(props) {
    return (
        <RaLayout
            {...props}
            appBar={AppBar}
            menu={CustomMenu}
        />
    )
}