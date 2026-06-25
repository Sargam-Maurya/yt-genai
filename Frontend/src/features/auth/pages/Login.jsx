import { Link } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import '../auth.form.scss'

const Login = () => {
    const { loading, handleLogin} = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({email, password})
        navigate("/")
    }
    if(loading){
      return(<main><h1>Loading...</h1></main>)
    }


  return (
    <main>
      <div className="form-card">
        <div className="form-card__header">
          <h1>Welcome Back</h1>
          <p>Login to your account to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form__group">
            <label htmlFor="email">Email</label>
            <input 
            onChange={(e)=>{setEmail(e.target.value)}}
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your email" 
            />
          </div>
          <div className="form__group">
            <label htmlFor="password">Password</label>
            <input 
            onChange={(e)=>{setPassword(e.target.value)}}
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter your password" 
            />
          </div>
          <button type="submit" className="form__submit">Login</button>
        </form>
         <p className="form-card__footer">Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
    
  )
}

export default Login