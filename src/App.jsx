import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Conferences from './pages/Conferences'
import Visitors from './pages/Visitors'
import EmailTemplates from './pages/EmailTemplates'

export default function App() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">TechnoBank Hermes</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Conferences</Nav.Link>
              <Nav.Link as={Link} to="/visitors">Visitors</Nav.Link>
              <Nav.Link as={Link} to="/email-templates">Email Templates</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/" element={<Conferences />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
        </Routes>
      </Container>
    </>
  )
}
