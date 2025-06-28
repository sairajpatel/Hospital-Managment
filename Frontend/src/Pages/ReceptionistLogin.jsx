import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginSuccess } from "../redux/slices/authSlice";
import axios from "axios";

function ReceptionistLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loginresponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/receptionist/login`,
        { email, password },
        {withCredentials:true}
      );
      if (loginresponse.status === 200) {
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/receptionist/profile`,
          {withCredentials:true}
        );
        dispatch(loginSuccess(profileResponse.data));
        navigate("/receptionist/dashboard");
       
      }
    
    } catch (error) {
      if (error.resposnse?.data?.errors) {
        setError(error.resposnse.data.errors[0]?.msg);
      } else if (error.resposnse?.data?.message) {
        setError(error.resposnse.data.message);
      } else {
        setError("Login failed. please try again!");
        console.log(error);
      }
    }
  };
  return (
    <div className="flex items-center justify-center flex-col">
      <img
        className="h-20 w-20"
        src="https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg"
        alt="Logo"
      />

      <h2 className=" text-2xl font-semibold">Receptionsit login portoal</h2>

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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="receptionist@hospital.com"
            />
          </div>
          <div className="relative mt-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-lock-fill text-blue-400"></i>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter Your Password"
            />
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReceptionistLogin;
