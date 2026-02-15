# Student Portal - Capstone Project

A comprehensive web application for student management built with Node.js, Express.js, and SQLite. This project demonstrates secure user authentication, database integration, and a responsive user interface.

## 📋 Project Overview

The Student Portal is a full-stack web application designed to help students manage their academic information securely. It implements modern security practices including password hashing, email validation, and session management.

### ✨ Key Features

- **User Authentication**
  - Secure signup with password hashing (bcryptjs)
  - Email validation and duplicate prevention
  - POST method for secure data transmission
  - Session management for user login

- **User Dashboard**
  - Personalized welcome message
  - Quick overview of academic information
  - Access to personal and academic data

- **Profile Management**
  - View and edit academic information
  - Update enrollment number, department, semester, and CGPA
  - Secure user data management

- **Responsive Design**
  - Mobile-friendly UI
  - Clean and professional interface
  - Accessibility-first approach

## 🏗️ Project Structure

```
401Project/
├── app.js                    # Main Express application
├── package.json               # Project dependencies
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── database.db               # SQLite database (created on first run)
│
├── config/
│   └── database.js           # Database configuration and initialization
│
├── models/
│   └── User.js               # User model with database methods
│
├── middleware/
│   └── auth.js               # Authentication middleware and utilities
│
├── routes/
│   ├── auth.js               # Authentication routes (signup, login, logout)
│   └── dashboard.js          # Dashboard routes
│
├── views/                    # EJS templates
│   ├── index.ejs             # Home page
│   ├── login.ejs             # Login page
│   ├── signup.ejs            # Signup page
│   ├── dashboard.ejs         # Dashboard page
│   ├── profile.ejs           # Profile management page
│   ├── error.ejs             # Error page
│   └── partials/
│       ├── header.ejs        # Navigation header
│       └── footer.ejs        # Footer
│
└── public/
    └── styles.css            # Global CSS styles
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: EJS templates, HTML5, CSS3
- **Security**: bcryptjs (password hashing), express-session
- **Validation**: validator.js
- **Development**: nodemon

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "dotenv": "^16.0.3",
  "bcryptjs": "^2.4.3",
  "sqlite3": "^5.1.6",
  "express-session": "^1.17.3",
  "body-parser": "^1.20.2",
  "validator": "^13.9.0"
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Step 1: Clone the Repository
```bash
git clone <your-github-repo-url>
cd 401Project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Edit the `.env` file:
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_key_change_in_production
DB_PATH=./database.db
```

### Step 4: Start the Application
```bash
npm start
# or for development with auto-reload
npm run dev
```

The application will be running at `http://localhost:3000`

## 📋 Key Implementation Details

### 1. **Password Hashing** (Signup)
Passwords are hashed using bcryptjs before storage:
```javascript
const hashedPassword = await hashPassword(password);
await User.create(firstname, lastname, email, hashedPassword);
```

### 2. **Email Validation & Duplicate Prevention**
```javascript
if (!validateEmail(email)) {
  return res.status(400).render('signup', { error: 'Invalid email' });
}

const existingUser = await User.findByEmail(email);
if (existingUser) {
  return res.status(400).render('signup', { error: 'Email already registered' });
}
```

### 3. **POST Method for Authentication**
- Signup: `POST /auth/signup`
- Login: `POST /auth/login`

### 4. **Session Management**
Sessions are configured with:
- HTTP-only cookies for XSS protection
- Secure flag for HTTPS (production)
- 24-hour session expiration

### 5. **Password Requirements**
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 number

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  enrollmentNo TEXT UNIQUE,
  department TEXT,
  semester INTEGER,
  cgpa REAL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Student Profiles Table
```sql
CREATE TABLE student_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL UNIQUE,
  bio TEXT,
  avatar TEXT,
  phone TEXT,
  address TEXT,
  dob TEXT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseCode TEXT NOT NULL UNIQUE,
  courseName TEXT NOT NULL,
  credits INTEGER,
  professor TEXT,
  semester INTEGER,
  description TEXT
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  grade TEXT,
  enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE
);
```

## 🔐 Security Measures

1. **Password Hashing**: bcryptjs with salt rounds
2. **Email Validation**: Using validator.js
3. **Session Management**: HTTP-only cookies, secure flags
4. **Duplicate Email Prevention**: UNIQUE constraint in database + application-level validation
5. **Error Messages**: Generic error messages to prevent information disclosure
6. **SQL Injection Prevention**: Parameterized queries with bindings

## 📱 UI/UX Features

- **Responsive Design**: Works on all device sizes (mobile, tablet, desktop)
- **Modern Styling**: Clean, professional color scheme
- **User Feedback**: Alerts and notifications for all actions
- **Navigation**: Easy-to-use navigation bar
- **Form Validation**: Client and server-side validation
- **Loading States**: Visual feedback for user actions

## 🧪 Testing the Application

### Default Test Credentials (after signup)
1. **Create a new account** via the signup page
2. **Login** with your registered email and password
3. **Update profile** in the profile section
4. **View dashboard** with your information
5. **Logout** securely

### Test Cases
- ✅ Signup with valid credentials
- ✅ Signup validation (email format, password strength)
- ✅ Duplicate email prevention
- ✅ Login with correct credentials
- ✅ Login with incorrect credentials
- ✅ Session validation
- ✅ Logout functionality
- ✅ Protected routes (unauthorized access)

## 📝 Routes

### Authentication Routes
- `GET /auth/signup` - Signup form
- `POST /auth/signup` - Handle signup
- `GET /auth/login` - Login form
- `POST /auth/login` - Handle login
- `GET /auth/logout` - Handle logout

### Dashboard Routes
- `GET /dashboard` - Dashboard page
- `GET /dashboard/profile` - Profile management page
- `POST /dashboard/update` - Update user profile

### Main Routes
- `GET /` - Home page

## 🚀 Deployment

### Using Node.js on Platform (e.g., Heroku, Render, Railway)

1. **Create a production-ready environment file**
2. **Update NODE_ENV to production**
3. **Use strong SESSION_SECRET**
4. **Enable HTTPS**
5. **Set secure flags for cookies**

## 📚 Learning Outcomes

By completing this project, students will understand:

1. **Node.js Fundamentals**
   - Event-driven architecture
   - Package management with npm
   - Module system (ES6 imports)

2. **Express.js Development**
   - Routing and middleware
   - Request/response handling
   - Session management

3. **Database Integration**
   - SQL queries and relationships
   - Data persistence
   - Foreign key constraints

4. **Security**
   - Password hashing algorithms
   - Input validation
   - Session security

5. **Web Development**
   - HTTP methods (GET, POST)
   - Form handling
   - REST principles

## 📖 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [EJS Templating](https://ejs.co/)

## 👨‍💻 Author

**Your Name** - Student ID: [Your ID]

## 📄 License

This project is licensed under the ISC License - see included LICENSE file for details.

## ✅ Submission Checklist

- [x] GitHub repository with complete source code
- [x] README.md with project documentation
- [x] All required modules (Login, Signup, Dashboard)
- [x] Password hashing implementation
- [x] Email duplicate prevention
- [x] POST methods for authentication
- [x] Responsive UI design
- [x] .gitignore and .env files
- [ ] Project Explanation Video (5+ minutes on YouTube)
- [ ] Node.js Interview Questions Video (on YouTube)

## 📞 Support

For questions or issues, please:
1. Check existing documentation
2. Review the code comments
3. Test step by step
4. Create a GitHub issue with detailed description

---

**Last Updated**: February 14, 2026
