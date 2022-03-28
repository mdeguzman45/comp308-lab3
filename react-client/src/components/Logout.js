import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth";

export default function Logout({showSnackBar, clearTokens}) {
	const navigate = useNavigate();

  const { authTokens } = useAuth();
	const [studentId, setStudentId] = useState(authTokens.id);

	// get the student data
	useEffect(() => {
		// for now lets just remove the token on the local storage
		localStorage.removeItem("tokens");
		clearTokens();
		
		const sbMsg = 'Logout successful';
		showSnackBar({message: sbMsg, severity: 'success'});

		// return to login page
		navigate('/');
	}, []);

  return (
    <div></div>
  )
}
