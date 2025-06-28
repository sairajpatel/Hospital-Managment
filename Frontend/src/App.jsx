
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminProtectWrapper from './Components/Protectiowrapper/AdminProtectWrapper';
import AddDoctor from './Pages/AddDoctor';
import DoctorLogin from './Pages/DoctorLogin';
import DoctorProtectWrapper from './Components/Protectiowrapper/DoctorProtectWrapper';
import DoctorDashboard from './Pages/DoctorDashboard';
import AddReceptionist from './Pages/AddReceptionist';
import ReceptionistLogin from './Pages/ReceptionistLogin';
import ReceptionistDashboard from './Pages/ReceptionistDashboard';

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
     path="/admin/add-receptionist"
     element={
      <AddReceptionist/>
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
      path="/receptionist-login"
      element={
        <ReceptionistLogin/>

      }
      />
       <Route
      path="/receptionist/dashboard"
      element={
        <ReceptionistDashboard/>

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

