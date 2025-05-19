
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminProtectWrapper from './Components/Protectiowrapper/AdminProtectWrapper';
import AddDoctor from './Pages/AddDoctor';

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
    </Routes>
  );


}




export default App;

