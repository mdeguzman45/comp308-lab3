import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "./auth";

export default function PrivateRoute ({children}) {
  // const isAuthenticated = useAuth();
	const { authTokens } = useAuth();
	console.log('auth tokens -> ', authTokens);
	      
  if (authTokens) {
    return children
  }
    
  return <Navigate to="/" />
}