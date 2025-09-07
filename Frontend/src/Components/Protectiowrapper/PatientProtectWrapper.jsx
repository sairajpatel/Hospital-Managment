import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess, logout } from '../../redux/slices/authSlice';

function PatientProtectWrapper({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true); // for spinner

  useEffect(() => {
    // only check if we don’t already have a logged-in user in Redux
    if (!isLoggedIn) {
      (async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/patient/profile`,
            { withCredentials: true }
          );
          dispatch(loginSuccess(res.data.patient));
        } catch (err) {
          dispatch(logout());
        } finally {
          setChecking(false);
        }
      })();
    } else {
      setChecking(false);
    }
  }, [isLoggedIn, dispatch]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  // now safe to decide
  if (!isLoggedIn || !user) {
    return <Navigate to="/" />;
  }

  // if you want to force registration flow:
  if (user.registrationStep !== 'complete') {
    return <Navigate to="/registration" />;
  }

  return children;
}

export default PatientProtectWrapper;
