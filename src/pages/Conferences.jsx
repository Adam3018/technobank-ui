import React, { useEffect, useState } from 'react'
import { conferences } from '../api'

export default function Conferences() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')

  async function load() {
    const data = await conferences.list()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  async function create(e) {
    e.preventDefault()
    await conferences.create({ title })
    setTitle('')
    load()
  }

  async function remove(id) {
    if (!confirm('Delete item?')) return
    await conferences.remove(id)
    load()
  }

  return (
    <div>
      <h2>Conferences</h2>
      <form onSubmit={create} style={{ marginBottom: 12 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
        <button type="submit">Create</button>
      </form>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <strong>{i.title}</strong> — {i.id}
            <button onClick={() => remove(i.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
