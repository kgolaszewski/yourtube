import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Feed from "./pages/Feed"
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscribe from './pages/Subscribe';

import Header from './components/Header';

import { AuthProvider } from './utils/AuthContext';
import PrivateRoutes from './utils/PrivateRoutes';


const BaseRouter = () => (
    <AuthProvider>
        <Header />
        <Routes> 
            <Route exact path="/" element={<PrivateRoutes/>} >
                <Route exact path="/" element={<Feed/>} />
                <Route exact path="/subscribe" element={<Subscribe />} />
            </Route>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
        </Routes>
    </AuthProvider>
)

export default BaseRouter;