import axios from 'axios';
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router';
import { logout } from '../redux/slices/authSlice';


function Logout() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleLogout=()=>{
        try{
       axios.get(`${import.meta.env.VITE_BASE_URL}/admin/logout`,{ withCredentials:true,},
      

       )
        dispatch(logout());
      
        }
        catch(err){
       console.log(err)
        }
    }

    return (
        <div>
            <button onClick={handleLogout}className='bg-red-600 px-4 py-2 rounded-2xl text-white font-semibold text-xl' >Logout</button>
        </div>
    )
}

export default Logout
