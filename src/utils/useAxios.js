import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { useContext } from 'react'
import AuthContext from './AuthContext'
import BACKEND_URL from './config'

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)

  const axiosInstance =  axios.create({
    baseURL: BACKEND_URL,
    headers: {Authorization: `Bearer ${authTokens?.access}`}
  })

  axiosInstance.interceptors.request.use(async req => {
  
    const user = jwtDecode(authTokens.access)
    const tokenIsValid = dayjs.unix(user.exp).diff() >= 1;
  
    // exit function if token is not yet expired
    if (tokenIsValid) { return req }  
  
    const response = await axios.post(
      `${BACKEND_URL}/api/token/refresh/`,
      {
        refresh: authTokens.refresh,
      }
    )
  
    localStorage.setItem('authTokens', JSON.stringify(response.data))

    setAuthTokens(response.data)
    setUser(jwtDecode(response.data.access))

    req.headers.Authorization = `Bearer ${response.data.access}`
    return req
  })

  return axiosInstance
}

export default useAxios