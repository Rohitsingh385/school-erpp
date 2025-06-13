/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Admission from './pages/Admission';
import StudentDetails from './pages/StudentDetails';
import Class from './pages/Class';
import Teacher from './pages/Teacher';
import Ward from './pages/Ward';
import Attendance from './pages/Attendance';
import Fee from './pages/Fee';
import FeeHeadMaster from './pages/fee/FeeHeadMaster';
import LateFine from './pages/fee/LateFine';
import FeeCollection from './pages/fee/FeeCollection';
import Certificate from './pages/Certificate';
import DailyCollectionReport from './pages/reports/DailyCollectionReport';
import MonthlyCollectionReport from './pages/reports/MonthlyCollectionReport';
import StudentStrengthReport from './pages/reports/StudentStrengthReport';
import AttendanceReport from './pages/reports/AttendanceReport';
import Layout from './components/Layout';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/daily-collection" element={<DailyCollectionReport />} />
            <Route path="reports/monthly-collection" element={<MonthlyCollectionReport />} />
            <Route path="reports/student-strength" element={<StudentStrengthReport />} />
            <Route path="reports/attendance" element={<AttendanceReport />} />
            <Route path="admission" element={<Admission />} />
            <Route path="student/:id" element={<StudentDetails />} />
            <Route path="class" element={<Class />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="ward" element={<Ward />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="fee" element={<Fee />} />
            <Route path="fee/head-master" element={<FeeHeadMaster />} />
            <Route path="fee/late-fine" element={<LateFine />} />
            <Route path="fee/collection" element={<FeeCollection />} />
            <Route path="certificate" element={<Certificate />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;