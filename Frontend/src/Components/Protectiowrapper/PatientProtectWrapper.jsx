import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function PatientProtectWrapper({children}) {
  const {isLoggedIn, user} = useSelector((state) => state.auth);
  
  if (!isLoggedIn || !user || user.role!=='patient') {
    return <Navigate to='/patient/login' />;
  }
  
  return children;
}

export default PatientProtectWrapper; 