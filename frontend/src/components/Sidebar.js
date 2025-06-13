import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import './Sidebar.css';

/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

// Navigation items with icons and optional submenus
const navigationItems = [
  {
    name: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    href: '/dashboard',
  },
  {
    name: 'Reports',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    href: '/reports',
    adminOnly: true,
    submenu: [
      { name: 'Attendance Report', href: '/reports/attendance' },
      { name: 'Fee Collection', href: '/reports/fee-collection' },
      { name: 'Student Strength', href: '/reports/student-strength' }
    ]
  },
  {
    name: 'Admission',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    href: '/admission',
    adminOnly: true,
  },
  {
    name: 'Class',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    href: '/class',
    adminOnly: true,
  },
  {
    name: 'Teacher',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    href: '/teacher',
    adminOnly: true,
  },
  {
    name: 'Attendance',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    href: '/attendance',
  },
  {
    name: 'Fee',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    href: '/fee',
    adminOnly: true,
  },
  {
    name: 'Certificate',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    href: '/certificate',
    adminOnly: true,
  },
];

const Sidebar = ({ user, expanded, toggleSidebar, isMobile, toggleMobileSidebar }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      toggleMobileSidebar(false);
    }
  }, [location.pathname, isMobile, toggleMobileSidebar]);

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(
    (item) => !item.adminOnly || user.role === 'admin'
  );

  // Toggle submenu
  const handleSubmenuToggle = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  // Check if a route is active
  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={toggleSidebar}>
            <div className="sidebar-logo-icon">S</div>
            <div className="sidebar-logo-text">School ERP</div>
          </div>
        </div>
        
        <div className="sidebar-menu">
          {filteredNavigation.map((item, index) => (
            <div 
              key={item.name} 
              className={`sidebar-item ${openSubmenu === index ? 'open' : ''}`}
              onMouseEnter={() => !expanded && setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.submenu ? (
                <>
                  <div 
                    className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => handleSubmenuToggle(index)}
                  >
                    <div className="sidebar-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <div className="sidebar-text">{item.name}</div>
                    {hoveredItem === index && !expanded && (
                      <div className="sidebar-tooltip">{item.name}</div>
                    )}
                  </div>
                  <div className="sidebar-submenu">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        to={subitem.href}
                        className={`sidebar-sublink ${isActive(subitem.href) ? 'active' : ''}`}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.href}
                  className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  <div className="sidebar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div className="sidebar-text">{item.name}</div>
                  {hoveredItem === index && !expanded && (
                    <div className="sidebar-tooltip">{item.name}</div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobile ? 'active' : ''}`} 
          onClick={() => toggleMobileSidebar(false)}
        />
      )}
    </>
  );
};

export default Sidebar;