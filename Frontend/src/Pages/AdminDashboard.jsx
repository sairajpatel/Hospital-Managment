import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logout from '../Components/Logout';

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [totalReceptionist,setReceptionist]=useState(0);


  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    const fetchReceptionistCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/receptionist/total-receptionist`, {
          withCredentials: true
        });
        setReceptionist(res.data.totalReceptionist || 0);
      } catch (err) {
        console.error("Failed to fetch receptionist count:", err);
      }
    };

    const fetchDoctorCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctor/total-doctor`, {
          withCredentials: true
        });
        setTotalDoctors(res.data.totaldoctor || 0);
      } catch (err) {
        console.error("Failed to fetch doctor count:", err);
      }
    };

    fetchDoctorCount();
    fetchReceptionistCount();
  }, []);

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
        <div className="flex justify-end mb-4">
  <Logout />
</div>
         
       
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name || 'Admin'} 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Doctors"
            value={totalDoctors}
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
            value={totalReceptionist}
            buttonText="Add Receptionist"
            onClick={() => navigate('/admin/add-receptionist')}
            color="text-purple-600"
          />
          <Card title="Patients" value="314" color="text-pink-600" />
          <Card title="Appointments Today" value="8" color="text-yellow-600" />
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
