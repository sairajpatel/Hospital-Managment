import React from 'react';
import { useSelector } from 'react-redux';

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-600">
          You are logged in as <span className="font-medium">{user.role}</span>. You have full access to manage hospital data, doctors, patients, and more.
        </p>
      </div>

      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow rounded-lg text-center">
            <p className="text-sm text-gray-500">Total Doctors</p>
            <p className="text-2xl font-bold text-blue-600">42</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg text-center">
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold text-green-600">314</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg text-center">
            <p className="text-sm text-gray-500">Appointments Today</p>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;