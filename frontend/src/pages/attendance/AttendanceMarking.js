import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Attendance.css';

export default function AttendanceMarking() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Attendance categories
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [halfdayCount, setHalfdayCount] = useState(0);
  
  // Search terms for each category
  const [absentSearch, setAbsentSearch] = useState('');
  const [lateSearch, setLateSearch] = useState('');
  const [halfdaySearch, setHalfdaySearch] = useState('');
  
  // Selected students for each category
  const [absentStudents, setAbsentStudents] = useState([]);
  const [lateStudents, setLateStudents] = useState([]);
  const [halfdayStudents, setHalfdayStudents] = useState([]);
  
  // Confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  useEffect(() => {
    fetchClasses();
  }, []);

  // State for existing attendance
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      checkExistingAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/attendance/class/${selectedClass}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const checkExistingAttendance = async () => {
    try {
      // Reset attendance state
      setAbsentStudents([]);
      setLateStudents([]);
      setHalfdayStudents([]);
      setAbsentCount(0);
      setLateCount(0);
      setHalfdayCount(0);
      setExistingAttendance(null);
      setIsViewMode(false);
      
      // Check if date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0);
      
      if (selectedDateObj > today) {
        setError('Cannot mark attendance for future dates');
        return;
      }
      
      // Check if attendance already exists for this date and class
      const response = await axios.get(`http://localhost:5000/api/attendance`, {
        params: {
          classId: selectedClass,
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      
      if (response.data && response.data.length > 0) {
        setExistingAttendance(response.data);
        setIsViewMode(true);
        
        // Count students by status
        const absent = response.data.filter(record => record.status === 'absent');
        const late = response.data.filter(record => record.status === 'late');
        const halfday = response.data.filter(record => record.status === 'halfday');
        
        setAbsentCount(absent.length);
        setLateCount(late.length);
        setHalfdayCount(halfday.length);
        
        // Set absent students
        if (absent.length > 0) {
          const absentStudentIds = absent.map(record => record.studentId);
          const absentStudentsList = students.filter(student => 
            absentStudentIds.includes(student._id)
          );
          setAbsentStudents(absentStudentsList);
        }
        
        // Set late students
        if (late.length > 0) {
          const lateStudentIds = late.map(record => record.studentId);
          const lateStudentsList = students.filter(student => 
            lateStudentIds.includes(student._id)
          );
          setLateStudents(lateStudentsList);
        }
        
        // Set halfday students
        if (halfday.length > 0) {
          const halfdayStudentIds = halfday.map(record => record.studentId);
          const halfdayStudentsList = students.filter(student => 
            halfdayStudentIds.includes(student._id)
          );
          setHalfdayStudents(halfdayStudentsList);
        }
      }
    } catch (error) {
      console.error('Error checking existing attendance:', error);
    }
  };

  const handleCountChange = (type, value) => {
    const count = parseInt(value) || 0;
    
    switch(type) {
      case 'absent':
        setAbsentCount(count);
        // Reset selected students if count is reduced
        if (count < absentStudents.length) {
          setAbsentStudents(absentStudents.slice(0, count));
        }
        break;
      case 'late':
        setLateCount(count);
        if (count < lateStudents.length) {
          setLateStudents(lateStudents.slice(0, count));
        }
        break;
      case 'halfday':
        setHalfdayCount(count);
        if (count < halfdayStudents.length) {
          setHalfdayStudents(halfdayStudents.slice(0, count));
        }
        break;
      default:
        break;
    }
  };

  const handleStudentSelect = (type, student) => {
    // Check if student is already selected in any category
    const isInAbsent = absentStudents.some(s => s._id === student._id);
    const isInLate = lateStudents.some(s => s._id === student._id);
    const isInHalfday = halfdayStudents.some(s => s._id === student._id);
    
    if (isInAbsent || isInLate || isInHalfday) {
      // If student is already in another category, show error
      if ((type === 'absent' && !isInAbsent) || 
          (type === 'late' && !isInLate) || 
          (type === 'halfday' && !isInHalfday)) {
        setError('Student is already selected in another category');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }
    
    switch(type) {
      case 'absent':
        if (isInAbsent) {
          // Remove student if already selected
          setAbsentStudents(absentStudents.filter(s => s._id !== student._id));
        } else if (absentStudents.length < absentCount) {
          // Add student if count allows
          setAbsentStudents([...absentStudents, student]);
        }
        break;
      case 'late':
        if (isInLate) {
          setLateStudents(lateStudents.filter(s => s._id !== student._id));
        } else if (lateStudents.length < lateCount) {
          setLateStudents([...lateStudents, student]);
        }
        break;
      case 'halfday':
        if (isInHalfday) {
          setHalfdayStudents(halfdayStudents.filter(s => s._id !== student._id));
        } else if (halfdayStudents.length < halfdayCount) {
          setHalfdayStudents([...halfdayStudents, student]);
        }
        break;
      default:
        break;
    }
  };

  const filterStudents = (searchTerm) => {
    if (!searchTerm) return [];
    
    return students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.admissionNumber && student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.rollNumber && student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleSubmit = async () => {
    // First show confirmation
    const presentCount = students.length - (absentStudents.length + lateStudents.length + halfdayStudents.length);
    
    setAttendanceSummary({
      date: selectedDate.toLocaleDateString(),
      class: classes.find(c => c._id === selectedClass)?.name || 'Selected Class',
      section: classes.find(c => c._id === selectedClass)?.section || '',
      total: students.length,
      present: presentCount,
      absent: absentStudents.length,
      late: lateStudents.length,
      halfday: halfdayStudents.length
    });
    
    setShowConfirmation(true);
  };

  const confirmAttendance = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create attendance records for all students
      const records = students.map(student => {
        // Determine status based on selected categories
        let status = 'present'; // Default status
        
        if (absentStudents.some(s => s._id === student._id)) {
          status = 'absent';
        } else if (lateStudents.some(s => s._id === student._id)) {
          status = 'late';
        } else if (halfdayStudents.some(s => s._id === student._id)) {
          status = 'halfday';
        }
        
        return {
          studentId: student._id,
          status,
          remarks: ''
        };
      });

      // Submit attendance
      const response = await axios.post('http://localhost:5000/api/attendance/bulk', {
        classId: selectedClass,
        date: selectedDate.toISOString().split('T')[0],
        records
      });
      
      setSuccess('Attendance marked successfully!');
      console.log('Attendance response:', response.data);
      
      // Reset selections
      setAbsentStudents([]);
      setLateStudents([]);
      setHalfdayStudents([]);
      setAbsentCount(0);
      setLateCount(0);
      setHalfdayCount(0);
      setShowConfirmation(false);
      
      // Set existing attendance to trigger view mode
      setExistingAttendance(records.map(record => ({
        ...record,
        classId: selectedClass,
        date: selectedDate.toISOString().split('T')[0]
      })));
      setIsViewMode(true);
      
      // Refresh attendance data
      checkExistingAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError('Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudentsPage = students.slice(indexOfFirstStudent, indexOfLastStudent);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance Management</h1>
        <Link to="/attendance" className="back-link">Back to Attendance</Link>
      </div>

      <div className="attendance-filters">
        <div className="filter-group">
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={loading}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - Section {cls.section}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            disabled={loading}
            max={new Date().toISOString().split('T')[0]}
            className={existingAttendance ? "date-marked" : "date-unmarked"}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {selectedClass ? (
        <div className="attendance-form">
          {isViewMode ? (
            <div className="view-mode-notice">
              <div className="info-message">
                Attendance for this date has already been marked. You are in view mode.
              </div>
            </div>
          ) : (
            <>
              {/* Check if date is in future */}
              {new Date(selectedDate) > new Date() ? (
                <div className="error-message">
                  Cannot mark attendance for future dates. Please select today's date or a past date.
                </div>
              ) : null}
            </>
          )}
          
          <div className="attendance-categories">
            <div className="category-card">
              <h3>Absent Students</h3>
              <div className="category-input">
                <label>Number of Absent Students:</label>
                <input 
                  type="number" 
                  min="0" 
                  max={students.length}
                  value={absentCount}
                  onChange={(e) => handleCountChange('absent', e.target.value)}
                  disabled={isViewMode || new Date(selectedDate) > new Date()}
                />
              </div>
              
              {absentCount > 0 && !isViewMode && new Date(selectedDate) <= new Date() && (
                <div className="category-selection">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search by name, admission no, or roll no..."
                      value={absentSearch}
                      onChange={(e) => setAbsentSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="selected-students">
                    {absentStudents.map(student => (
                      <div key={student._id} className="selected-student">
                        <span>{student.name} ({student.rollNumber})</span>
                        <button 
                          className="remove-btn"
                          onClick={() => handleStudentSelect('absent', student)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {Array(absentCount - absentStudents.length).fill().map((_, i) => (
                      <div key={`empty-${i}`} className="empty-selection">
                        Select student {absentStudents.length + i + 1}
                      </div>
                    ))}
                  </div>
                  
                  {absentSearch && (
                    <div className="search-results">
                      {filterStudents(absentSearch).length > 0 ? (
                        filterStudents(absentSearch).map(student => (
                          <div 
                            key={student._id} 
                            className="search-result-item"
                            onClick={() => handleStudentSelect('absent', student)}
                          >
                            <span>{student.name}</span>
                            <span className="student-details">
                              Roll: {student.rollNumber} | Adm: {student.admissionNumber}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No students found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="category-card">
              <h3>Late Students</h3>
              <div className="category-input">
                <label>Number of Late Students:</label>
                <input 
                  type="number" 
                  min="0" 
                  max={students.length}
                  value={lateCount}
                  onChange={(e) => handleCountChange('late', e.target.value)}
                  disabled={isViewMode || new Date(selectedDate) > new Date()}
                />
              </div>
              
              {lateCount > 0 && !isViewMode && new Date(selectedDate) <= new Date() && (
                <div className="category-selection">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search by name, admission no, or roll no..."
                      value={lateSearch}
                      onChange={(e) => setLateSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="selected-students">
                    {lateStudents.map(student => (
                      <div key={student._id} className="selected-student">
                        <span>{student.name} ({student.rollNumber})</span>
                        <button 
                          className="remove-btn"
                          onClick={() => handleStudentSelect('late', student)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {Array(lateCount - lateStudents.length).fill().map((_, i) => (
                      <div key={`empty-${i}`} className="empty-selection">
                        Select student {lateStudents.length + i + 1}
                      </div>
                    ))}
                  </div>
                  
                  {lateSearch && (
                    <div className="search-results">
                      {filterStudents(lateSearch).length > 0 ? (
                        filterStudents(lateSearch).map(student => (
                          <div 
                            key={student._id} 
                            className="search-result-item"
                            onClick={() => handleStudentSelect('late', student)}
                          >
                            <span>{student.name}</span>
                            <span className="student-details">
                              Roll: {student.rollNumber} | Adm: {student.admissionNumber}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No students found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="category-card">
              <h3>Half-day Students</h3>
              <div className="category-input">
                <label>Number of Half-day Students:</label>
                <input 
                  type="number" 
                  min="0" 
                  max={students.length}
                  value={halfdayCount}
                  onChange={(e) => handleCountChange('halfday', e.target.value)}
                  disabled={isViewMode || new Date(selectedDate) > new Date()}
                />
              </div>
              
              {halfdayCount > 0 && !isViewMode && new Date(selectedDate) <= new Date() && (
                <div className="category-selection">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search by name, admission no, or roll no..."
                      value={halfdaySearch}
                      onChange={(e) => setHalfdaySearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="selected-students">
                    {halfdayStudents.map(student => (
                      <div key={student._id} className="selected-student">
                        <span>{student.name} ({student.rollNumber})</span>
                        <button 
                          className="remove-btn"
                          onClick={() => handleStudentSelect('halfday', student)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {Array(halfdayCount - halfdayStudents.length).fill().map((_, i) => (
                      <div key={`empty-${i}`} className="empty-selection">
                        Select student {halfdayStudents.length + i + 1}
                      </div>
                    ))}
                  </div>
                  
                  {halfdaySearch && (
                    <div className="search-results">
                      {filterStudents(halfdaySearch).length > 0 ? (
                        filterStudents(halfdaySearch).map(student => (
                          <div 
                            key={student._id} 
                            className="search-result-item"
                            onClick={() => handleStudentSelect('halfday', student)}
                          >
                            <span>{student.name}</span>
                            <span className="student-details">
                              Roll: {student.rollNumber} | Adm: {student.admissionNumber}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No students found</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="attendance-summary">
            <div className="summary-item">
              <span className="summary-label">Total Students:</span>
              <span className="summary-value">{students.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Present:</span>
              <span className="summary-value">{students.length - (absentCount + lateCount + halfdayCount)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Absent:</span>
              <span className="summary-value">{absentCount}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Late:</span>
              <span className="summary-value">{lateCount}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Half-day:</span>
              <span className="summary-value">{halfdayCount}</span>
            </div>
          </div>
          
          <h3>Student List</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Admission No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentStudentsPage.map(student => {
                  let status = 'Present';
                  
                  if (isViewMode && existingAttendance) {
                    // In view mode, get status from existing attendance
                    const record = existingAttendance.find(r => r.studentId === student._id);
                    if (record) {
                      status = record.status.charAt(0).toUpperCase() + record.status.slice(1);
                    }
                  } else {
                    // In edit mode, get status from current selections
                    if (absentStudents.some(s => s._id === student._id)) {
                      status = 'Absent';
                    } else if (lateStudents.some(s => s._id === student._id)) {
                      status = 'Late';
                    } else if (halfdayStudents.some(s => s._id === student._id)) {
                      status = 'Half-day';
                    }
                  }
                  
                  return (
                    <tr key={student._id}>
                      <td>{student.rollNumber}</td>
                      <td>{student.name}</td>
                      <td>{student.admissionNumber}</td>
                      <td className={`status-${status.toLowerCase()}`}>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {students.length > studentsPerPage && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(students.length / studentsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          
          {!isViewMode && new Date(selectedDate) <= new Date() && (
            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading || students.length === 0}
              >
                {loading ? 'Saving...' : 'Mark Attendance'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="select-class-message">
          Please select a class to mark attendance
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h2>Confirm Attendance</h2>
              
              <div className="confirmation-details">
                <p><strong>Date:</strong> {attendanceSummary.date}</p>
                <p><strong>Class:</strong> {attendanceSummary.class} {attendanceSummary.section}</p>
                <p><strong>Total Students:</strong> {attendanceSummary.total}</p>
                <p><strong>Present:</strong> {attendanceSummary.present}</p>
                <p><strong>Absent:</strong> {attendanceSummary.absent}</p>
                <p><strong>Late:</strong> {attendanceSummary.late}</p>
                <p><strong>Half-day:</strong> {attendanceSummary.halfday}</p>
              </div>
              
              <div className="confirmation-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={confirmAttendance}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}