import React, { useEffect, useState } from 'react'
import { visitors } from '../../api'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Visitors() {
  const [items, setItems] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [clearanceLevel, setClearanceLevel] = useState('')
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
    setClearanceLevel('')
    setPhone('')
    setNotes('')
    setIsActive(true)
    load()
  }

  return (
    <div>
      <h2 className="mb-4">Visitors</h2>
      <Form onSubmit={create} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Company"
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="Position"
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Clearance Level</Form.Label>
              <Form.Select
                value={clearanceLevel}
                onChange={e => setClearanceLevel(e.target.value)}
                aria-label="Clearance Level"
                required
              >
                <option value="" disabled>
                  Select clearance
                </option>
                <option value="visitor">Visitor</option>
                <option value="vip">VIP</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="presenter">Presenter</option>
              </Form.Select>
            </Form.Group>
          </Col>

        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes"
                rows={2}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex justify-content-start">
            <Button
              variant="primary"
              type="submit"
              disabled={!firstName || !lastName || !email || !clearanceLevel}
            >
              Create
            </Button>
          </Col>
        </Row>
      </Form>

    </div>
  )
}