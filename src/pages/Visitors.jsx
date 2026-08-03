import React, { useEffect, useState } from 'react'
import { visitors } from '../api'

export default function Visitors() {
  const [items, setItems] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [clearanceLevel, setClearanceLevel] = useState('visitor')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  async function load() {
    setItems(await visitors.list())
  }

  useEffect(() => {
    load()
  }, [])

  async function create(e) {
    e.preventDefault()
    await visitors.create({
      first_name: firstName,
      last_name: lastName,
      email,
      company: company || undefined,
      position: position || undefined,
      clearance_level: clearanceLevel,
      phone: phone || undefined,
      notes: notes || undefined,
      is_active: isActive,
    })
    setFirstName('')
    setLastName('')
    setEmail('')
    setCompany('')
    setPosition('')
    setClearanceLevel('visitor')
    setPhone('')
    setNotes('')
    setIsActive(true)
    load()
  }

  async function remove(id) {
    if (!confirm('Delete visitor?')) return
    await visitors.remove(id)
    load()
  }

  return (
    <div>
      <h2>Visitors</h2>
      <form onSubmit={create} style={{ marginBottom: 12, display: 'grid', gap: 8, maxWidth: 480 }}>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
        <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" />
        <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" />
        <input value={clearanceLevel} onChange={e => setClearanceLevel(e.target.value)} placeholder="Clearance Level" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" rows={3} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
          Active visitor
        </label>
        <button type="submit">Create</button>
      </form>
      <ul>
        {items.map(v => (
          <li key={v.id} style={{ marginBottom: 8 }}>
            <strong>{v.first_name} {v.last_name}</strong> — {v.email} {v.company ? `from ${v.company}` : ''}
            <button onClick={() => remove(v.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
