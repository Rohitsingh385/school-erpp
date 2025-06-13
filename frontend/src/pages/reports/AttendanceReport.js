import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Reports.css';
import './ReportStyles.css';

export default function AttendanceReport() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [date, selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes');
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First get students in the class
      const studentsResponse = await axios.get(`http://localhost:5000/api/attendance/class/${selectedClass}/students`);
      const students = studentsResponse.data;
      
      // Then get attendance records for the date
      const attendanceResponse = await axios.get(`http://localhost:5000/api/attendance`, {
        params: {
          classId: selectedClass,
          date: date
        }
      });
      
      const attendanceRecords = attendanceResponse.data;
      
      // Merge student data with attendance status
      const attendanceData = students.map(student => {
        const record = attendanceRecords.find(r => r.studentId === student._id);
        return {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          admissionNumber: student.admissionNumber,
          status: record ? record.status : 'absent', // Default to absent if no record
          remark: record ? record.remarks : ''
        };
      });
      
      setAttendanceData(attendanceData);
      
      // Calculate summary
      const totalStudents = attendanceData.length;
      const present = attendanceData.filter(item => item.status === 'present').length;
      const absent = totalStudents - present;
      const percentage = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0;
      
      setSummary({
        totalStudents,
        present,
        absent,
        percentage
      });
      
      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to fetch attendance data');
      setAttendanceData([]);
      setSummary({
        totalStudents: 0,
        present: 0,
        absent: 0,
        percentage: 0
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
  const currentItems = attendanceData.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="report-title-section">
          <h1 className="report-title">Attendance Report</h1>
          <p className="report-subtitle">View class-wise attendance statistics</p>
        </div>
        <div className="report-actions">
          <Link to="/reports" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Reports
          </Link>
        </div>
      </div>

      <div className="report-filters">
        <div className="filter-group">
          <label htmlFor="class">Select Class:</label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                Class {cls.name} - {cls.section}
              </option>
            ))}
          </select>
          
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
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

      {selectedClass ? (
        <>
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
                <i className="fas fa-user-check"></i>
              </div>
              <div className="summary-content">
                <h3 className="summary-value">{summary.present}</h3>
                <p className="summary-label">Present</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-user-times"></i>
              </div>
              <div className="summary-content">
                <h3 className="summary-value">{summary.absent}</h3>
                <p className="summary-label">Absent</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-percentage"></i>
              </div>
              <div className="summary-content">
                <h3 className="summary-value">{summary.percentage}%</h3>
                <p className="summary-label">Attendance Percentage</p>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading attendance data...</p>
            </div>
          ) : (
            <div className="report-data-container">
              <h2 className="report-section-title">
                Attendance for Class {classes.find(c => c._id === selectedClass)?.name} - {classes.find(c => c._id === selectedClass)?.section} on {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                <span className="record-count">
                  {attendanceData.length > 0 ? 
                    `(Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, attendanceData.length)} of ${attendanceData.length} students)` : 
                    '(No records found)'}
                </span>
              </h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.rollNumber}</td>
                          <td>{item.name}</td>
                          <td>
                            <span className={`status-badge ${item.status}`}>
                              {item.status === 'present' ? 'Present' : 'Absent'}
                            </span>
                          </td>
                          <td>{item.remark}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">No attendance data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {attendanceData.length > itemsPerPage && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {Array.from({ length: Math.ceil(attendanceData.length / itemsPerPage) }, (_, i) => {
                    // Show limited page numbers with ellipsis
                    if (
                      i === 0 || // First page
                      i === Math.ceil(attendanceData.length / itemsPerPage) - 1 || // Last page
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
                    disabled={currentPage === Math.ceil(attendanceData.length / itemsPerPage)}
                    className="pagination-button"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="select-class-message">
          <i className="fas fa-info-circle"></i>
          <p>Please select a class to view attendance report</p>
        </div>
      )}
    </div>
  );
}