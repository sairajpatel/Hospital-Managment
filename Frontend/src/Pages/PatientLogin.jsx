import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginSuccess } from "../redux/slices/authSlice";
import axios from "axios";

function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/login`,
        { email, password },
        { withCredentials: true }
      );
      if (loginResponse.status === 200) {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/profile`,
          { withCredentials: true }
        );
        dispatch(loginSuccess(profileResponse.data));
        navigate("/patient/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors[0]?.msg);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-50">
      <img
        className="h-20 w-20 mb-4"
        src="https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg"
        alt="Logo"
      />

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Patient Login Portal</h2>

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <form onSubmit={loginHandler}>
          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
          )}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-user-fill text-blue-400"></i>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="patient@example.com"
              required
            />
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-lock-fill text-blue-400"></i>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/patient/register" className="text-blue-500 hover:text-blue-600 font-medium">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin; 