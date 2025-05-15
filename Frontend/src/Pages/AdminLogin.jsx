import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../redux/slices/authSlice";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();

  


  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
     
        dispatch(loginSuccess(res.data.findAdmin));
        navigate("/admin-dashboard", { replace: true });
     
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0]?.msg);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again!");
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-screen">
      <h5 className="text-left text-2xl p-5 font-bold">Admin Login</h5>
      <img
        className="h-1/2 w-full object-cover mb-4 border rounded-xl"
        src="https://media.istockphoto.com/id/1476261444/photo/young-pharmaceutic-seller-explaining-something-to-doctor-in-hospital.jpg"
        alt="Login"
      />
      <div className="bg-[#eee] h-1/2 w-full rounded-2xl p-10 ">
        <form onSubmit={submitHandler}>
          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter Your Email"
            className="mb-7 rounded px-4 py-2 border w-full text-lg"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter Your Password"
            className="mb-7 rounded px-4 py-2 border w-full text-lg"
          />
          <button
            type="submit"
            className="bg-[#3996de] font-semibold text-white mb-4 rounded px-4 py-2 w-full text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;


