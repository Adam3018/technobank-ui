import React from 'react'
import { Edit } from 'react-admin'
import ConferenceForm from '../reusableForms/ConferenceForm'

export default function ConferencesEdit() {
  return (
    <Edit title="Edit Conference">
      <ConferenceForm />
    </Edit>
  )
}