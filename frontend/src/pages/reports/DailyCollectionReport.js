import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Reports.css';
import './ReportStyles.css';

export default function DailyCollectionReport() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalAmount: 0,
    cashAmount: 0,
    cardAmount: 0,
    receiptCount: 0
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchDailyCollection();
  }, [date]);

  const fetchDailyCollection = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/daily-collection?date=${date}`);
      const paymentData = response.data;
      
      // Process payment data to include student details
      const processedData = await Promise.all(paymentData.map(async (payment) => {
        try {
          // Get student details
          const studentResponse = await axios.get(`http://localhost:5000/api/admission/${payment.studentId}`);
          const student = studentResponse.data;
          
          return {
            id: payment.receiptNumber,
            studentName: student.name,
            class: `${student.className} ${student.section}`,
            admissionNumber: student.admissionNumber,
            amount: payment.netAmount,
            paymentMethod: payment.paymentMethod,
            time: new Date(payment.paymentDate).toLocaleTimeString(),
            date: payment.paymentDate
          };
        } catch (err) {
          console.error('Error fetching student details:', err);
          return {
            id: payment.receiptNumber,
            studentName: 'Unknown',
            class: 'Unknown',
            admissionNumber: 'Unknown',
            amount: payment.netAmount,
            paymentMethod: payment.paymentMethod,
            time: new Date(payment.paymentDate).toLocaleTimeString(),
            date: payment.paymentDate
          };
        }
      }));
      
      setCollections(processedData);
      
      // Calculate summary
      const total = paymentData.reduce((sum, item) => sum + item.netAmount, 0);
      const cash = paymentData.filter(item => item.paymentMethod === 'cash')
        .reduce((sum, item) => sum + item.netAmount, 0);
      const card = paymentData.filter(item => item.paymentMethod === 'card')
        .reduce((sum, item) => sum + item.netAmount, 0);
      
      setSummary({
        totalAmount: total,
        cashAmount: cash,
        cardAmount: card,
        receiptCount: paymentData.length
      });
      
      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching daily collection:', err);
      setError('Failed to fetch daily collection data');
      setCollections([]);
      setSummary({
        totalAmount: 0,
        cashAmount: 0,
        cardAmount: 0,
        receiptCount: 0
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = collections.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="report-container">
      <div className="report-header">
        <div className="report-title-section">
          <h1 className="report-title">Daily Collection Report</h1>
          <p className="report-subtitle">View and download daily fee collection data</p>
        </div>
        <div className="report-actions">
          <Link to="/reports" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Reports
          </Link>
        </div>
      </div>

      <div className="report-filters">
        <div className="filter-group">
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

      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{summary.receiptCount}</h3>
            <p className="summary-label">Receipts</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{formatCurrency(summary.totalAmount)}</h3>
            <p className="summary-label">Total Collection</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-cash-register"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{formatCurrency(summary.cashAmount)}</h3>
            <p className="summary-label">Cash Collection</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <div className="summary-content">
            <h3 className="summary-value">{formatCurrency(summary.cardAmount)}</h3>
            <p className="summary-label">Card Collection</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading collection data...</p>
        </div>
      ) : (
        <div className="report-data-container">
          <h2 className="report-section-title">
            Collection Details 
            <span className="record-count">
              {collections.length > 0 ? 
                `(Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, collections.length)} of ${collections.length} records)` : 
                '(No records found)'}
            </span>
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Admission No</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.studentName}</td>
                      <td>{item.class}</td>
                      <td>{item.admissionNumber}</td>
                      <td>{formatCurrency(item.amount)}</td>
                      <td>
                        <span className={`payment-badge ${item.paymentMethod}`}>
                          {item.paymentMethod === 'cash' ? 'Cash' : 'Card'}
                        </span>
                      </td>
                      <td>{item.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No collection data found for this date</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {collections.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: Math.ceil(collections.length / itemsPerPage) }, (_, i) => {
                // Show limited page numbers with ellipsis
                if (
                  i === 0 || // First page
                  i === Math.ceil(collections.length / itemsPerPage) - 1 || // Last page
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
                disabled={currentPage === Math.ceil(collections.length / itemsPerPage)}
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