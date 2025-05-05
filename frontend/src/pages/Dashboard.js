import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color, link }) => (
  <Link to={link} className="stat-card">
    <div className={`stat-icon ${color}`}>
      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div className="stat-content">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </Link>
);

const QuickAction = ({ title, icon, link }) => (
  <Link to={link} className="quick-action">
    <div className="quick-action-icon">
      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <span className="quick-action-title">{title}</span>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingEnquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes, enquiries] = await Promise.all([
          axios.get('http://localhost:5000/api/admission'),
          axios.get('http://localhost:5000/api/teacher'),
          axios.get('http://localhost:5000/api/class'),
          axios.get('http://localhost:5000/api/enquiry')
        ]);

        setStats({
          totalStudents: students.data.length,
          totalTeachers: teachers.data.length,
          totalClasses: classes.data.length,
          pendingEnquiries: enquiries.data.filter(e => e.status === 'new').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.role === 'admin') {
      fetchStats();
    }
  }, [user.role]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <p className="dashboard-subtitle">Here's what's happening in your school today.</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          color="blue"
          link="/admission"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          color="green"
          link="/teacher"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          color="purple"
          link="/class"
        />
        <StatCard
          title="Pending Enquiries"
          value={stats.pendingEnquiries}
          icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          color="yellow"
          link="/enquiry"
        />
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickAction
            title="Add New Student"
            icon="M12 4v16m8-8H4"
            link="/admission/new"
          />
          <QuickAction
            title="Create New Class"
            icon="M12 6v6m0 0v6m0-6h6m-6 0H6"
            link="/class/new"
          />
          <QuickAction
            title="Add New Teacher"
            icon="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            link="/teacher/new"
          />
          <QuickAction
            title="Take Attendance"
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            link="/attendance"
          />
        </div>
      </div>
    </div>
  );
} 