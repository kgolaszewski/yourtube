import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../utils/AuthContext'

import '../css/App.css'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div className="header" id="header">
      <Link to="/">Home</Link>
      <span> | </span>
      { user ?
        (<a href="" onClick={(e) => logoutUser()}>Logout</a>) :
        (
        <span>
          <Link to="/login">Login</Link>
        </span>
        )
      }



      {user && (<div>Hello, {user.username}</div>)}
    </div>
  )
}

export default Header
