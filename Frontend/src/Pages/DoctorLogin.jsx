import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginSuccess } from "../redux/slices/authSlice";
import Cookies from 'js-cookie';

function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setErrror] = useState("");
  const [loading, setLoading] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    setErrror("");
    setLoading(true);
    
    try {
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (loginResponse.status === 200) {
        // Store token in cookie
        const { token, user } = loginResponse.data;
        Cookies.set('token', token, { 
          secure: true,
          sameSite: 'none',
          expires: 1 // 1 day
        });

        // Set token in axios default headers for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Get user profile with the token
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctor/profile`,
          { 
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Dispatch login success with combined user data
        const userData = {
          ...user,
          ...profileResponse.data,
          token
        };
        
        dispatch(loginSuccess(userData));
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.errors) {
        setErrror(error.response.data.errors[0]?.msg);
      } else if (error.response?.data?.message) {
        setErrror(error.response.data.message);
      } else {
        setErrror("Login failed. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <img
        className="h-20 w-20"
        src="https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg"
        alt="Logo"
      />

      <h2 className="text-2xl font-semibold">Doctor Login Portal</h2>

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <form onSubmit={loginHandler}>
          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
          )}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-user-fill text-blue-400"></i>
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="doctor@hospital.com"
              disabled={loading}
            />
          </div>
          <div className="relative mt-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-lock-fill text-blue-400"></i>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter Your Password"
              disabled={loading}
            />
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 !rounded-button whitespace-nowrap cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorLogin;
