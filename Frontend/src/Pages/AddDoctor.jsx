import React, { useState } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { useNavigate } from "react-router";

function AddDoctor() {
  const [specialization, setSpecialization] = useState("");
  const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Oncology",
    "Radiology",
    "Psychiatry",
  ];
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [flatno, setFlatno] = useState("");
  const [password, setPassword] = useState("");
  const [pincode, setPincode] = useState("");
  const navigate = useNavigate();
  const [errors, setError] = useState("");

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-doctor`,
        {
          firstname,
          lastname,
          email,
          password,
          phone,
          country,
          state,
          city,
          street,
          pincode,
          flatno,
          specialization,
          experience,
        },
        {withCredentials:true}
      );
      if(response.status===200){
        navigate('/admin-dashboard')
      }
    } catch (error) {
        console.log(error.response)
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
    <div className="h-screen w-50">
      <div className="flex items-center gap-4">
        <img
          className="h-20 w-20"
          src="https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg"
          alt="Logo"
        />
        <h1 className="text-center font-bold text-xl"> Doctor Registration</h1>
      </div>

      <div className="relative p-5 h-[30%] bg-blue-400">
        <div
          className="absolute inset-0 bg-cover bg-center object-cover"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Professional%20medical%20environment%20with%20doctors%20in%20white%20coats%20working%20in%20a%20modern%20hospital%20setting%20with%20blue%20accents%20and%20medical%20equipment%2C%20clean%20clinical%20environment%2C%20soft%20lighting%2C%20professional%20atmosphere&width=1440&height=400&seq=1&orientation=landscape')`,
            opacity: 0.3,
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Our Network of Medical Professionals
          </h2>
          <p className="text-xl text-white max-w-2xl">
            Complete the registration form below to become a certified
            WebDoctor. Your information will be verified to ensure the highest
            standards of care.
          </p>
        </div>
      </div>
      <div className="bg-blue-100 border-2 p-5">
        <h2 className="text-xl font-bold">Doctor Registration Form</h2>
      </div>
      <form onSubmit={submithandler}>
        {errors && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{errors}</p>
          )}
        <div className="p-5">
          <div className="flex items-center gap-2 ">
            <i className="text-blue-400 text-xl ri-user-fill"></i>
            <h1 className="text-xl font-semibold">Personal Information</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter First Name"
            />
            <input
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Last Name"
            />
            <select
              className="p-2 border-2 bg-[#eee] h-10 rounded-lg w-full text-sm"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">Select your specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <input
              value={experience}
              onChange={(e) => {
                setExperience(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="number"
              placeholder="Enter Years of Experience"
            />
          </div>
        </div>
        <div className="mt-3 p-5">
          <div className="flex items-center gap-2 ">
            <i className="text-blue-400 text-xl ri-contacts-book-2-fill"></i>
            <h1 className="text-xl font-semibold">Contact Information</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Email Address"
            />
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Phone Number"
            />
          </div>
        </div>
        <div className="mt-3 p-5">
          <div className="flex items-center gap-2 ">
            <i className="text-blue-400 text-xl ri-home-heart-fill"></i>
            <h1 className="text-xl font-semibold">Address</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            <select
              className="p-2 border-2 bg-[#eee] h-10 rounded-lg w-full text-sm"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            >
              <option value="">Select your Country</option>
              <option value="CAN">CAN</option>
              <option value="USA">USA</option>
            </select>
            <input
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Your State"
            />
            <input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Your City"
            />
            <input
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Your Street"
            />
            <input
              value={flatno}
              onChange={(e) => {
                setFlatno(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Your Flat No"
            />
            <input
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
              }}
              className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
              type="text"
              placeholder="Enter Your Pincode"
            />
          </div>

          <div className="mt-3 ">
            <div className="flex items-center gap-2">
              <i className="text-blue-400 text-xl ri-user-fill"></i>
              <h1 className="text-xl font-semibold">Password</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <input
                className="p-5 border-2 bg-[#eee] h-10 rounded-lg "
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter Password"
              />
            </div>
          </div>
          <div className="mt-5 ">
            <div className="flex items-center justify-center ">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              >
                Submit Registration
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDoctor;
