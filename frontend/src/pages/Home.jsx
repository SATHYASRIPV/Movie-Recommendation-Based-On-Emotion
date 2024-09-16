import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form } from '../components/Form'

export const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Home</h1>
      {/* <a href="" onClick={<Navigate to="/login">Login</Navigate>} /> */}
      {/* <a href="" onClick={<Navigate to="/register">Register</Navigate>} /> */}
      <button onClick={()=>navigate("/form")}>Form</button>
    </div>
  )
}
