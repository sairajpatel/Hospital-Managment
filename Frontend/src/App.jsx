<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
=======
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AddDoctor from './Pages/AddDoctor';
import AdminProtectWrapper from './Components/Protectiowrapper/AdminProtectWrapper';
>>>>>>> Stashed changes

function App() {
  const [count, setCount] = useState(0)

  return (
<<<<<<< Updated upstream
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
=======
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
>>>>>>> Stashed changes
