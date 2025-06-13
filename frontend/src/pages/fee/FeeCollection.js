import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Fee.css';
import './FeeCollection.css';

export default function FeeCollection() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Ledger state
  const [showLedger, setShowLedger] = useState(false);
  const [ledger, setLedger] = useState([]);
  
  // Month selection state
  const [showMonths, setShowMonths] = useState(false);
  const [months, setMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  
  // Fee details state
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [feeDetails, setFeeDetails] = useState([]);
  
  // Payment state
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('');
  
  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleSearch = async () => {
    if (!admissionNumber.trim()) {
      setError('Please enter an admission number');
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);
    setShowMonths(false);
    setShowFeeDetails(false);
    setShowPaymentConfirmation(false);
    setShowReceipt(false);

    try {
      const response = await axios.get(`http://localhost:5000/api/fee/student/${admissionNumber}`);
      setStudent(response.data);
      setSuccess('Student details fetched successfully');
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Student not found. Please check the admission number.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowLedger = async () => {
    if (!student) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:5000/api/fee/ledger/${student.admissionNumber}`);
      setLedger(response.data);
      setShowLedger(true);
    } catch (err) {
      console.error('Error fetching ledger:', err);
      setError('Failed to fetch payment history.');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseMonths = async () => {
    if (!student) return;
    
    setLoading(true);
    setError('');
    setShowFeeDetails(false);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/fee/months/${student.admissionNumber}`);
      setMonths(response.data);
      setSelectedMonths([]);
      setShowMonths(true);
    } catch (err) {
      console.error('Error fetching months:', err);
      setError('Failed to fetch months data.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthSelection = (month) => {
    if (month.status === 'paid') return;
    
    setSelectedMonths(prev => {
      const isSelected = prev.some(m => m.month === month.id && m.year === month.year);
      
      if (isSelected) {
        return prev.filter(m => !(m.month === month.id && m.year === month.year));
      } else {
        return [...prev, { month: month.id, year: month.year, name: month.name }];
      }
    });
  };

  const handleGetFeeDetails = async () => {
    if (selectedMonths.length === 0) {
      setError('Please select at least one month');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const monthsParam = selectedMonths.map(m => `${m.month}-${m.year}`).join(',');
      console.log(`Fetching fee details with months: ${monthsParam}`);
      
      const response = await axios.get(`http://localhost:5000/api/fee/details/${student.admissionNumber}?months=${monthsParam}`);
      
      console.log('Fee details response:', response.data);
      
      // Process fee details to include selected months that have no fees
      const processedFeeDetails = response.data.map(monthFee => {
        // If no fee heads, provide an empty array
        if (!monthFee.feeHeads) {
          monthFee.feeHeads = [];
        }
        return monthFee;
      });
      
      setFeeDetails(processedFeeDetails);
      setShowFeeDetails(true);
      setShowMonths(false);
    } catch (err) {
      console.error('Error fetching fee details:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to fetch fee details: ${err.response.data.message}`);
      } else {
        setError('Failed to fetch fee details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    feeDetails.forEach(monthFee => {
      if (monthFee.feeHeads && monthFee.feeHeads.length > 0) {
        monthFee.feeHeads.forEach(feeHead => {
          total += feeHead.amount;
        });
      }
    });
    return total;
  };

  const calculateLateFine = () => {
    let totalLateFine = 0;
    feeDetails.forEach(monthFee => {
      if (monthFee.lateFine) {
        totalLateFine += monthFee.lateFine;
      }
    });
    return totalLateFine;
  };

  const calculateNetAmount = () => {
    return calculateTotal() + calculateLateFine();
  };

  const handleConfirmPayment = () => {
    if (feeDetails.length === 0 || calculateTotal() === 0) {
      setError('No fees to pay');
      return;
    }
    
    setShowPaymentConfirmation(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Filter out fee heads with no data
      const validFeeDetails = feeDetails.filter(monthFee => 
        monthFee && monthFee.feeHeads && monthFee.feeHeads.length > 0
      );
      
      // Prepare selected months with fee heads
      const monthsWithFeeHeads = validFeeDetails.map(monthFee => ({
        month: monthFee.month,
        year: monthFee.year,
        feeHeads: monthFee.feeHeads || []
      }));
      
      if (monthsWithFeeHeads.length === 0) {
        throw new Error('No valid fee details to process');
      }
      
      const paymentData = {
        studentId: student._id,
        selectedMonths: monthsWithFeeHeads,
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? { cardNumber, bankName } : null,
        totalAmount: calculateTotal(),
        lateFine: calculateLateFine(),
        netAmount: calculateNetAmount()
      };
      
      const response = await axios.post('http://localhost:5000/api/fee/payment', paymentData);
      setReceipt(response.data);
      setShowReceipt(true);
      setShowPaymentConfirmation(false);
      setSuccess('Payment processed successfully!');
      
      // Reset fee details after payment
      setFeeDetails([]);
      setShowFeeDetails(false);
    } catch (err) {
      console.error('Error processing payment:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Payment failed: ${err.response.data.message}`);
      } else {
        setError('Failed to process payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="fee-title">Fee Collection</h1>
        <Link to="/fee" className="back-link">Back to Fee Management</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="fee-content">
        <div className="fee-card">
          <h2>Student Search</h2>
          <div className="search-container">
            <div className="form-group">
              <label>Enter Admission Number:</label>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="e.g. ADM-2023-001" 
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                />
                <button 
                  className="btn-primary"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Show Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {student && (
          <div className="fee-card">
            <div className="student-header">
              <h2>Student Information</h2>
              <div className="student-actions">
                <button 
                  className="btn-link"
                  onClick={handleShowLedger}
                >
                  Show Ledger
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleChooseMonths}
                >
                  Choose Unpaid Month
                </button>
              </div>
            </div>
            
            <div className="student-details-grid">
              <div className="detail-item">
                <span className="detail-label">Receipt Date</span>
                <span className="detail-value">{formatDate(new Date())}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Admission Number</span>
                <span className="detail-value">{student.admissionNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Admission Date</span>
                <span className="detail-value">{formatDate(student.admissionDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Student Name</span>
                <span className="detail-value">{student.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Father Name</span>
                <span className="detail-value">{student.fatherName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mother Name</span>
                <span className="detail-value">{student.motherName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Class/Sec</span>
                <span className="detail-value">{student.class}-{student.section}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Roll No</span>
                <span className="detail-value">{student.rollNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ward Type</span>
                <span className="detail-value">{student.wardType}</span>
              </div>
            </div>
          </div>
        )}
        
        {showFeeDetails && (
          <div className="fee-card">
            <h2>Fee Details</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Fee Head</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {feeDetails.length > 0 ? (
                    feeDetails.map(monthFee => (
                      monthFee.feeHeads && monthFee.feeHeads.length > 0 ? (
                        monthFee.feeHeads.map((feeHead, index) => (
                          <tr key={`${monthFee.month}-${monthFee.year}-${feeHead.id}`}>
                            {index === 0 && (
                              <td rowSpan={monthFee.feeHeads.length}>
                                {feeHead.type === 'one-time' ? 'One-time Fee' : `${monthFee.monthName} ${monthFee.year}`}
                              </td>
                            )}
                            <td>{feeHead.name}</td>
                            <td>₹{feeHead.amount.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr key={`${monthFee.month}-${monthFee.year}-empty`}>
                          <td>{monthFee.monthName} {monthFee.year}</td>
                          <td colSpan="2" className="no-data">No pending fees for this month</td>
                        </tr>
                      )
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data">No pending fees found</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-right"><strong>Total:</strong></td>
                    <td>₹{calculateTotal().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-right"><strong>Late Fine:</strong></td>
                    <td>₹{calculateLateFine().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-right"><strong>Net Amount:</strong></td>
                    <td>₹{calculateNetAmount().toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn-primary"
                onClick={handleConfirmPayment}
                disabled={calculateTotal() === 0}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Month Selection Modal */}
      {showMonths && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Select Months</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowMonths(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="months-grid">
                {months.map(month => (
                  <div 
                    key={`${month.id}-${month.year}`}
                    className={`month-item ${month.status} ${
                      selectedMonths.some(m => m.month === month.id && m.year === month.year) ? 'selected' : ''
                    }`}
                    onClick={() => handleMonthSelection(month)}
                  >
                    {month.name} {month.year}
                  </div>
                ))}
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowMonths(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleGetFeeDetails}
                  disabled={selectedMonths.length === 0}
                >
                  Get Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Ledger Modal */}
      {showLedger && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Payment History</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowLedger(false)}
                >
                  ×
                </button>
              </div>
              
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
          </div>
        </div>
      )}
      
      {/* Payment Confirmation Modal */}
      {showPaymentConfirmation && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Payment Confirmation</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowPaymentConfirmation(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="payment-confirmation">
                <div className="confirmation-amount">
                  <span className="confirmation-label">Net Payable Amount:</span>
                  <span className="confirmation-value">₹{calculateNetAmount().toFixed(2)}</span>
                </div>
                
                <div className="form-group">
                  <label>Payment Mode:</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="card-details">
                    <h3>Bank Details</h3>
                    <div className="form-group">
                      <label>Card No.:</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name:</label>
                      <input 
                        type="text" 
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Axis Bank"
                      />
                    </div>
                    <div className="form-group">
                      <label>Payment Date:</label>
                      <input 
                        type="date" 
                        value={new Date().toISOString().split('T')[0]}
                        readOnly
                      />
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowPaymentConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handlePayment}
                    disabled={loading || (paymentMethod === 'card' && (!cardNumber || !bankName))}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Receipt Modal */}
      {showReceipt && receipt && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content receipt-modal">
              <div className="modal-header">
                <h2>Fee Receipt</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowReceipt(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="receipt">
                <div className="receipt-header">
                  <h1>School Fee Receipt</h1>
                  <div className="receipt-number">
                    <span>Receipt No: {receipt.receiptNumber}</span>
                    <span>Date: {formatDate(receipt.paymentDate)}</span>
                  </div>
                </div>
                
                <div className="receipt-student">
                  <div className="receipt-row">
                    <div className="receipt-col">
                      <span className="receipt-label">Student Name:</span>
                      <span className="receipt-value">{receipt.student.name}</span>
                    </div>
                    <div className="receipt-col">
                      <span className="receipt-label">Admission No:</span>
                      <span className="receipt-value">{receipt.student.admissionNumber}</span>
                    </div>
                  </div>
                  <div className="receipt-row">
                    <div className="receipt-col">
                      <span className="receipt-label">Class:</span>
                      <span className="receipt-value">{receipt.student.class}-{receipt.student.section}</span>
                    </div>
                    <div className="receipt-col">
                      <span className="receipt-label">Roll No:</span>
                      <span className="receipt-value">{receipt.student.rollNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div className="receipt-details">
                  <table>
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Fee Head</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.fees.map((fee, feeIndex) => (
                        fee.feeHeads && fee.feeHeads.length > 0 ? (
                          fee.feeHeads.map((feeHead, headIndex) => (
                            <tr key={`${feeIndex}-${headIndex}`}>
                              {headIndex === 0 && (
                                <td rowSpan={fee.feeHeads.length}>
                                  {fee.month === null ? 'One-time Fee' : 
                                    `${months.find(m => m.id === fee.month)?.name || ''} ${fee.year}`}
                                </td>
                              )}
                              <td>{feeHead.name}</td>
                              <td>₹{feeHead.amount.toFixed(2)}</td>
                            </tr>
                          ))
                        ) : null
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2" className="text-right"><strong>Total:</strong></td>
                        <td>₹{receipt.totalAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="2" className="text-right"><strong>Late Fine:</strong></td>
                        <td>₹{receipt.lateFine.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="2" className="text-right"><strong>Net Amount:</strong></td>
                        <td>₹{receipt.netAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="receipt-footer">
                  <div className="payment-info">
                    <span className="receipt-label">Payment Method:</span>
                    <span className="receipt-value">
                      {receipt.paymentMethod === 'card' 
                        ? `Card (${receipt.cardDetails.bankName} - ${receipt.cardDetails.cardNumber})` 
                        : 'Cash'}
                    </span>
                  </div>
                  
                  <div className="receipt-signature">
                    <div className="signature-line"></div>
                    <span>Authorized Signature</span>
                  </div>
                </div>
                
                <div className="receipt-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => window.print()}
                  >
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}