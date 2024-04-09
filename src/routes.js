import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home"
import Login from './pages/Login';
import Header from './components/Header';
import { AuthProvider } from './utils/AuthContext';


const BaseRouter = () => (
    <AuthProvider>
        <Header />
        <Routes> 
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<Login />} />
        </Routes>
    </AuthProvider>
)

export default BaseRouter;