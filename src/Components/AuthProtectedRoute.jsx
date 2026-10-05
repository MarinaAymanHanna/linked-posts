import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext';

export default function AuthProtectedRoute({children}) {
    const { isLoggedin } = useContext(AuthContext);

    
    return !isLoggedin ? children : <Navigate to={"/"}/>
    }
