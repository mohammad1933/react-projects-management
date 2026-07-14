import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute   from './components/ProtectedRoute';
import Register      from './pages/Register';
import Login         from './pages/Login';
import EmailVerified from './pages/EmailVerified';
import Dashboard     from './pages/Dashboard';
import VerifyOtp from './pages/VeifyOtp';
import DashLayout from './pages/layout/DashLayout.jsx';
import Tasks from './pages/Tasks.jsx';
import { Settings } from './pages/Settings.jsx';
import Projects from './pages/Projects.jsx';
import MyTasks from './pages/MyTasks.jsx';
import Invitations from './pages/Invitaions.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';

export default function App() {
  return (
    // AuthProvider wraps everything so all pages can access auth state
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/register"       element={<Register />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/verify-otp"     element={<VerifyOtp />} />
          <Route path="/email-verified" element={<EmailVerified />} />

          {/* Protected page — requires login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
               <DashLayout> <Dashboard /></DashLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
               <DashLayout> <Tasks /></DashLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
               <DashLayout> <MyTasks /></DashLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
               <DashLayout> <Projects /></DashLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
               <DashLayout> <Settings /></DashLayout>
              </ProtectedRoute>
            }
          />


          <Route
            path="/invitations"
            element={
              <ProtectedRoute>
               <DashLayout> <Invitations /></DashLayout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/project-details/:id"
            element={
              <ProtectedRoute>
               <DashLayout> <ProjectDetails /></DashLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}