import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from './api/studentService'

const emptyForm = {
  name: '',
}

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getStudents()
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to load students.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students
    }

    const lower = searchTerm.trim().toLowerCase()
    return students.filter((student) => student.name?.toLowerCase().includes(lower))
  }, [students, searchTerm])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.name.trim()) {
      setError('Name is required.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      if (editingId != null) {
        await updateStudent(editingId, {
          id: editingId,
          name: formData.name.trim(),
        })
      } else {
        await createStudent({
          name: formData.name.trim(),
        })
      }
      await loadStudents()
      resetForm()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to save student.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (student) => {
    setFormData({ name: student.name || '' })
    setEditingId(student.id)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await deleteStudent(id)
      await loadStudents()
      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to delete student.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Student Directory</h1>
        <p className="app__subtitle">
          Manage students through the ASP.NET Core Web API at
          {' '}
          <code>{import.meta.env?.VITE_API_BASE_URL || 'https://localhost:7088/api'}</code>
        </p>
      </header>

      <main className="app__content">
        {error && (
          <div className="app__alert" role="alert">
            {error}
          </div>
        )}

        <section className="card">
          <h2>{editingId != null ? 'Update Student' : 'Add Student'}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="form__field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student name"
                disabled={submitting}
                required
              />
            </label>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : editingId != null ? 'Update' : 'Create'}
              </button>
              {editingId != null && (
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card__header">
            <h2>Students</h2>
            <input
              className="search"
              type="search"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              disabled={loading}
            />
          </div>

          {loading ? (
            <p className="placeholder">Loading students…</p>
          ) : filteredStudents.length === 0 ? (
            <p className="placeholder">No students found.</p>
          ) : (
            <ul className="student-list">
              {filteredStudents.map((student) => (
                <li className="student-list__item" key={student.id}>
                  <div>
                    <p className="student-list__name">{student.name}</p>
                    <p className="student-list__meta">ID: {student.id}</p>
                  </div>
                  <div className="student-list__actions">
                    <button
                      className="btn btn--ghost"
                      type="button"
                      onClick={() => handleEdit(student)}
                      disabled={submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn--danger"
                      type="button"
                      onClick={() => handleDelete(student.id)}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
