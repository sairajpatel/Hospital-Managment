import React from 'react'
import { useSelector } from 'react-redux'
import Logout from '../Components/Logout'

function DoctorDashboard() {
  const selector = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
    <aside className="w-64 bg-white shadow-lg p-6 hidden md:flex flex-col">
  <h2 className="text-2xl font-bold text-blue-600 mb-6">Doctor Panel</h2>
  <nav className="space-y-4 text-gray-700 font-medium">
    <a className="flex items-center gap-2 hover:text-blue-500 transition-colors">
      <i className="ri-home-2-fill text-blue-400 text-xl"></i>
      <span>Dashboard</span>
    </a>
    <a className="flex items-center gap-2 hover:text-blue-500 transition-colors">
      <i className="ri-calendar-schedule-fill text-blue-400 text-xl"></i>
      <span>Appointment</span>
    </a>
    <a className="flex items-center gap-2 hover:text-blue-500 transition-colors">
      <i className="ri-group-fill text-blue-400 text-xl"></i>
      <span>Patients</span>
    </a>
    <a className="flex items-center gap-2 hover:text-blue-500 transition-colors">
      <i className="ri-database-2-fill text-blue-400 text-xl"></i>
      <span>Medical Records</span>
    </a>
    <a className="flex items-center gap-2 hover:text-blue-500 transition-colors">
      <i className="ri-bill-fill text-blue-400 text-xl"></i>
      <span>Prescription</span>
    </a>
    <a className="flex items-center gap-2 hover:text-blue-500 transition-colors">
      <i className="ri-pie-chart-2-fill text-blue-400 text-xl"></i>
      <span>Analytics</span>
    </a>
  </nav>
</aside>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white h-20 w-full flex justify-between items-center px-6 shadow-md">
          <div className="flex items-center gap-4">
            <img className="h-10 w-10 rounded-full object-cover" src="https://i.pinimg.com/474x/29/3b/b5/293bb5c342dbb64de73e141c92cc6186.jpg" alt="profile" />
            <h2 className="text-lg font-semibold">{selector.name}</h2>
          </div>
          <Logout />
        </div>

        {/* Main Page Content */}
        <main className="p-6 flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back {selector.name}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4">
  
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="bg-blue-100 p-3 rounded-full">
          <i className="ri-calendar-schedule-fill text-blue-500 text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-right text-gray-700">4</h1>
      </div>
      <h2 className="mt-4 text-gray-600 font-medium text-sm">Today's Appointments</h2>
    </div>
     <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="bg-yellow-100 p-3 rounded-full">
          <i className="ri-time-fill text-yellow-500 text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-right text-gray-700">4</h1>
      </div>
      <h2 className="mt-4 text-gray-600 font-medium text-sm">Pending Appointments</h2>
    </div>
     <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="bg-green-100 p-3 rounded-full">
          <i className="ri-task-fill text-green-500 text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-right text-gray-700">4</h1>
      </div>
      <h2 className="mt-4 text-gray-600 font-medium text-sm">Completed Today</h2>
    </div>
     <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="bg-blue-100 p-3 rounded-full">
          <i className="ri-calendar-schedule-fill text-blue-500 text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-right text-gray-700">4</h1>
      </div>
      <h2 className="mt-4 text-gray-600 font-medium text-sm">Today's Appointments</h2>
    </div>
 
</div>

        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
