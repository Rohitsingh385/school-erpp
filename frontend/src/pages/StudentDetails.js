import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './StudentDetails.css';

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ledger, setLedger] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/admission/${id}`);
      setStudent(response.data);
      
      // Fetch payment ledger
      if (response.data.admissionNumber) {
        const ledgerResponse = await axios.get(`http://localhost:5000/api/fee/ledger/${response.data.admissionNumber}`);
        setLedger(ledgerResponse.data);
      }
      
      setError('');
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading student details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/admission" className="btn btn-primary">Back to Admission</Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="error-container">
        <div className="error-message">Student not found</div>
        <Link to="/admission" className="btn btn-primary">Back to Admission</Link>
      </div>
    );
  }

  return (
    <div className="student-details-container">
      <div className="student-details-header">
        <Link to="/admission" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
        <h1>Student Details</h1>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => setActiveTab('ledger')}>
            <i className="fas fa-file-invoice-dollar"></i> Show Ledger
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit Student
          </button>
        </div>
      </div>

      <div className="student-profile-card">
        <div className="student-profile-header">
          <div className="student-image">
            <div className="image-placeholder">
              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
          <div className="student-basic-info">
            <h2>{student.name}</h2>
            <div className="student-info-grid">
              <div className="info-item">
                <span className="info-label">Admission No:</span>
                <span className="info-value">{student.admissionNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Class:</span>
                <span className="info-value">{student.className} - {student.section}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Roll No:</span>
                <span className="info-value">{student.rollNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="status-badge active">{student.status || 'Active'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="student-details-tabs">
          <div 
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="fas fa-user"></i> Personal Info
          </div>
          <div 
            className={`tab ${activeTab === 'parents' ? 'active' : ''}`}
            onClick={() => setActiveTab('parents')}
          >
            <i className="fas fa-users"></i> Parents
          </div>
          <div 
            className={`tab ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            <i className="fas fa-graduation-cap"></i> Academic
          </div>
          <div 
            className={`tab ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            <i className="fas fa-file-invoice-dollar"></i> Fee Ledger
          </div>
        </div>

        <div className="student-details-content">
          {activeTab === 'personal' && (
            <div className="details-section">
              <h3>Personal Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{student.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">{formatDate(student.dateOfBirth)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{student.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Blood Group</span>
                  <span className="detail-value">{student.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{student.category || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Religion</span>
                  <span className="detail-value">{student.religion || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Aadhaar Number</span>
                  <span className="detail-value">{student.aadhaarNumber || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{student.address || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parents' && (
            <div className="details-section">
              <h3>Parent Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Father's Name</span>
                  <span className="detail-value">{student.fatherName || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Father's Contact</span>
                  <span className="detail-value">{student.fatherContact || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mother's Name</span>
                  <span className="detail-value">{student.motherName || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mother's Contact</span>
                  <span className="detail-value">{student.motherContact || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Parent Name</span>
                  <span className="detail-value">{student.parentName || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Parent Contact</span>
                  <span className="detail-value">{student.parentContact || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="details-section">
              <h3>Academic Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Admission Date</span>
                  <span className="detail-value">{formatDate(student.admissionDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Class</span>
                  <span className="detail-value">{student.className}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Section</span>
                  <span className="detail-value">{student.section}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Roll Number</span>
                  <span className="detail-value">{student.rollNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ward Type</span>
                  <span className="detail-value">{student.wardType || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="details-section">
              <h3>Fee Payment History</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Receipt No</th>
                      <th>Receipt Date</th>
                      <th>Period</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.length > 0 ? (
                      ledger.map(item => (
                        <tr key={item.receiptNumber}>
                          <td>{item.slNo}</td>
                          <td>{item.receiptNumber}</td>
                          <td>{formatDate(item.receiptDate)}</td>
                          <td>{item.period}</td>
                          <td>₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">No payment history found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}