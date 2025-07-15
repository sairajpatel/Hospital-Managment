import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function PatientProtectWrapper({children}) {
  const {isLoggedIn, user} = useSelector((state) => state.auth);
  
  if (!isLoggedIn || !user || user.registrationStep=='complete') {
    return <Navigate to='/' />;
  }
  
  return children;
}

export default PatientProtectWrapper; 