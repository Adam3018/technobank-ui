import React from 'react'
import { Create } from 'react-admin'
import ConferenceForm from  '../reusableForms/ConferenceForm'

export default function ConferencesCreate() {
  return (
    <Create title="Create Conference">
      <ConferenceForm />
    </Create>
  )
}