import '../css/App.css';
import badPasswords from '../utils/badPasswords';
import BACKEND_URL from '../utils/config'

import axios from "axios";
import { React, useState, useEffect, useContext } from "react"; 
import { useNavigate } from 'react-router-dom';

import AuthContext from '../utils/AuthContext'


function Signup() {
  const navigate = useNavigate()
  let { loginUser, user } = useContext(AuthContext)

  const [init, setInit] = useState(false)
  const [errors, setErrors] = useState([])

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")

  useEffect(() => {
    if (init === false) {
      setInit(true)
    }
  }, [init])

  useEffect(() => {
    if (user) { navigate('/') }
  }, [user])

  const validate = (data) => {
    let errors = []

    // TODO: this does not accept valid domains like example@hotmail.co.uk 
    const emailRegex = /[a-zA-Z1-9]+@[a-z]+\.[a-z]{2,3}$/ 

    const emailError = "Please enter a valid email."
    const confirmationError = "Your passwords do not match."
    const shortPassword = "Your password must be at least 8 characters."
    const badPassword = "Your password is too common. Please choose a different one."

    if (data.email.match(emailRegex)) { errors = [...errors, emailError] }
    if (data.password !== data.confirmation) { errors = [...errors, confirmationError] }
    if (data.password.length < 8) { errors = [...errors, shortPassword]}
    if (badPasswords.includes(data.password)) { errors = [...errors, badPassword]}

  }

const handleSubmit = async (e) => {
  e.preventDefault()

  console.log(e)

  let data = {
    username: e.target.username.value,
    email: e.target.email.value,
    password: e.target.password.value,
    confirmation: e.target.confirmation.value,
  }

  console.log(data)
  let dataErrors = validate(data)

  if (dataErrors) { setErrors(dataErrors) }
  else {
    console.log('Attempting user signup...')
    let signupSuccess = await axios
      .post(`${BACKEND_URL}/api/signup/`, {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmation: data.confirmation,
      }) 
      .then(res => { console.log(res); return res})
      .catch(err => {console.log(err); return null;})
      // .then( () => navigate("/"))
    
    if (signupSuccess) { loginUser(e) }
    
  }

}



  

  return (
    <div className="App row">
      <div className="offset-1 col-10">
        <h1 style={{textAlign: "center"}}>Create an Account</h1>
        {
          errors ?
          (
            <div>
            {
              errors.map(err => (
                <div>{err}</div>
              ))
            }
            </div>
          ) : ""
        }
        <div className="offset-4 col-4">
        <form onSubmit={(e) => handleSubmit(e)}>
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
            <label className="col-4" htmlFor="username">Email</label>
            <input 
              id="email" 
              type="text"
              value={email} 
              name="email"
              onChange={ (e) => setEmail(e.target.value) } 
            />
          </div>
          <div>
            <label className="col-4" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              name="password" 
              onChange={ (e) => setPassword(e.target.value) }
            />
          </div>
          <div>
          <label className="col-4" htmlFor="confirmation">Confirmation</label>
          <input 
            id="confirmation" 
            type="password" 
            value={confirmation} 
            name="confirmation"
            onChange={ (e) => setConfirmation(e.target.value) } />
          </div>
          <div className="mt-4" style={{display: "flex", justifyContent: "center"}}>
            <button 
              className="btn btn-sm btn-success btn-submit"
              // onClick={() => handleSubmit({
              //   username: username, email: email, password: password, confirmation: confirmation
              // })} 
            >
              Submit
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
