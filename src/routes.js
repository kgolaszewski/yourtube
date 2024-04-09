import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Login from './pages/Login';
import { AuthProvider } from './utils/AuthContext';


const BaseRouter = () => (
    <AuthProvider>
        <Routes> 
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<Login />} />
        </Routes>
    </AuthProvider>
)

export default BaseRouter;