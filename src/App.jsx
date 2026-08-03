import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Conferences from './pages/create/ConferencesCreate'
import VisitorsList from './pages/list/VisitorsList'
import VisitorsCreate from './pages/create/VisitorsCreate'
import VisitorsEdit from './pages/edit/VisitorsEdit'
import EmailTemplates from './pages/create/EmailTemplatesCreate'

export default function App() {
  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "#2596be", }} variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">TechnoBank Hermes</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Conferences" id="conferences-dropdown">
                <NavDropdown.Item as={Link} to="/conferences">
                  List Conferences
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/conferences/create">
                  Create Conference
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Visitors" id="visitors-dropdown">
                <NavDropdown.Item as={Link} to="/visitors">
                  List Visitors
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/visitors/create">
                  Add Visitor
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Email Templates" id="email-dropdown">
                <NavDropdown.Item as={Link} to="/email-templates">
                  View Templates
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/email-templates/create">
                  Create Template
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/conferences" replace />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/conferences/create" element={<Conferences />} />
          <Route path="/visitors" element={<VisitorsList />} />
          <Route path="/visitors/create" element={<VisitorsCreate />} />
          <Route path="/visitors/edit/:id" element={<VisitorsEdit />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/email-templates/create" element={<EmailTemplates />} />
        </Routes>
      </Container>
    </>
  )
}
