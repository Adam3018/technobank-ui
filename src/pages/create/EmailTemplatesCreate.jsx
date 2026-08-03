import React, { useEffect, useState } from 'react'
import { emailTemplates } from '../../api'

export default function EmailTemplates(){
  const [items,setItems]=useState([])
  const [title,setTitle]=useState('')

  async function load(){ setItems(await emailTemplates.list()) }
  useEffect(()=>{ load() },[])

  async function create(e){
    e.preventDefault()
    await emailTemplates.create({ title })
    setTitle('')
    load()
  }

  async function remove(id){
    if(!confirm('Delete template?')) return
    await emailTemplates.remove(id)
    load()
  }

  return (
    <div>
      <h2>Email Templates</h2>
      <form onSubmit={create} style={{ marginBottom:12 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
        <button type="submit">Create</button>
      </form>
      <ul>
        {items.map(t=> <li key={t.id}>{t.title} <button onClick={()=>remove(t.id)} style={{ marginLeft:8 }}>Delete</button></li>)}
      </ul>
    </div>
  )
}
