import { Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import DoctorLogin from './Pages/DoctorLogin';
import DoctorDashboard from './Pages/DoctorDashboard';
import ReceptionistLogin from './Pages/ReceptionistLogin';
import ReceptionistDashboard from './Pages/ReceptionistDashboard';
import PatientLogin from './Pages/PatientLogin';
import PatientRegister from './Pages/PatientRegister';
import PatientDashboard from './Pages/PatientDashboard';
import AddDoctor from './Pages/AddDoctor';
import AddReceptionist from './Pages/AddReceptionist';
import AddPatient from './Pages/AddPatient';
import AdminProtectWrapper from './Components/Protectiowrapper/AdminProtectWrapper';
import DoctorProtectWrapper from './Components/Protectiowrapper/DoctorProtectWrapper';
import ReceptionistProtectWrapper from './Components/Protectiowrapper/ReceptionistProtectWrapper';
import PatientProtectWrapper from './Components/Protectiowrapper/PatientProtectWrapper';

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminProtectWrapper><AdminDashboard /></AdminProtectWrapper>} />
      <Route path="/admin/add-doctor" element={<AdminProtectWrapper><AddDoctor /></AdminProtectWrapper>} />
      <Route path="/admin/add-receptionist" element={<AdminProtectWrapper><AddReceptionist /></AdminProtectWrapper>} />
      
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/dashboard" element={<DoctorProtectWrapper><DoctorDashboard /></DoctorProtectWrapper>} />
      
      <Route path="/receptionist/login" element={<ReceptionistLogin />} />
      <Route path="/receptionist/dashboard" element={<ReceptionistProtectWrapper><ReceptionistDashboard /></ReceptionistProtectWrapper>} />
      <Route path="/receptionist/add-patient" element={<ReceptionistProtectWrapper><AddPatient /></ReceptionistProtectWrapper>} />
      
      <Route path="/" element={<PatientLogin />} />
      <Route path="/patient/register" element={<PatientRegister />} />
      <Route path="/patient/dashboard" element={<PatientProtectWrapper><PatientDashboard /></PatientProtectWrapper>} />
    </Routes>
  );
}

export default App;

