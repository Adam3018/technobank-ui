import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { visitors } from '../../api'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function VisitorsEdit() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [items, setItems] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [clearanceLevel, setClearanceLevel] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  async function load() {
    const data = await visitors.get(id)
    setItems(data)
    setFirstName(data.first_name || '')
    setLastName(data.last_name || '')
    setEmail(data.email || '')
    setCompany(data.company || '')
    setPosition(data.position || '')
    setClearanceLevel(data.clearance_level || '')
    setPhone(data.phone || '')
    setNotes(data.notes || '')
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <h2 className="mb-4">Edit Visitor</h2>
      <Form
        className="mb-4"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!confirm("Are you sure you want to save changes?")) return
          await visitors.update(id, {
            first_name: firstName,
            last_name: lastName,
            email,
            company,
            position,
            clearance_level: clearanceLevel,
            phone,
            notes
          })
          navigate('/visitors')
          alert('Visitor updated successfully!')
        }}
      >
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
            // onClick={(e) => {
            //   if (!confirm("Are you sure you want to save changes?")) {
            //     e.preventDefault();
            //   }
            // }}
            >
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>

    </div>
  )
}