import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Protected pages (require vet login)
import Dashboard from "./pages/DashboardPage";
import Appointments from "./pages/AppointmentsPage";
import Profile from "./components/profile/Profile";
import ApprovalPending from "./components/auth/ApprovalPending";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/approval-pending" element={<ApprovalPending />} />


        {/* Protected Routes - Main Vet App */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />
        
        {/* Filtered appointments routes */}
        <Route
          path="/appointments/today"
          element={
            <PrivateRoute>
              <Appointments filter="today" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/appointments/pending"
          element={
            <PrivateRoute>
              <Appointments filter="pending" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/appointments/confirmed"
          element={
            <PrivateRoute>
              <Appointments filter="confirmed" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/appointments/completed"
          element={
            <PrivateRoute>
              <Appointments filter="completed" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/appointments/cancelled"
          element={
            <PrivateRoute>
              <Appointments filter="cancelled" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/appointments/follow-up"
          element={
            <PrivateRoute>
              <Appointments filter="follow-up" />
            </PrivateRoute>
          }
        />

        {/* Profile Management */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
     
      </Routes>
    </Router>
  );
}

// Placeholder components that you'll create later


















export default App;


