import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Conferences from './pages/Conferences'
import Visitors from './pages/Visitors'
import EmailTemplates from './pages/EmailTemplates'

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>TechnoBank UI</h1>
        <nav>
          <Link to="/">Conferences</Link>
          <Link to="/visitors">Visitors</Link>
          <Link to="/email-templates">Email Templates</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Conferences />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
        </Routes>
      </main>
    </div>
  )
}
