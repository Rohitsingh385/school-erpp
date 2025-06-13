import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import './Admission.css';

export default function Admission() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    class: '',
    section: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    category: '',
    religion: '',
    penNumber: '',
    aparId: '',
    aadhaarNumber: '',
    accountNumber: '',
    wardType: '',
    house: '',
    isHandicap: false,
    handicapType: '',
    parentName: '',
    parentContact: '',
    fatherName: '',
    fatherOccupation: '',
    fatherEducation: '',
    fatherIncome: '',
    fatherContact: '',
    motherName: '',
    motherOccupation: '',
    motherEducation: '',
    motherIncome: '',
    motherContact: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    previousSchool: '',
    previousSchoolAddress: '',
    boardRegNumber: '',
    boardRollNumber: '',
    profileImage: null,
    documents: []
  });

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admission');
      setStudents(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async () => {
    try {
      // Fetch next available admission number
      const admissionResponse = await axios.get('http://localhost:5000/api/admission/next-admission-number');
      
      setFormData(prev => ({
        ...prev,
        admissionNumber: admissionResponse.data.admissionNumber,
        admissionDate: new Date().toISOString().split('T')[0]
      }));
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching admission number:', error);
      // Generate a fallback admission number
      const currentYear = new Date().getFullYear();
      const fallbackAdmissionNumber = `ADM-${currentYear}-${(students.length + 1).toString().padStart(4, '0')}`;
      
      setFormData(prev => ({
        ...prev,
        admissionNumber: fallbackAdmissionNumber,
        admissionDate: new Date().toISOString().split('T')[0]
      }));
      
      setIsModalOpen(true);
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setFormData({ ...formData, class: classId });
    
    try {
      // Fetch next available roll number for this class
      const rollResponse = await axios.get(`http://localhost:5000/api/admission/next-roll-number/${classId}`);
      setFormData(prev => ({
        ...prev,
        rollNumber: rollResponse.data.rollNumber
      }));
    } catch (error) {
      console.error('Error fetching roll number:', error);
      // Set a fallback roll number
      setFormData(prev => ({
        ...prev,
        rollNumber: '1'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Map parentPhone to parentContact as expected by backend
      const studentData = {
        name: formData.name,
        admissionNumber: formData.admissionNumber,
        admissionDate: formData.admissionDate,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        parentName: formData.parentName || formData.fatherName,
        parentContact: formData.parentContact || formData.fatherContact,
        class: formData.class,
        rollNumber: formData.rollNumber,
        wardType: formData.wardType,
        aadhaarNumber: formData.aadhaarNumber,
        religion: formData.religion,
        category: formData.category
      };

      await axios.post('http://localhost:5000/api/admission', studentData);

      // Reset form and close modal
      setFormData({
        name: '',
        admissionNumber: '',
        admissionDate: new Date().toISOString().split('T')[0],
        class: '',
        section: '',
        rollNumber: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        category: '',
        religion: '',
        penNumber: '',
        aparId: '',
        aadhaarNumber: '',
        accountNumber: '',
        wardType: '',
        house: '',
        isHandicap: false,
        handicapType: '',
        parentName: '',
        parentContact: '',
        fatherName: '',
        fatherOccupation: '',
        fatherEducation: '',
        fatherIncome: '',
        fatherContact: '',
        motherName: '',
        motherOccupation: '',
        motherEducation: '',
        motherIncome: '',
        motherContact: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        previousSchool: '',
        previousSchoolAddress: '',
        boardRegNumber: '',
        boardRollNumber: '',
        profileImage: null,
        documents: []
      });
      
      setIsModalOpen(false);
      fetchStudents();
      setSuccess('Student admitted successfully!');
    } catch (error) {
      console.error('Admission error:', error.response?.data);
      setError(error.response?.data?.message || 'Error admitting student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admission/${studentId}`);
        fetchStudents();
        setSuccess('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        setError('Failed to delete student');
      }
    }
  };

  const exportToExcel = () => {
    // In a real implementation, this would generate an Excel file
    alert('Export to Excel functionality would be implemented here');
  };

  const exportToPDF = () => {
    // In a real implementation, this would generate a PDF file
    alert('Export to PDF functionality would be implemented here');
  };

  // Get class name for display
  const getClassName = (classId) => {
    const classObj = classes.find(c => c._id === classId);
    return classObj ? `${classObj.name} ${classObj.section}` : '';
  };

  // Filter and paginate students
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.parentName && student.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ 
        ...formData, 
        documents: [...formData.documents, ...Array.from(e.target.files)] 
      });
    }
  };

  return (
    <div className="admission-container">
      <div className="admission-header">
        <h1 className="admission-title">Student Admission</h1>
        <div className="action-buttons">
          <button 
            onClick={exportToExcel}
            className="btn btn-excel"
          >
            Export to Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="btn btn-pdf"
          >
            Export to PDF
          </button>
          <button 
            onClick={handleOpenModal}
            className="btn btn-primary"
          >
            Add New Student
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="card">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading students...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Admission No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Roll No</th>
                  <th>Parent Name</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr 
                      key={student._id} 
                      onClick={() => window.location.href = `/student/${student._id}`}
                      className="clickable-row"
                    >
                      <td>{student.admissionNumber}</td>
                      <td>{student.name}</td>
                      <td>{getClassName(student.class)}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.parentName}</td>
                      <td>{student.parentContact}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleDelete(student._id);
                          }}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {filteredStudents.length > studentsPerPage && (
              <div className="pagination">
                {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
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
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="modal-overlay"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="modal-container">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="modal-backdrop" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="modal-content large-modal">
                <Dialog.Title as="h3" className="modal-title">
                  Add New Student
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="modal-close"
                  >
                    &times;
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-tabs">
                    <div className="form-tab active">Basic Info</div>
                    <div className="form-tab">Personal Details</div>
                    <div className="form-tab">Parents & Address</div>
                    <div className="form-tab">Academic Details</div>
                    <div className="form-tab">Documents</div>
                  </div>

                  <div className="form-section">
                    <h4>Basic Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Admission Number *</label>
                        <input
                          type="text"
                          value={formData.admissionNumber}
                          readOnly
                          className="readonly-input"
                        />
                        <small className="form-hint">Auto-generated admission number</small>
                      </div>

                      <div className="form-group">
                        <label>Admission Date *</label>
                        <input
                          type="date"
                          value={formData.admissionDate}
                          onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Class *</label>
                        <select
                          value={formData.class}
                          onChange={handleClassChange}
                          required
                        >
                          <option value="">Select Class</option>
                          {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name} - Section {cls.section}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Roll Number *</label>
                        <input
                          type="text"
                          value={formData.rollNumber}
                          readOnly
                          className="readonly-input"
                        />
                        <small className="form-hint">Auto-assigned roll number</small>
                      </div>

                      <div className="form-group">
                        <label>Ward Type *</label>
                        <select
                          value={formData.wardType}
                          onChange={(e) => setFormData({ ...formData, wardType: e.target.value })}
                          required
                        >
                          <option value="">Select Ward Type</option>
                          <option value="General">General</option>
                          <option value="Staff Ward">Staff Ward</option>
                          <option value="RTE">RTE</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Personal Details</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Date of Birth *</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Gender *</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="General">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Religion *</label>
                        <select
                          value={formData.religion}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          required
                        >
                          <option value="">Select Religion</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Muslim">Muslim</option>
                          <option value="Christian">Christian</option>
                          <option value="Sikh">Sikh</option>
                          <option value="Buddhist">Buddhist</option>
                          <option value="Jain">Jain</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Aadhaar Number *</label>
                        <input
                          type="text"
                          value={formData.aadhaarNumber}
                          onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                          maxLength="12"
                          pattern="[0-9]{12}"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>PEN Number</label>
                        <input
                          type="text"
                          value={formData.penNumber}
                          onChange={(e) => setFormData({ ...formData, penNumber: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>APAR ID</label>
                        <input
                          type="text"
                          value={formData.aparId}
                          onChange={(e) => setFormData({ ...formData, aparId: e.target.value })}
                        />
                      </div>

                      <div className="form-group checkbox-group">
                        <label>Handicap</label>
                        <input
                          type="checkbox"
                          checked={formData.isHandicap}
                          onChange={(e) => setFormData({ ...formData, isHandicap: e.target.checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Parent Details</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Father's Name</label>
                        <input
                          type="text"
                          value={formData.fatherName}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Father's Occupation</label>
                        <input
                          type="text"
                          value={formData.fatherOccupation}
                          onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Father's Contact</label>
                        <input
                          type="tel"
                          value={formData.fatherContact}
                          onChange={(e) => setFormData({ ...formData, fatherContact: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mother's Name</label>
                        <input
                          type="text"
                          value={formData.motherName}
                          onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mother's Occupation</label>
                        <input
                          type="text"
                          value={formData.motherOccupation}
                          onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mother's Contact</label>
                        <input
                          type="tel"
                          value={formData.motherContact}
                          onChange={(e) => setFormData({ ...formData, motherContact: e.target.value })}
                        />
                      </div>
                    </div>

                    <h4>Address Details</h4>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Address *</label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows="3"
                          required
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Pincode</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Previous School Details</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Previous School</label>
                        <input
                          type="text"
                          value={formData.previousSchool}
                          onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Previous School Address</label>
                        <textarea
                          value={formData.previousSchoolAddress}
                          onChange={(e) => setFormData({ ...formData, previousSchoolAddress: e.target.value })}
                          rows="2"
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>Board Registration Number</label>
                        <input
                          type="text"
                          value={formData.boardRegNumber}
                          onChange={(e) => setFormData({ ...formData, boardRegNumber: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Board Roll Number</label>
                        <input
                          type="text"
                          value={formData.boardRollNumber}
                          onChange={(e) => setFormData({ ...formData, boardRollNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Student Photo</h4>
                    <div className="form-group">
                      <label>Upload Image</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                      />
                      <p className="form-hint">
                        Size of image should not be more than 100 KB & must be in jpeg, png, jpg file format only.
                      </p>
                    </div>

                    <h4>Required Documents</h4>
                    <div className="document-list">
                      <p>1. Birth Certificate</p>
                      <p>2. TC (Transfer Certificate)</p>
                      <p>3. Report Card</p>
                      <p>4. Aadhar Card</p>
                      <p>5. Migration Certificate</p>
                    </div>
                    
                    <div className="form-group">
                      <label>Upload Documents</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleDocumentChange}
                      />
                    </div>
                  </div>

                  {error && <div className="form-error">{error}</div>}

                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Saving...' : 'Admit Student'}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}