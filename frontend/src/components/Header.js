/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';
import './Header.css';

const Header = ({ user, darkMode, toggleDarkMode, toggleMobileSidebar, pageTitle, logout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-menu-button"
          onClick={() => toggleMobileSidebar(true)}
          aria-label="Open menu"
        >
          <Bars3Icon className="mobile-menu-icon" />
        </button>
        <h1 className="header-title">{pageTitle || 'Dashboard'}</h1>
      </div>
      
      <div className="header-right">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon className="theme-icon" />
          ) : (
            <MoonIcon className="theme-icon" />
          )}
        </button>
        
        <Menu as="div" className="user-menu">
          <Menu.Button className="user-button">
            <div className="user-avatar">
              <span>{user.name.charAt(0)}</span>
            </div>
          </Menu.Button>
          
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
                    className={`menu-item ${active ? 'active' : ''}`}
                  >
                    <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={toggleDarkMode}
                    className={`menu-item ${active ? 'active' : ''}`}
                  >
                    {darkMode ? (
                      <>
                        <SunIcon className="menu-icon" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <MoonIcon className="menu-icon" />
                        Dark Mode
                      </>
                    )}
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`menu-item ${active ? 'active' : ''}`}
                    onClick={logout}
                  >
                    <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;