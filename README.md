# School ERP System

A comprehensive School ERP system built with the MERN stack (MongoDB, Express.js, React, Node.js).

/*
  ✨ Coded with vibes by Rowhit (@rohiteeee)

  🔗 GitHub:   github.com/Rohitsingh385
  💼 LinkedIn: linkedin.com/in/rohiteeee
  📧 Email:    rk301855@gmail.com

  🧃 If you're using this, toss some credit — it's only fair.
  🧠 Built from scratch, not snatched. Respect the grind.
  
*/

## Features

- Authentication-based access (Admin and Teacher roles)
- Enquiry Management
- Student Admission
- Class Management
- Teacher Management
- Attendance Tracking
- Fee Management
- Transfer Certificate Management
- Reports Generation

## Project Structure

```
PROJECT-ERP/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── styles/
│       └── utils/
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/school_erp
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Default Admin Account

The system comes with a default admin account:
- Email: admin@school.com
- Password: admin123

## Modules

### Dashboard
- Overview of key metrics
- Quick access to main functions

### Enquiry Management
- Track and manage admission enquiries
- Convert enquiries to admissions

### Student Management
- Complete student profiles
- Academic history tracking

### Class Management
- Create and manage classes
- Assign teachers to classes

### Teacher Management
- Manage teacher information
- Track qualifications and assignments

### Attendance System
- Daily attendance tracking
- Attendance reports

### Fee Management
- Define fee structures
- Track payments and dues

### Certificate Management
- Generate transfer certificates
- Manage other school documents

## Technologies Used

- **Frontend:**
  - React
  - React Router
  - CSS
  - Headless UI
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Cloudinary (for image uploads)

## License
MIT