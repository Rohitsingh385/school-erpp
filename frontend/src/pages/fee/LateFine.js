import React from 'react';
import { Link } from 'react-router-dom';
import '../Fee.css';

export default function LateFine() {
  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="fee-title">Late Fine Master</h1>
        <Link to="/fee" className="back-link">Back to Fee Management</Link>
      </div>
      
      <div className="fee-content">
        <div className="fee-card">
          <h2>Late Fine Configuration</h2>
          <div className="form-container">
            <div className="form-group">
              <label>Fine Name:</label>
              <input type="text" placeholder="e.g. Monthly Fee Late Fine" />
            </div>
            <div className="form-group">
              <label>Start Day:</label>
              <input type="number" min="1" max="31" placeholder="e.g. 10" />
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input type="number" placeholder="e.g. 100" />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select>
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
                <option value="per-day">Per Day</option>
              </select>
            </div>
            <button className="btn-primary">Save Late Fine Rule</button>
          </div>
        </div>
        
        <div className="fee-card mt-20">
          <h2>Existing Late Fine Rules</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Day</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Fee Late Fine</td>
                  <td>10</td>
                  <td>100</td>
                  <td>Fixed</td>
                  <td>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}