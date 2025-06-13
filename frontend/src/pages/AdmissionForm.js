import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admission.css';

const AdmissionForm = ({ onClose, onSuccess, classes }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    admissionNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    class: '',
    section: '',
    currentClass: '',
    currentSection: '',
    rollNumber: '',
    
    // Personal Details
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
    
    // Parent Information
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
    
    // Address Information
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    
    // Previous School Details
    previousSchool: '',
    previousSchoolAddress: '',
    
    // Academic Details
    subjects: [
      { name: '', code: '' },
      { name: '', code: '' },
      { name: '', code: '' },
      { name: '', code: '' },
      { name: '', code: '' },
      { name: '', code: '' }
    ],
    boardRegNumber: '',
    boardRollNumber: '',
    
    // Documents & Images
    profileImage: null,
    documents: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files.length > 0) {
      const newDocuments = Array.from(e.target.files).map(file => ({
        file,
        name: file.name,
        type: file.type
      }));
      
      setFormData({ 
        ...formData, 
        documents: [...formData.documents, ...newDocuments] 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert formData to match backend model
      const studentData = {
        name: formData.name,
        admissionNumber: formData.admissionNumber,
        admissionDate: formData.admissionDate,
        class: formData.class,
        section: formData.section,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        parentName: formData.parentName || formData.fatherName,
        parentContact: formData.parentContact || formData.fatherContact,
        address: formData.address,
        // Include other fields as needed
      };

      const response = await axios.post('http://localhost:5000/api/admission', studentData);
      
      if (response.data) {
        onSuccess && onSuccess();
        onClose && onClose();
      }
    } catch (error) {
      console.error('Admission error:', error.response?.data);
      setError(error.response?.data?.message || 'Error admitting student');
    } finally {
      setLoading(false);
    }
  };

  const nextTab = () => {
    if (activeTab < 5) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className="admission-form-container">
      <h2 className="form-title">Student Admission Form</h2>
      
      <div className="tab-navigation">
        <div className={`tab-item ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
          Basic Info
        </div>
        <div className={`tab-item ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
          Personal Details
        </div>
        <div className={`tab-item ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>
          Parents & Address
        </div>
        <div className={`tab-item ${activeTab === 4 ? 'active' : ''}`} onClick={() => setActiveTab(4)}>
          Academic Details
        </div>
        <div className={`tab-item ${activeTab === 5 ? 'active' : ''}`} onClick={() => setActiveTab(5)}>
          Documents
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Basic Information */}
        <div className={`tab-content ${activeTab === 1 ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Admission Number *</label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Admission Date *</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Admission in Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Section *</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Current Class *</label>
                <select
                  name="currentClass"
                  value={formData.currentClass}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Current Section *</label>
                <select
                  name="currentSection"
                  value={formData.currentSection}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab 2: Personal Details */}
        <div className={`tab-content ${activeTab === 2 ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
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
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
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
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
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
                <label>PEN Number</label>
                <input
                  type="text"
                  name="penNumber"
                  value={formData.penNumber}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>APAR ID *</label>
                <input
                  type="text"
                  name="aparId"
                  value={formData.aparId}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Aadhaar Number *</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  required
                  maxLength="12"
                  pattern="[0-9]{12}"
                />
              </div>
              
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Ward Type *</label>
                <select
                  name="wardType"
                  value={formData.wardType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Ward Type</option>
                  <option value="General">General</option>
                  <option value="Staff">Staff</option>
                  <option value="RTE">RTE</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>House</label>
                <input
                  type="text"
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>Handicap</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isHandicap"
                    checked={formData.isHandicap}
                    onChange={handleChange}
                  />
                  <span>Yes</span>
                </div>
              </div>
              
              {formData.isHandicap && (
                <div className="form-group">
                  <label>Handicap Type</label>
                  <input
                    type="text"
                    name="handicapType"
                    value={formData.handicapType}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tab 3: Parents & Address */}
        <div className={`tab-content ${activeTab === 3 ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Father's Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Educational Qualification</label>
                <input
                  type="text"
                  name="fatherEducation"
                  value={formData.fatherEducation}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Monthly Income</label>
                <input
                  type="number"
                  name="fatherIncome"
                  value={formData.fatherIncome}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="fatherContact"
                  value={formData.fatherContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Mother's Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Educational Qualification</label>
                <input
                  type="text"
                  name="motherEducation"
                  value={formData.motherEducation}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Monthly Income</label>
                <input
                  type="number"
                  name="motherIncome"
                  value={formData.motherIncome}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="motherContact"
                  value={formData.motherContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Address Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              
              <div className="form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
              
              <div className="form-group">
                <label>Pin Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab 4: Academic Details */}
        <div className={`tab-content ${activeTab === 4 ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Previous School Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Last School Name</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group full-width">
                <label>Last School Address</label>
                <textarea
                  name="previousSchoolAddress"
                  value={formData.previousSchoolAddress}
                  onChange={handleChange}
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Subject Details</h3>
            <div className="form-grid">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <div className="form-group" key={index}>
                  <label>{`Subject ${num}`}</label>
                  <select
                    value={formData.subjects[index].name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    <option value="English">English</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Computer Science">Computer Science</option>
                    {/* Add more subjects as needed */}
                  </select>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Board Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Board Registration Number</label>
                <input
                  type="text"
                  name="boardRegNumber"
                  value={formData.boardRegNumber}
                  onChange={handleChange}
                  placeholder="Enter CBSE Registration Number"
                />
              </div>
              
              <div className="form-group">
                <label>Board Roll Number</label>
                <input
                  type="text"
                  name="boardRollNumber"
                  value={formData.boardRollNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab 5: Documents */}
        <div className={`tab-content ${activeTab === 5 ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Student Photo</h3>
            <div className="form-grid">
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
            </div>
          </div>
          
          <div className="form-section">
            <h3>Required Documents</h3>
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
            
            {formData.documents.length > 0 && (
              <div className="uploaded-documents">
                <h4>Uploaded Documents</h4>
                <ul>
                  {formData.documents.map((doc, index) => (
                    <li key={index}>{doc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-navigation">
          {activeTab > 1 && (
            <button type="button" onClick={prevTab} className="btn btn-secondary">
              Previous
            </button>
          )}
          
          {activeTab < 5 ? (
            <button type="button" onClick={nextTab} className="btn btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;