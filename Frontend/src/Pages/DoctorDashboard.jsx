import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Logout from '../Components/Logout'
import axios from 'axios';
import DoctorSchedule from '../Components/DoctorSchedule';

function DoctorDashboard() {
  const selector = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingRequests: 0,
    todayAppointments: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add base URL to axios requests
        const baseURL = '/api/doctor';
        
        // Add request interceptor for debugging
        axios.interceptors.request.use(request => {
          console.log('Starting Request:', request);
          return request;
        });

        // Add response interceptor for debugging
        axios.interceptors.response.use(response => {
          console.log('Response:', response);
          return response;
        }, error => {
          console.error('Response Error:', error);
          return Promise.reject(error);
        });

        const [statsRes, appointmentsRes, requestsRes] = await Promise.all([
          axios.get(`${baseURL}/appointment-stats`),
          axios.get(`${baseURL}/appointments`),
          axios.get(`${baseURL}/recent-requests`)
        ]);

        console.log('Stats Response:', statsRes.data);
        console.log('Appointments Response:', appointmentsRes.data);
        console.log('Requests Response:', requestsRes.data);

        // Check if the responses contain the expected data structure
        const statsData = statsRes.data?.stats || {
          totalAppointments: 0,
          pendingRequests: 0,
          todayAppointments: 0
        };
        
        const appointmentsData = appointmentsRes.data?.appointments || [];
        const requestsData = requestsRes.data?.requests || [];

        setStats(statsData);
        setAppointments(appointmentsData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to remove interceptors
    return () => {
      axios.interceptors.request.clear();
      axios.interceptors.response.clear();
    };
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setError(null);
      const baseURL = '/api/doctor';
      
      console.log('Updating appointment status:', { appointmentId, newStatus });
      
      const updateRes = await axios.put(`${baseURL}/update-appointment`, {
        appointmentId,
        status: newStatus
      });



      setAppointments(appointmentsRes.data?.appointments || []);
      setRequests(requestsRes.data?.requests || []);
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update appointment status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            <i className="ri-error-warning-fill mr-2"></i>
            Error
          </div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add debug output for rendered data
  console.log('Rendering with stats:', stats);
  console.log('Rendering with appointments:', appointments);
  console.log('Rendering with requests:', requests);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">Doctor Panel</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your practice</p>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <a className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg font-medium">
              <i className="ri-home-2-fill text-blue-600 text-xl mr-3"></i>
              <span>Dashboard</span>
            </a>
            <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <i className="ri-calendar-schedule-fill text-gray-500 text-xl mr-3"></i>
              <span>Appointments</span>
            </a>
            <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <i className="ri-group-fill text-gray-500 text-xl mr-3"></i>
              <span>Patients</span>
            </a>
            <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <i className="ri-database-2-fill text-gray-500 text-xl mr-3"></i>
              <span>Medical Records</span>
            </a>
            <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <i className="ri-bill-fill text-gray-500 text-xl mr-3"></i>
              <span>Prescriptions</span>
            </a>
            <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <i className="ri-pie-chart-2-fill text-gray-500 text-xl mr-3"></i>
              <span>Analytics</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500">
              <i className="ri-menu-line text-2xl"></i>
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-notification-3-line text-xl text-gray-500"></i>
            </button>
            <div className="flex items-center gap-3">
              <img 
                className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500" 
                src="https://i.pinimg.com/474x/29/3b/b5/293bb5c342dbb64de73e141c92cc6186.jpg" 
                alt="profile" 
              />
              <div className="hidden md:block">
                <h3 className="text-sm font-semibold">{selector.name}</h3>
                <p className="text-xs text-gray-500">General Physician</p>
              </div>
            </div>
            <Logout />
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {selector.name}</h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your patients today.</p>
              </div>
              <button 
                onClick={() => setShowSchedule(true)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <i className="ri-add-line mr-2"></i>
                Schedule
              </button>
            </div>

            {showSchedule && <DoctorSchedule onClose={() => setShowSchedule(false)} />}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <i className="ri-calendar-schedule-fill text-blue-600 text-2xl"></i>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</h3>
                <p className="text-gray-500 text-sm mt-1">Total Appointments</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <i className="ri-time-fill text-yellow-600 text-2xl"></i>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full">Pending</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</h3>
                <p className="text-gray-500 text-sm mt-1">Pending Requests</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <i className="ri-calendar-check-fill text-green-600 text-2xl"></i>
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">Today</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</h3>
                <p className="text-gray-500 text-sm mt-1">Today's Appointments</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <i className="ri-user-follow-fill text-purple-600 text-2xl"></i>
                  </div>
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">Active</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{appointments.length}</h3>
                <p className="text-gray-500 text-sm mt-1">Active Patients</p>
              </div>
            </div>

            {/* Recent Appointments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                <p className="text-sm text-gray-500 mt-1">A list of your appointments for today</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {appointment.patient.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                              <div className="text-sm text-gray-500">{appointment.appointmentType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            appointment.status === 'completed' ? 'bg-green-50 text-green-600' :
                            appointment.status === 'waiting' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {appointment.status === 'waiting' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'scheduled')}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Accept
                            </button>
                          )}
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
