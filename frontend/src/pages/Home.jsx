import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Home.css';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div align="center">
      <h1>Home</h1>
      <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
      <Link to="/register">Register</Link>
      <br />
      <button onClick={() => navigate('/form')} style={{ marginTop: '20px' }}>
        Go to Form
      </button>
      <button onClick={() => navigate('/emotion')} style={{ marginTop: '20px' }}>Click Emotion</button>
      </div>
  )
}
