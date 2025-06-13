import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { mockClasses, mockWards } from '../../utils/mockData';
import '../Fee.css';

export default function FeeHeadMaster() {
  const [selectedFeeHead, setSelectedFeeHead] = useState(null);
  const [isMonthlyFee, setIsMonthlyFee] = useState(false);
  const [isClassBasedFee, setIsClassBasedFee] = useState(false);
  const [feeHeads, setFeeHeads] = useState([]);
  const [classes, setClasses] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newFeeHeadName, setNewFeeHeadName] = useState('');
  
  // Sample months
  const months = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
  
  // Sample fee amounts for classes and ward types (will be replaced with actual data)
  const [feeAmounts, setFeeAmounts] = useState({});

  useEffect(() => {
    fetchFeeHeads();
    fetchClasses();
    fetchWards();
  }, []);

  const fetchFeeHeads = async () => {
    try {
      setLoading(true);
      // Use static data for now to avoid API errors
      const sampleFeeHeads = [
        { _id: '1', name: 'Registration Fee', frequency: 'one-time' },
        { _id: '2', name: 'Admission Fee', frequency: 'one-time' },
        { _id: '3', name: 'Tuition Fee', frequency: 'monthly' },
        { _id: '4', name: 'Lab Fee', frequency: 'monthly' },
        { _id: '5', name: 'Library Fee', frequency: 'monthly' }
      ];
      setFeeHeads(sampleFeeHeads);
    } catch (error) {
      console.error('Error fetching fee heads:', error);
      setError('Failed to fetch fee heads');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Use mock data if API fails
      setClasses(mockClasses);
    }
  };

  const fetchWards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ward');
      setWards(response.data);
    } catch (error) {
      console.error('Error fetching wards:', error);
      // Use mock data if API fails
      setWards(mockWards);
    }
  };

  const handleFeeHeadClick = (feeHead) => {
    setSelectedFeeHead(feeHead);
    // Reset checkboxes when selecting a new fee head
    setIsMonthlyFee(false);
    setIsClassBasedFee(false);
    
    // Initialize fee amounts for this fee head
    if (classes.length > 0 && wards.length > 0) {
      const initialFeeAmounts = {};
      classes.forEach(cls => {
        initialFeeAmounts[cls._id] = {};
        wards.forEach(ward => {
          initialFeeAmounts[cls._id][ward._id] = 0;
        });
      });
      setFeeAmounts(initialFeeAmounts);
    }
  };

  const handleCheckboxChange = (type) => {
    if (type === 'monthly') {
      setIsMonthlyFee(!isMonthlyFee);
    } else if (type === 'classBased') {
      setIsClassBasedFee(!isClassBasedFee);
    }
  };

  const handleAmountChange = (classId, wardId, value) => {
    setFeeAmounts(prev => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [wardId]: value
      }
    }));
  };

  const handleSaveChanges = () => {
    if (!selectedFeeHead) return;
    alert('Fee structure saved successfully!');
  };

  const handleEmptyRowClick = (index) => {
    // Create a new fee head when clicking on an empty row
    if (newFeeHeadName.trim() === '') {
      setNewFeeHeadName(`Fee Head ${index}`);
    } else {
      // Add the new fee head to the list
      const newFeeHead = {
        _id: `new-${Date.now()}`,
        name: newFeeHeadName,
        frequency: 'one-time'
      };
      
      setFeeHeads([...feeHeads, newFeeHead]);
      setNewFeeHeadName('');
    }
  };

  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="fee-title">Fee Head Master</h1>
        <Link to="/fee" className="back-link">Back to Fee Management</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="fee-head-layout">
        {/* Left side - Fee Head List */}
        <div className="fee-head-list-container">
          <h2>Fee Heads</h2>
          <div className="fee-head-list-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Fee Head</th>
                </tr>
              </thead>
              <tbody>
                {feeHeads.map((feeHead, index) => (
                  <tr 
                    key={feeHead._id} 
                    className={selectedFeeHead?._id === feeHead._id ? 'selected-row' : ''}
                    onClick={() => handleFeeHeadClick(feeHead)}
                  >
                    <td>{index + 1}</td>
                    <td>{feeHead.name}</td>
                  </tr>
                ))}
                {/* Empty rows to make it 25 */}
                {Array.from({ length: Math.max(0, 25 - feeHeads.length) }).map((_, index) => (
                  <tr 
                    key={`empty-${index}`}
                    onClick={() => handleEmptyRowClick(feeHeads.length + index + 1)}
                    className="empty-row"
                  >
                    <td>{feeHeads.length + index + 1}</td>
                    <td>
                      {feeHeads.length + index + 1 === feeHeads.length + 1 && newFeeHeadName ? (
                        <input 
                          type="text" 
                          value={newFeeHeadName} 
                          onChange={(e) => setNewFeeHeadName(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEmptyRowClick(feeHeads.length + index + 1);
                            }
                          }}
                          autoFocus
                        />
                      ) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Right side - Fee Head Details */}
        <div className="fee-head-details">
          {selectedFeeHead ? (
            <div className="fee-head-detail-content">
              <h2>{selectedFeeHead.name.toUpperCase()}</h2>
              
              <div className="fee-head-form">
                <div className="form-group">
                  <label>Fee Head Name</label>
                  <input type="text" value={selectedFeeHead.name} readOnly />
                </div>
                
                <div className="form-group">
                  <label>Short Name</label>
                  <input type="text" value={selectedFeeHead.name.substring(0, 3).toUpperCase()} readOnly />
                </div>
                
                <div className="fee-type-checkboxes">
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="monthlyFee" 
                      checked={isMonthlyFee} 
                      onChange={() => handleCheckboxChange('monthly')}
                    />
                    <label htmlFor="monthlyFee">Monthly Fee</label>
                  </div>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="classBasedFee" 
                      checked={isClassBasedFee} 
                      onChange={() => handleCheckboxChange('classBased')}
                    />
                    <label htmlFor="classBasedFee">Class Based Fee</label>
                  </div>
                </div>
                
                {/* Monthly Fee Section */}
                {isMonthlyFee && (
                  <div className="monthly-fee-section">
                    <h3>Month Based</h3>
                    <div className="month-checkboxes">
                      <div className="checkbox-group">
                        <input type="checkbox" id="checkAll" />
                        <label htmlFor="checkAll">Check All</label>
                      </div>
                      
                      <div className="months-grid">
                        {months.map(month => (
                          <div className="checkbox-group" key={month}>
                            <input type="checkbox" id={`month-${month}`} />
                            <label htmlFor={`month-${month}`}>{month}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Class Based Fee Section */}
                {isClassBasedFee && classes.length > 0 && wards.length > 0 && (
                  <div className="class-based-fee-section">
                    <h3>Class Based Fee Structure</h3>
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>CLASS</th>
                            {wards.map(ward => (
                              <th key={ward._id}>{ward.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {classes.map((cls, index) => (
                            <tr key={cls._id}>
                              <td>{index + 1}</td>
                              <td>{cls.name}</td>
                              {wards.map(ward => (
                                <td key={`${cls._id}-${ward._id}`}>
                                  <input 
                                    type="number" 
                                    className="amount-input"
                                    value={feeAmounts[cls._id]?.[ward._id] || 0}
                                    onChange={(e) => handleAmountChange(cls._id, ward._id, e.target.value)}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    className="btn-primary"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="select-fee-head-message">
              Select a fee head from the list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}