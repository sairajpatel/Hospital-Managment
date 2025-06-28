import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function ReceptionistProtectWrapper({children}) {
   const {isLoggedIn,user}=useSelector((state)=>state.auth);
  if(!isLoggedIn||!user||user.role!=='receptionist'){
    return <Navigate to='/receptionist-login'/>

  }
  return children;
}

export default ReceptionistProtectWrapper
