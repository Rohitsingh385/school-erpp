import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Reports.css';
import './ReportStyles.css';

export default function StudentStrengthReport() {
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalBoys: 0,
    totalGirls: 0,
    totalClasses: 0
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchStudentStrength();
  }, []);

  const fetchStudentStrength = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:5000/api/reports/student-strength');
      const strengthData = response.data;
      
      setClassData(strengthData);
      
      // Calculate summary
      const totalStudents = strengthData.reduce((sum, item) => sum + item.totalStudents, 0);
      const totalBoys = strengthData.reduce((sum, item) => sum + item.boys, 0);
      const totalGirls = strengthData.reduce((sum, item) => sum + item.girls, 0);
      
      setSummary({
        totalStudents,
        totalBoys,
        totalGirls,
        totalClasses: strengthData.length
      });
      
      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching student strength data:', err);
      setError('Failed to fetch student strength data');
      setClassData([]);
      setSummary({
        totalStudents: 0,
        totalBoys: 0,
        totalGirls: 0,
        totalClasses: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    alert('Export to Excel functionality would be implemented here');
  };

  const exportToPDF = () => {
    alert('Export to PDF functionality would be implemented here');
  };
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = classData.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="report-title-section">
          <h1 className="report-title">Student Strength Report</h1>
          <p className="report-subtitle">View class-wise student strength statistics</p>
        </div>
        <div className="report-actions">
          <Link to="/reports" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Reports
          </Link>
        </div>
      </div>

      <div className="report-filters">
        <div className="filter-group">
          <button className="btn btn-primary" onClick={fetchStudentStrength}>
            <i className="fas fa-sync-alt"></i> Refresh Data
          </button>
        </div>
        <div className="filter-actions">
          <button className="btn btn-excel" onClick={exportToExcel}>
            <i className="fas fa-file-excel"></i> Export to Excel
          </button>
          <button className="btn btn-pdf" onClick={exportToPDF}>
            <i className="fas fa-file-pdf"></i> Export to PDF
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{summary.totalStudents}</h3>
            <p className="summary-label">Total Students</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-male"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{summary.totalBoys}</h3>
            <p className="summary-label">Total Boys</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-female"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{summary.totalGirls}</h3>
            <p className="summary-label">Total Girls</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-chalkboard"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{summary.totalClasses}</h3>
            <p className="summary-label">Total Classes</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading student strength data...</p>
        </div>
      ) : (
        <div className="report-data-container">
          <h2 className="report-section-title">
            Class-wise Student Strength
            <span className="record-count">
              {classData.length > 0 ? 
                `(Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, classData.length)} of ${classData.length} classes)` : 
                '(No records found)'}
            </span>
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Boys</th>
                  <th>Girls</th>
                  <th>Total Students</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.className}</td>
                      <td>{item.section}</td>
                      <td>{item.boys}</td>
                      <td>{item.girls}</td>
                      <td>{item.totalStudents}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No student strength data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {classData.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: Math.ceil(classData.length / itemsPerPage) }, (_, i) => {
                // Show limited page numbers with ellipsis
                if (
                  i === 0 || // First page
                  i === Math.ceil(classData.length / itemsPerPage) - 1 || // Last page
                  (i >= currentPage - 2 && i <= currentPage + 2) // Pages around current page
                ) {
                  return (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (
                  i === currentPage - 3 || 
                  i === currentPage + 3
                ) {
                  return <span key={i} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === Math.ceil(classData.length / itemsPerPage)}
                className="pagination-button"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}