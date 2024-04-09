import '../css/App.css';

import { React, useState, useEffect, useContext } from "react"; 
import { useNavigate } from 'react-router-dom';

import AuthContext from '../utils/AuthContext'

function Login() {
  const navigate = useNavigate()
  let { loginUser, user } = useContext(AuthContext)

  const [init, setInit] = useState(false)
  const [errors, setErrors] = useState([])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (init === false) {
      setInit(true)
    }
  }, [init])

  useEffect(() => {
    if (user) { navigate('/') }
  }, [user])


  return (
    <div className="App row">
      <div className="offset-1 col-10">

        <h1 style={{textAlign: "center"}}>Login</h1>
        {
          errors ?
          (
            <div>
              { errors.map(err => ( <div>{err}</div> )) }
            </div>
          ) : ""
        }
        <div className="offset-4 col-4">
          <form onSubmit={(e) => loginUser(e)}>
            <div>
              <label className="col-4" htmlFor="username">Username</label>
              <input 
                id="username"
                type="text"
                name="username"
                value={username} 
                onChange={ (e) => setUsername(e.target.value) } 
              />
            </div>
            <div>
              <label className="col-4" htmlFor="password">Password</label>
              <input id="password" type="password" 
                name="password"
                value={password} 
                onChange={ (e) => setPassword(e.target.value) }
              />
            </div>
            <div className="mt-4" style={{display: "flex", justifyContent: "center"}}>
              <input
                type="submit" 
                className="btn btn-sm btn-primary btn-submit"
                value="Login"
              />
            </div>
          </form>
          <div className="mt-2" style={{display: "flex", justifyContent: "center"}}>
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => navigate("/signup")}
            >
              Create an Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
