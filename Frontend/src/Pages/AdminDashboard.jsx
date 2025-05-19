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
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Admin Panel</h2>
        <nav className="space-y-4 text-gray-700 font-medium">
          <SidebarLink label="Dashboard" />
          <SidebarLink label="Doctors" />
          <SidebarLink label="Nurses" />
          <SidebarLink label="Receptionists" />
          <SidebarLink label="Patients" />
          <SidebarLink label="Appointments" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name || 'Admin'} 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Doctors"
            value="42"
            buttonText="Add Doctor"
            onClick={() => navigate('/admin/add-doctor')}
            color="text-blue-600"
          />

          <Card
            title="Nurses"
            value="27"
            buttonText="Add Nurse"
            onClick={() => navigate('/admin/add-nurse')}
            color="text-green-600"
          />

          <Card
            title="Receptionists"
            value="5"
            buttonText="Add Receptionist"
            onClick={() => navigate('/admin/add-receptionist')}
            color="text-purple-600"
          />

          <Card
            title="Patients"
            value="314"
            color="text-pink-600"
          />

          <Card
            title="Appointments Today"
            value="8"
            color="text-yellow-600"
          />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ label }) {
  return (
    <div className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
      {label}
    </div>
  );
}

function Card({ title, value, buttonText, onClick, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between h-full">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default AdminDashboard;
