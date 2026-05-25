import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './TodoApp.css'

// 🔴 USING FULL URL - NO PROXY NEEDED!
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos'

const TodoApp = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos()
  }, [])

  // GET: Fetch all todos
  const fetchTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(API_URL)
      if (response.data.success) {
        setTodos(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to connect to backend. Make sure it\'s running on port 5000')
    } finally {
      setLoading(false)
    }
  }

  // POST: Add new todo
  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) {
      alert('Please enter a todo')
      return
    }

    try {
      const response = await axios.post(API_URL, { title: newTodo })
      if (response.data.success) {
        setTodos([response.data.data, ...todos])
        setNewTodo('')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      alert('Failed to add todo')
    }
  }

  // PUT: Toggle todo completion
  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed })
      if (response.data.success) {
        setTodos(todos.map(todo => 
          todo._id === id ? response.data.data : todo
        ))
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      alert('Failed to update todo')
    }
  }

  // DELETE: Remove todo
  const deleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        setTodos(todos.filter(todo => todo._id !== id))
      } catch (error) {
        console.error('Error deleting todo:', error)
        alert('Failed to delete todo')
      }
    }
  }

  return (
    <div className="todo-container">
      <h1 className="title">
        📝 MERN Todo App <span className="badge">No Proxy Needed!</span>
      </h1>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo..."
          className="todo-input"
          disabled={loading}
        />
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>

      {loading && todos.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading todos...
        </div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-message">
              🎯 No todos yet. Add one above!
            </li>
          ) : (
            todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="todo-checkbox"
                />
                <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      
      <div className="stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Total</span>
          <span className="stat-value">{todos.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-label">Completed</span>
          <span className="stat-value">{todos.filter(t => t.completed).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <span className="stat-label">Pending</span>
          <span className="stat-value">{todos.filter(t => !t.completed).length}</span>
        </div>
      </div>
    </div>
  )
}

export default TodoApp