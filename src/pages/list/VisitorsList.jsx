import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { visitors } from '../../api'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

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

  async function load() {
    setItems(await visitors.list())
  }

  useEffect(() => {
    load()
  }, [])


  async function remove(id) {
    if (!confirm('Delete visitor?')) return
    await visitors.remove(id)
    load()
  }

  return (
    <div>
      <h3>Visitors List</h3>
      <ListGroup>
        {items.map((v) => (
          <ListGroup.Item
            key={v.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-bold fs-5">
                {v.first_name} {v.last_name}
              </div>

              <div className="text-muted">
                <strong>Email:</strong> {v.email}
              </div>

              {v.company && (
                <div className="text-muted">
                  <strong>Company:</strong> {v.company}
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <Button
                as={Link}
                to={`/visitors/edit/${v.id}`}
                variant="outline-primary"
                size="sm"
              >
                Edit
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => remove(v.id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}