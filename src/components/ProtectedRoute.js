// import React, { useContext } from 'react'
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/Auth';

// function ProtectedRoute({children}) {
//   // const Navigate
//   const {currentUser} = useContext(AuthContext);
//   console.log('This is curernt user',currentUser)
//   return currentUser !== null ? children : <Navigate to="/sign-in" />;
// }

// export default ProtectedRoute


import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Replace with your loader or spinner
  }

  return currentUser ? children : <Navigate to="/sign-in" />;
}

export default ProtectedRoute;
