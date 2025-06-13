/**
 * Utility function to generate admission numbers
 */

// Format: ADM-YYYY-XXXX where XXXX is a sequential number
const generateAdmissionNumber = (year, lastSequence = 0) => {
  const currentYear = year || new Date().getFullYear();
  const nextSequence = lastSequence + 1;
  return `ADM-${currentYear}-${nextSequence.toString().padStart(4, '0')}`;
};

// Generate roll numbers for a class (1 to capacity)
const generateRollNumbers = (capacity) => {
  return Array.from({ length: capacity }, (_, i) => (i + 1).toString());
};

module.exports = {
  generateAdmissionNumber,
  generateRollNumbers
};