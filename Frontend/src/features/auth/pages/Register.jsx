import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const { loading, handleRegister } = useAuth()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({userName, email, password})
        navigate("/")
    }

    if(loading){
      return(<main><h1>Loading....</h1></main>)
    }

  return (
    <main>
      <div className="form-card">
        <div className="form-card__header">
          <h1>Create Account</h1>
          <p>Register for an account</p>
        </div>
        <form onSubmit={handleSubmit} className="form">
            <div className="form__group">
            <label htmlFor="username">Username</label>
            <input 
            onChange={(e)=>setUserName(e.target.value)}
            type="text" id="username" name="username" placeholder="Enter your username" />
          </div>
          <div className="form__group">
            <label htmlFor="email">Email</label>
            <input
            onChange={(e)=>setEmail(e.target.value)}
             type="email" id="email" name="email" placeholder="Enter your email" />
          </div>
          <div className="form__group">
            <label htmlFor="password">Password</label>
            <input 
            onChange={(e)=>setPassword(e.target.value)}
            type="password" id="password" name="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="form__submit">Register</button>
        </form>
        <p className="form-card__footer">Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register