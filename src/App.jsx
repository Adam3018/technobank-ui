import React from 'react'
import { Admin, Resource } from 'react-admin'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import EmailIcon from '@mui/icons-material/Email'
import dataProvider from './dataProvider'
import Layout from './Layout'

import VisitorsList from './pages/list/VisitorsList'
import VisitorsCreate from './pages/create/VisitorsCreate'
import VisitorsEdit from './pages/edit/VisitorsEdit'

import ConferencesList from './pages/list/ConferencesList'
import ConferencesCreate from './pages/create/ConferencesCreate'
import ConferencesEdit from './pages/edit/ConferencesEdit'

import EmailTemplatesList from './pages/list/EmailTemplatesList'
import EmailTemplatesCreate from './pages/create/EmailTemplatesCreate'
import EmailTemplatesEdit from './pages/edit/EmailTemplatesEdit'

const theme = {
  palette: {
    primary: { main: '#2596be' },
    secondary: { main: '#2596be' },
  }
}

export default function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      title="TechnoBank Hermes"
      theme={theme}
      layout={Layout}
    >
      <Resource
        name="conferences"
        icon={EventIcon}
        list={ConferencesList}
        create={ConferencesCreate}
        edit={ConferencesEdit}
      />
      <Resource
        name="visitors"
        icon={PeopleIcon}
        list={VisitorsList}
        create={VisitorsCreate}
        edit={VisitorsEdit}
      />
      <Resource
        name="email-templates"
        icon={EmailIcon}
        options={{ label: 'Email Templates' }}
        list={EmailTemplatesList}
        create={EmailTemplatesCreate}
        edit={EmailTemplatesEdit}
      />
    </Admin>
  )
}
