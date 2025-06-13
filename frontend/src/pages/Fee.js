import React from 'react';
import { Link } from 'react-router-dom';
import './Fee.css';

export default function Fee() {
  return (
    <div className="fee-container">
      <h1 className="fee-title">Fee Management</h1>
      
      <div className="fee-modules">
        <Link to="/fee/head-master" className="fee-module">
          <div className="fee-module-inner">
            <h2>Fee Head Master</h2>
            <p>Manage fee types and structures</p>
          </div>
        </Link>
        
        <Link to="/fee/late-fine" className="fee-module">
          <div className="fee-module-inner">
            <h2>Late Fine Master</h2>
            <p>Configure late payment penalties</p>
          </div>
        </Link>
        
        <Link to="/fee/collection" className="fee-module">
          <div className="fee-module-inner">
            <h2>Fee Collection</h2>
            <p>Collect and manage student payments</p>
          </div>
        </Link>
      </div>
    </div>
  );
}