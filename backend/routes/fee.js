const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Month names for reference
const monthsList = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' }
];

// Late fine rules
const lateFineRules = [
  { id: 'lf1', name: 'Default Late Fine', startDay: 10, amount: 50, type: 'fixed' },
  { id: 'lf2', name: 'Extended Late Fine', startDay: 20, amount: 5, type: 'per-day', maxAmount: 200 }
];

// @route   GET api/fee/student/:admissionNumber
// @desc    Get student details by admission number
// @access  Public (for development)
router.get('/student/:admissionNumber', async (req, res) => {
  try {
    const student = global.appData.students.find(s => s.admissionNumber === req.params.admissionNumber);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/fee/months/:admissionNumber
// @desc    Get months status (paid/unpaid) for a student
// @access  Public (for development)
router.get('/months/:admissionNumber', async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    const { year } = req.query;
    
    const currentYear = parseInt(year) || new Date().getFullYear();
    
    const student = global.appData.students.find(s => s.admissionNumber === admissionNumber);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get paid months for this student
    const studentPaidMonths = global.appData.paidMonths[student._id] || [];
    
    // Create months status
    const monthsStatus = monthsList.map(month => {
      // Check if this month is paid for monthly fees
      const isPaid = studentPaidMonths.some(
        pm => pm.month === month.id && pm.year === currentYear && 
        // Check if all monthly fee heads are paid
        global.appData.feeHeads.filter(fh => fh.type === 'monthly').every(fh => 
          pm.feeHeads.includes(fh.id)
        )
      );
      
      return {
        ...month,
        year: currentYear,
        status: isPaid ? 'paid' : 'unpaid'
      };
    });
    
    res.json(monthsStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/fee/details/:admissionNumber
// @desc    Get fee details for selected months
// @access  Public (for development)
router.get('/details/:admissionNumber', async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    const { months } = req.query;
    
    if (!months) {
      return res.status(400).json({ message: 'Months are required' });
    }
    
    const selectedMonths = months.split(',').map(m => {
      const [month, year] = m.split('-');
      return { 
        month: parseInt(month), 
        year: parseInt(year) 
      };
    });
    
    const student = global.appData.students.find(s => s.admissionNumber === admissionNumber);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get paid fee heads for this student
    const studentPaidMonths = global.appData.paidMonths[student._id] || [];
    
    // Get fee details for selected months
    const feeDetails = selectedMonths.map(({ month, year }) => {
      // Get monthly fee heads
      const monthlyFeeHeads = global.appData.feeHeads
        .filter(fh => fh.type === 'monthly')
        .map(fh => {
          // Check if this fee head is paid for this month
          const isPaid = studentPaidMonths.some(
            pm => pm.month === month && pm.year === year && pm.feeHeads.includes(fh.id)
          );
          
          // If fee is class-based, get the class-specific amount
          let amount = fh.amount;
          if (fh.isClassBased && global.appData.classFeeStructure[student.class] && 
              global.appData.classFeeStructure[student.class][fh.id]) {
            amount = global.appData.classFeeStructure[student.class][fh.id];
          }
          
          return {
            ...fh,
            amount,
            status: isPaid ? 'paid' : 'pending'
          };
        })
        .filter(fh => fh.status === 'pending'); // Only include unpaid fees
      
      const monthName = monthsList.find(m => m.id === month)?.name || '';
      
      return {
        month,
        year,
        monthName,
        feeHeads: monthlyFeeHeads,
        lateFine: 0 // Default value
      };
    });
    
    // Add one-time fees if not already paid (only for the first month in selection)
    if (selectedMonths.length > 0) {
      const oneTimeFeeHeads = global.appData.feeHeads
        .filter(fh => fh.type === 'one-time')
        .map(fh => {
          // Check if this one-time fee is already paid
          const isPaid = studentPaidMonths.some(
            pm => pm.month === null && pm.feeHeads.includes(fh.id)
          );
          
          // If fee is class-based, get the class-specific amount
          let amount = fh.amount;
          if (fh.isClassBased && global.appData.classFeeStructure[student.class] && 
              global.appData.classFeeStructure[student.class][fh.id]) {
            amount = global.appData.classFeeStructure[student.class][fh.id];
          }
          
          return {
            ...fh,
            amount,
            status: isPaid ? 'paid' : 'pending'
          };
        })
        .filter(fh => fh.status === 'pending'); // Only include unpaid fees
      
      if (oneTimeFeeHeads.length > 0 && feeDetails.length > 0) {
        // Add one-time fees to the first month
        feeDetails[0].feeHeads = [...feeDetails[0].feeHeads, ...oneTimeFeeHeads];
      }
    }
    
    // Calculate late fine for each month
    feeDetails.forEach(monthFee => {
      const currentDate = new Date();
      const dueDate = new Date(monthFee.year, monthFee.month - 1, 10); // Due on 10th of each month
      
      if (currentDate > dueDate) {
        const daysLate = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
        
        // Apply late fine rules
        let lateFine = 0;
        
        // Fixed late fine after startDay
        if (daysLate >= lateFineRules[0].startDay) {
          lateFine += lateFineRules[0].amount;
        }
        
        // Per-day late fine after extended startDay
        if (daysLate >= lateFineRules[1].startDay) {
          const additionalDays = daysLate - lateFineRules[1].startDay + 1;
          const additionalFine = Math.min(
            additionalDays * lateFineRules[1].amount,
            lateFineRules[1].maxAmount
          );
          lateFine += additionalFine;
        }
        
        monthFee.lateFine = lateFine;
      } else {
        monthFee.lateFine = 0;
      }
    });
    
    res.json(feeDetails);
  } catch (err) {
    console.error('Error in fee details:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET api/fee/ledger/:admissionNumber
// @desc    Get payment history for a student
// @access  Public (for development)
router.get('/ledger/:admissionNumber', async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    
    const student = global.appData.students.find(s => s.admissionNumber === admissionNumber);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get payment history for this student
    const studentPayments = global.appData.payments.filter(p => p.studentId === student._id);
    
    // Format payment history
    const ledger = studentPayments.map((payment, index) => {
      const periods = payment.fees.map(fee => {
        if (fee.month === null) {
          return 'One-time Fees';
        }
        const monthName = monthsList.find(m => m.id === fee.month)?.name;
        return `${monthName} ${fee.year}`;
      }).join(', ');
      
      return {
        slNo: index + 1,
        receiptNumber: payment.receiptNumber,
        receiptDate: payment.paymentDate,
        period: periods,
        total: payment.netAmount
      };
    });
    
    res.json(ledger);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/fee/payment
// @desc    Process fee payment
// @access  Public (for development)
router.post('/payment', async (req, res) => {
  try {
    const { 
      studentId, 
      selectedMonths, 
      paymentMethod, 
      cardDetails,
      totalAmount,
      lateFine,
      netAmount
    } = req.body;
    

    
    if (!studentId || !selectedMonths || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (paymentMethod === 'card' && (!cardDetails || !cardDetails.cardNumber || !cardDetails.bankName)) {
      return res.status(400).json({ message: 'Card details are required for card payment' });
    }
    
    // Generate receipt number
    const receiptNumber = `REC-${new Date().getFullYear()}-${(global.appData.payments.length + 1).toString().padStart(3, '0')}`;
    
    // Get student details
    const student = global.appData.students.find(s => s._id === studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Process each selected month
    const processedFees = [];
    
    try {
      for (const monthData of selectedMonths) {
        if (!monthData || !monthData.feeHeads) {
          console.error('Invalid month data:', monthData);
          continue;
        }
        
        const { month, year, feeHeads: selectedFeeHeads } = monthData;
        
        // Get fee heads for this month
        let monthlyFeeHeads = [];
        
        if (month === null) {
          // One-time fees
          monthlyFeeHeads = selectedFeeHeads.map(fh => {
            // If fee is class-based, get the class-specific amount
            let amount = fh.amount;
            if (fh.isClassBased && global.appData.classFeeStructure[student.class] && 
                global.appData.classFeeStructure[student.class][fh.id]) {
              amount = global.appData.classFeeStructure[student.class][fh.id];
            }
            
            return {
              id: fh.id,
              name: fh.name,
              amount
            };
          });
        } else {
          // Monthly fees
          monthlyFeeHeads = selectedFeeHeads.map(fh => {
            // If fee is class-based, get the class-specific amount
            let amount = fh.amount;
            if (fh.isClassBased && global.appData.classFeeStructure[student.class] && 
                global.appData.classFeeStructure[student.class][fh.id]) {
              amount = global.appData.classFeeStructure[student.class][fh.id];
            }
            
            return {
              id: fh.id,
              name: fh.name,
              amount
            };
          });
        }
        
        processedFees.push({
          month,
          year,
          feeHeads: monthlyFeeHeads
        });
        
        // Update paid months tracking
        if (!global.appData.paidMonths[studentId]) {
          global.appData.paidMonths[studentId] = [];
        }
        
        global.appData.paidMonths[studentId].push({
          month,
          year,
          feeHeads: monthlyFeeHeads.map(fh => fh.id)
        });
      }
    } catch (error) {
      console.error('Error processing fee data:', error);
      return res.status(400).json({ message: 'Invalid fee data format' });
    }
    
    // Create payment record with current date
    const currentDate = new Date();
    const payment = {
      id: `p${global.appData.payments.length + 1}`,
      receiptNumber,
      studentId,
      fees: processedFees,
      totalAmount,
      lateFine,
      netAmount,
      paymentMethod,
      cardDetails,
      paymentDate: currentDate.toISOString().split('T')[0]
    };
    
    global.appData.payments.push(payment);
    
    // Create receipt data
    const receipt = {
      ...payment,
      student
    };
    
    res.status(201).json(receipt);
  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ message: 'Failed to process payment. Please try again.' });
  }
});

// @route   GET api/fee/heads
// @desc    Get all fee heads
// @access  Public (for development)
router.get('/heads', async (req, res) => {
  try {
    res.json(global.appData.feeHeads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;