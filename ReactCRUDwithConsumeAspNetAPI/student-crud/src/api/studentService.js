const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  // 204 No Content should return null
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  const bodyText = await response.text()

  if (!bodyText) {
    return null
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(bodyText)
    } catch (error) {
      console.warn('Unable to parse JSON response', error)
      return null
    }
  }

  return bodyText
}

export const getStudents = () => {
  return fetch(`${API_BASE_URL}/Students`, {
    headers: {
      'Accept': 'application/json',
    },
  }).then(handleResponse)
}

export const createStudent = (student) => {
  return fetch(`${API_BASE_URL}/Students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(student),
  }).then(handleResponse)
}

export const updateStudent = (id, student) => {
  return fetch(`${API_BASE_URL}/Students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(student),
  }).then(handleResponse)
}

export const deleteStudent = (id) => {
  return fetch(`${API_BASE_URL}/Students/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  }).then(handleResponse)
}

export const studentService = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
}

export default studentService

