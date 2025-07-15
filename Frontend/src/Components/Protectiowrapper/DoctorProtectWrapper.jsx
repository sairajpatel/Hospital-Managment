import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

function DoctorProtectWrapper({children}) {
  const {isLoggedIn,user}=useSelector((state)=>state.auth);
  if(!isLoggedIn||!user||user.role!=='doctor'){
    return <Navigate to='/doctor/login'/>

  }
  return children;
}

export default DoctorProtectWrapper
