import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Enquiry from './pages/Enquiry';
import Admission from './pages/Admission';
import Class from './pages/Class';
import Teacher from './pages/Teacher';
import Attendance from './pages/Attendance';
import Fee from './pages/Fee';
import Certificate from './pages/Certificate';
import Layout from './components/Layout';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="enquiry"
              element={
                <PrivateRoute adminOnly>
                  <Enquiry />
                </PrivateRoute>
              }
            />
            <Route
              path="admission"
              element={
                <PrivateRoute adminOnly>
                  <Admission />
                </PrivateRoute>
              }
            />
            <Route
              path="class"
              element={
                <PrivateRoute adminOnly>
                  <Class />
                </PrivateRoute>
              }
            />
            <Route
              path="teacher"
              element={
                <PrivateRoute adminOnly>
                  <Teacher />
                </PrivateRoute>
              }
            />
            <Route path="attendance" element={<Attendance />} />
            <Route
              path="fee"
              element={
                <PrivateRoute adminOnly>
                  <Fee />
                </PrivateRoute>
              }
            />
            <Route
              path="certificate"
              element={
                <PrivateRoute adminOnly>
                  <Certificate />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 