/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Reports', href: '/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', adminOnly: true },
  { name: 'Admission', href: '/admission', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', adminOnly: true },
  { name: 'Class', href: '/class', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', adminOnly: true },
  { name: 'Teacher', href: '/teacher', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', adminOnly: true },
  { name: 'Attendance', href: '/attendance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { name: 'Fee', href: '/fee', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', adminOnly: true },
  { name: 'Certificate', href: '/certificate', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', adminOnly: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Check for saved theme preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }
    
    // Check for saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarExpanded');
    if (savedSidebarState === 'false') {
      setSidebarExpanded(false);
    }
    
    // Check if mobile view
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem('sidebarExpanded', String(newState));
  };
  

  
  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setPageTitle('Dashboard');
    else if (path.includes('/reports')) setPageTitle('Reports');
    else if (path.includes('/admission')) setPageTitle('Admission');
    else if (path.includes('/class')) setPageTitle('Class Management');
    else if (path.includes('/teacher')) setPageTitle('Teacher Management');
    else if (path.includes('/attendance')) setPageTitle('Attendance');
    else if (path.includes('/fee')) setPageTitle('Fee Management');
    else if (path.includes('/certificate')) setPageTitle('Certificates');
    else setPageTitle('Dashboard');
  }, [location]);

  return (
    <div className="layout">
      <Sidebar 
        user={user} 
        expanded={sidebarExpanded}
        toggleSidebar={toggleSidebar}
        isMobile={mobileSidebarOpen} 
        toggleMobileSidebar={setMobileSidebarOpen} 
      />
      
      <div className={`main-with-sidebar ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header 
          user={user} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          toggleMobileSidebar={setMobileSidebarOpen}
          pageTitle={pageTitle}
          logout={logout}
        />
        
        <main className="main-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 