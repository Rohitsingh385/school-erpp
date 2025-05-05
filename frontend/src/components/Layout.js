import React, { Fragment } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Enquiry', href: '/enquiry', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', adminOnly: true },
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

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user.role === 'admin'
  );

  return (
    <div className="layout">
      <Disclosure as="nav" className="navbar">
        {({ open }) => (
          <>
            <div className="nav-container">
              <div className="nav-content">
                <div className="nav-left">
                  <div className="logo">
                    <h1>School ERP</h1>
                  </div>
                  <div className="nav-links">
                    {filteredNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                      >
                        <svg
                          className={`nav-icon ${location.pathname === item.href ? 'active' : ''}`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="nav-right">
                  <Menu as="div" className="user-menu">
                    <div>
                      <Menu.Button className="user-button">
                        <span className="sr-only">Open user menu</span>
                        <div className="user-avatar">
                          <span>{user.name.charAt(0)}</span>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="menu-enter"
                      enterFrom="menu-enter-from"
                      enterTo="menu-enter-to"
                      leave="menu-leave"
                      leaveFrom="menu-leave-from"
                      leaveTo="menu-leave-to"
                    >
                      <Menu.Items className="menu-items">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`menu-item ${active ? 'active' : ''}`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="mobile-menu-button">
                  <Disclosure.Button className="menu-toggle">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="menu-icon" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="menu-icon" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="mobile-menu">
              <div className="mobile-nav-links">
                {filteredNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`mobile-nav-link ${location.pathname === item.href ? 'active' : ''}`}
                  >
                    <div className="mobile-link-content">
                      <svg
                        className={`mobile-nav-icon ${location.pathname === item.href ? 'active' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                    </div>
                  </Disclosure.Button>
                ))}
              </div>
              <div className="mobile-user-info">
                <div className="mobile-user-profile">
                  <div className="mobile-user-avatar">
                    <span>{user.name.charAt(0)}</span>
                  </div>
                  <div className="mobile-user-details">
                    <div className="mobile-user-name">{user.name}</div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
                <div className="mobile-user-actions">
                  <Disclosure.Button
                    as="button"
                    onClick={logout}
                    className="mobile-signout"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 