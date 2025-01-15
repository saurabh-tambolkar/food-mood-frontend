import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

function PublicRoute({children}) {
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser)
    return currentUser==null ? children : <Navigate to="/" />;
}

export default PublicRoute
