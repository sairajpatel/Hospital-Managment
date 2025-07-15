import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../redux/slices/authSlice';

function PatientDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/patient/profile`, {
        withCredentials: true
      });
      setPatientData(response.data.patient);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/patient/logout`, {
        withCredentials: true
      });
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };
  const booknewAppointment=async()=>{
    }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] text-white">
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-8">Patient Dashboard</h1>
          <nav className="space-y-4">
            <a href="#overview" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-dashboard-line text-xl"></i>
              <span>Overview</span>
            </a>
            <a href="#appointments" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-calendar-line text-xl"></i>
              <span>Appointments</span>
            </a>
            <a href="#medical-records" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-file-list-line text-xl"></i>
              <span>Medical Records</span>
            </a>
            <a href="#prescriptions" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-medicine-bottle-line text-xl"></i>
              <span>Prescriptions</span>
            </a>
            <a href="#settings" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <i className="ri-settings-line text-xl"></i>
              <span>Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">HealthFirst Clinic</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {patientData?.name?.charAt(0)}
                </div>
                <span className="text-gray-700">{patientData?.name}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                <i className="ri-logout-box-line text-xl"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-calendar-check-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Next Appointment</h3>
              <p className="text-lg font-semibold text-gray-900">Tomorrow, 10:00 AM</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-heart-pulse-line text-2xl text-emerald-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Blood Group</h3>
              <p className="text-lg font-semibold text-gray-900">{patientData?.bloodgroup || 'Not Set'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-medicine-bottle-line text-2xl text-amber-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Active Medications</h3>
              <p className="text-lg font-semibold text-gray-900">3</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-alert-line text-2xl text-rose-600"></i>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Allergies</h3>
              <p className="text-lg font-semibold text-gray-900">{patientData?.allergies ? 'Yes' : 'None'}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Basic Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-800">{patientData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{patientData?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{patientData?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-gray-800">{patientData?.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-gray-800">{patientData?.gender}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Address</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Street</p>
                    <p className="text-gray-800">{patientData?.street}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-800">{patientData?.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="text-gray-800">{patientData?.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-gray-800">{patientData?.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pincode</p>
                    <p className="text-gray-800">{patientData?.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" action={booknewAppointment}>
                Book New Appointment
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 font-medium text-gray-600">Doctor</th>
                    <th className="pb-3 font-medium text-gray-600">Department</th>
                    <th className="pb-3 font-medium text-gray-600">Date</th>
                    <th className="pb-3 font-medium text-gray-600">Time</th>
                    <th className="pb-3 font-medium text-gray-600">Status</th>
                    <th className="pb-3 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4">Dr. Smith</td>
                    <td className="py-4">Cardiology</td>
                    <td className="py-4">Tomorrow</td>
                    <td className="py-4">10:00 AM</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                        Confirmed
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">Dr. Johnson</td>
                    <td className="py-4">General</td>
                    <td className="py-4">Next Week</td>
                    <td className="py-4">2:30 PM</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        Pending
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Medical History</h2>
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">Regular Checkup</h3>
                    <p className="text-sm text-gray-500">Dr. Smith - Cardiology</p>
                  </div>
                  <p className="text-sm text-gray-500">15 May 2024</p>
                </div>
                <p className="text-gray-600">Blood pressure normal. Prescribed routine medications.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">Fever & Cold</h3>
                    <p className="text-sm text-gray-500">Dr. Johnson - General Medicine</p>
                  </div>
                  <p className="text-sm text-gray-500">1 May 2024</p>
                </div>
                <p className="text-gray-600">Viral fever. Prescribed antibiotics and rest for 3 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard; 