# School ERP System

A simple School ERP system built with the MERN stack (MongoDB, Express.js, React, Node.js) and Cloudinary for image uploads.

## Features

- Authentication-based access (Admin and Teacher roles)
- Enquiry Management
- Student Admission
- Class Management
- Teacher Management
- Attendance Tracking
- Fee Management
- Transfer Certificate Management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

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

After setting up the database, you can create an admin account using the registration endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@school.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user (admin only)
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Enquiry
- GET /api/enquiry - Get all enquiries
- POST /api/enquiry - Create new enquiry
- PUT /api/enquiry/:id - Update enquiry
- DELETE /api/enquiry/:id - Delete enquiry

### Admission
- GET /api/admission - Get all students
- POST /api/admission - Create new student
- PUT /api/admission/:id - Update student
- DELETE /api/admission/:id - Delete student

### Class
- GET /api/class - Get all classes
- POST /api/class - Create new class
- PUT /api/class/:id - Update class
- DELETE /api/class/:id - Delete class

### Teacher
- GET /api/teacher - Get all teachers
- POST /api/teacher - Create new teacher
- PUT /api/teacher/:id - Update teacher
- DELETE /api/teacher/:id - Delete teacher

### Attendance
- GET /api/attendance - Get attendance records
- POST /api/attendance - Mark attendance
- PUT /api/attendance/:id - Update attendance

### Fee
- GET /api/fee - Get all fee records
- POST /api/fee - Create new fee record
- PUT /api/fee/:id - Update fee record
- DELETE /api/fee/:id - Delete fee record

### Certificate
- GET /api/certificate - Get all certificates
- POST /api/certificate - Create new certificate
- PUT /api/certificate/:id - Update certificate
- DELETE /api/certificate/:id - Delete certificate

## Technologies Used

- Frontend:
  - React
  - React Router
  - Tailwind CSS
  - Headless UI
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Cloudinary
  - Express Validator


---

# The School ERP Journey

---

## 🔐 The Gateway (Login Page)

* Upon visiting the School ERP system, you're welcomed by a **clean, modern login page**.
* Features:

  * Gradient background
  * Centered white card with shadow
* Login Details:

  * **Email:** `admin@school.com`
  * **Password:** `admin123`
* The **login button shows a loading spinner** during authentication.

---

### 📊 The Command Center (Dashboard)

* After a successful login, you're taken to the **dashboard**.
* It provides a **bird’s-eye view** of the school’s key metrics:

  * Total number of students
  * Number of teachers
  * Active classes
  * Pending enquiries
* The dashboard is **responsive** and adjusts to all screen sizes.

---

## 🧭 The Management Hub (Navigation)

* A clean **top navigation bar** gives access to major modules.
* **Admin users** see full access to:

  * Enquiry Management
  * Student Admission
  * Class Management
  * Teacher Management
  * Attendance Tracking
  * Fee Management
  * Certificate Management
* **Teachers** only see relevant options (e.g., Attendance).

---

## 🎓 The Student Journey

* A parent submits an enquiry via the **public enquiry form**.
* The admin reviews and processes the enquiry.
* If approved:

  * A new admission is created
  * The student is assigned to a class
  * Attendance tracking begins
  * Fees are managed
  * Certificates can be generated as needed

---

## 👩‍🏫 The Teacher's Role

* Teachers can:

  * View their assigned classes
  * Take attendance
  * View student information
  * Track student progress

---

## 👨‍💼 The Admin's Power

* Admins have full control over:

  * Creating and managing classes
  * Hiring and managing teachers
  * Processing admissions
  * Managing fees and certificates
  * Handling enquiries
  * Generating reports

---

## 📱 The Mobile Experience

* The entire system is **mobile responsive**.
* On mobile devices:

  * Navigation collapses into a hamburger menu
  * Tables become scrollable
  * Forms stack vertically
  * Cards expand to full width

---

## 🔐 The Security Layer

* **JWT tokens** ensure secure authentication.
* **Role-based access control**:

  * Admins access all features
  * Teachers see only their assigned classes and data

---



## License
MIT 