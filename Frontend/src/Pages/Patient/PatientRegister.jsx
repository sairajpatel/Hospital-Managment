import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    bloodgroup: "",
    allergies: "",
    symptoms: "",
  });

  const [error, setError] = useState("");
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/patient/complete-registration`,
        {
          email: formData.email,
          password: formData.password,
          bloodgroup: formData.bloodgroup,
          allergies: formData.allergies,
          Symptoms: formData.symptoms,
          role: "patient",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors[0]?.msg);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img
            className="mx-auto h-20 w-20"
            src="https://marketplace.canva.com/EAE8eSD-Zyo/1/0/1600w/canva-blue%2C-white-and-green-medical-care-logo-oz1ox2GedbU.jpg"
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Quick Patient Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register to book your appointment. Additional details will be collected at the reception.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                name="bloodgroup"
                value={formData.bloodgroup}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="2"
                placeholder="List any allergies you have..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Symptoms
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="2"
                placeholder="Describe your current symptoms..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 8 characters"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-md font-medium hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/" className="text-blue-500 hover:text-blue-600 font-medium">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientRegister; 