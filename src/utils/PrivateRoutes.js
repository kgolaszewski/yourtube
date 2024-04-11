import { useContext } from 'react'
import AuthContext from './AuthContext'
import { Navigate, Outlet } from 'react-router-dom'


const PrivateRoutes = () => {
  let { user } = useContext(AuthContext)
  return (
    user ? <Outlet /> : <Navigate to="/login" />
  )
}

export default PrivateRoutes;