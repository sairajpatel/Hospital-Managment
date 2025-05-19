
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminProtectWrapper from './Components/Protectiowrapper/AdminProtectWrapper';
import AddDoctor from './Pages/AddDoctor';
import DoctorLogin from './Pages/DoctorLogin';
import DoctorProtectWrapper from './Components/Protectiowrapper/DoctorProtectWrapper';
import DoctorDashboard from './Pages/DoctorDashboard';

function App() {
 

return(
   <Routes>
      <Route path="/admin-login" element={<AdminLogin />} />
      
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectWrapper>
            <AdminDashboard />
          </AdminProtectWrapper>
        }
      />

      <Route
        path="/admin/add-doctor"
        element={
          <AdminProtectWrapper>
            <AddDoctor />
          </AdminProtectWrapper>
        }
      />
      <Route
      path="/doctor-login"
      element={
        <DoctorLogin/>
      }
      />
      <Route
      path='/doctor/dashboard'
      element={
        <DoctorProtectWrapper>
          <DoctorDashboard/>
        </DoctorProtectWrapper>
      }
      />
    </Routes>
    
  );


}




export default App;

