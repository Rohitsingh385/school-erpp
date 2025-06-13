import React from 'react';
import { Link } from 'react-router-dom';
import './Reports.css';

export default function Reports() {
  const reportModules = [
    {
      id: 'dcr',
      title: 'Daily Collection Report',
      description: 'View and download daily fee collection reports',
      icon: 'fas fa-calendar-day',
      link: '/reports/daily-collection'
    },
    {
      id: 'mcr',
      title: 'Monthly Collection Report',
      description: 'View and download monthly fee collection reports',
      icon: 'fas fa-calendar-alt',
      link: '/reports/monthly-collection'
    },
    {
      id: 'strength',
      title: 'Student Strength Report',
      description: 'View class-wise student strength statistics',
      icon: 'fas fa-users',
      link: '/reports/student-strength'
    },
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'View class-wise attendance statistics',
      icon: 'fas fa-clipboard-check',
      link: '/reports/attendance'
    }
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">Reports</h1>
        <p className="reports-subtitle">Generate and download various school reports</p>
      </div>

      <div className="reports-grid">
        {reportModules.map((module) => (
          <Link to={module.link} key={module.id} className="report-card">
            <div className="report-icon">
              <i className={module.icon}></i>
            </div>
            <div className="report-content">
              <h3 className="report-title">{module.title}</h3>
              <p className="report-description">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}