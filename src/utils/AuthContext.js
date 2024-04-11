import { useState, useEffect, createContext } from 'react';
import { jwtDecode } from "jwt-decode";
import BASE_URL from './config'

const AuthContext = createContext()


export const AuthProvider = ({children}) => {

  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? 
    JSON.parse(localStorage.getItem('authTokens')) : null
  )
  let [user, setUser] = useState(() =>
    localStorage.getItem('authTokens') ? 
      jwtDecode(localStorage.getItem('authTokens')) : null
  )

  let [loading, setLoading] = useState(false)

  const loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch(
      `${BASE_URL}/api/token/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "username": e.target.username.value,
          "password": e.target.password.value,
        })
      }
    )

    let data = await response.json()
    
    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
    }
    else { alert("Something went wrong!") }
  }

  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
  }

  const updateToken = async () => {
    let response = await fetch(
      `${BASE_URL}/api/token/refresh/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {"refresh": authTokens?.refresh })
      }
    )

    let data = await response.json()

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
    }
    else {
      logoutUser()
    }

    if (loading) {
      setLoading(false)
    }
  }

  let contextData = {

    user: user,
    authTokens: authTokens,

    loginUser: loginUser,
    logoutUser: logoutUser,

    setAuthTokens: setAuthTokens,
    setUser: setUser,
  }

  return (
    <AuthContext.Provider value={contextData} >
      { loading ? null : children }
    </AuthContext.Provider>
  )
};

export default AuthContext;