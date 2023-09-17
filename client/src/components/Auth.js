import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogIn, setIsLogin] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)

  console.log(cookies)

  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLogIn && password !== confirmPassword) {
      setError('Passwords need to match; try again! :)')
      return
    }

    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })
    const data = await response.json()

    console.log("data", data);

    if (data.detail) {
    setError(data.detail)
    } else { 
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)

      window.location.reload()
    }
  }




  return (

    <div className="auth-container">
      <div className="auth-container-box">
          <form>
            <h2>{isLogIn ? 'Please log in' : 'Please sign up!'}</h2>
            <input type="email" placeholder='Your Email' onChange={(e) => setEmail(e.target.value)}/>
            <input type="password"  placeholder='Your Password' onChange={(e) => setPassword(e.target.value)}/>
            {!isLogIn && <input type="password"  
            placeholder='Confirm Your Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            />}
            <input type="submit" className="create" onClick={(e) => handleSubmit(e, isLogIn ? 'login' : "signup")}/>
            {error && <p>{error}</p>}
          </form>
          <div className="auth-options">
            <button onClick={() => viewLogin(false)}
            style={{backgroundColor : !isLogIn ? 'rgb(255, 255, 255)': 'rgb(188, 188, 188)'}}
            >Sign Up</button>
            <button onClick={() => viewLogin(true)}
            style={{backgroundColor : isLogIn ? 'rgb(255, 255, 255)': 'rgb(188, 188, 188)'}}
            >LogIn</button>
          </div>
      </div>

    </div>
  )
}

export default Auth