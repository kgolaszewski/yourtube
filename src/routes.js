import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import { AuthProvider } from './utils/AuthContext';


const BaseRouter = () => (
    <AuthProvider>
        <Header />
        <Routes> 
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
        </Routes>
    </AuthProvider>
)

export default BaseRouter;