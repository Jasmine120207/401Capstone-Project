# Architecture & Technical Documentation

Detailed technical documentation of the Student Portal Application.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────┐
│                    CLIENT LAYER                 │
│  (Browser - HTML, CSS, JavaScript)              │
│                                                 │
│  ├─ index.ejs (Home Page)                       │
│  ├─ login.ejs (Login Form)                      │
│  ├─ signup.ejs (Signup Form)                    │
│  ├─ dashboard.ejs (Dashboard)                   │
│  └─ profile.ejs (Profile Management)            │
└──────────────────┬──────────────────────────────┘
                   │ HTTP Requests
                   ▼
┌─────────────────────────────────────────────────┐
│               EXPRESS.JS SERVER LAYER           │
│                                                 │
│  ├─ app.js (Main Application)                   │
│  ├─ routes/auth.js (Auth Routes)                │
│  ├─ routes/dashboard.js (Dashboard Routes)      │
│  ├─ middleware/auth.js (Auth Logic)             │
│  └─ config/database.js (DB Connection)          │
└──────────────────┬──────────────────────────────┘
                   │ SQL Queries
                   ▼
┌─────────────────────────────────────────────────┐
│            SQLite3 DATABASE LAYER               │
│                                                 │
│  ├─ users (User Accounts)                       │
│  ├─ student_profiles (Extended User Info)       │
│  ├─ courses (Course Details)                    │
│  └─ enrollments (User-Course Relationships)     │
└─────────────────────────────────────────────────┘
```

## 🔄 Request-Response Flow

### Signup Flow
```
User enters credentials
        ↓
Form validation (Client-side)
        ↓
POST /auth/signup
        ↓
Server validates input
        ↓
Check email doesn't exist
        ↓
Hash password (bcryptjs)
        ↓
Store user in database
        ↓
Send success response
        ↓
User redirected/shown message
```

### Login Flow
```
User enters email and password
        ↓
Form validation
        ↓
POST /auth/login
        ↓
Find user by email
        ↓
Compare passwords (bcryptjs)
        ↓
Create session
        ↓
Redirect to dashboard
        ↓
Session verified on each request
```

### Dashboard Access Flow
```
User accesses /dashboard
        ↓
Check session exists
        ↓
Session valid?
    ├─ YES: Load user data → Render dashboard
    └─ NO: Redirect to login
```

## 🗄️ Database Schema in Detail

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,      -- Unique identifier
  firstname TEXT NOT NULL,                    -- User's first name
  lastname TEXT NOT NULL,                     -- User's last name
  email TEXT NOT NULL UNIQUE,                 -- Email (unique)
  password TEXT NOT NULL,                     -- Hashed password
  enrollmentNo TEXT UNIQUE,                   -- Student enrollment number
  department TEXT,                            -- Department/faculty
  semester INTEGER,                           -- Current semester
  cgpa REAL,                                  -- Cumulative GPA
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP -- Account creation time
);
```

### Student Profiles Table (Future Enhancement)
```sql
CREATE TABLE student_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL UNIQUE,
  bio TEXT,                                   -- Student biography
  avatar TEXT,                                -- Avatar image URL
  phone TEXT,                                 -- Contact number
  address TEXT,                               -- Address
  dob TEXT,                                   -- Date of birth
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseCode TEXT NOT NULL UNIQUE,           -- Course code (e.g., CS101)
  courseName TEXT NOT NULL,                  -- Full course name
  credits INTEGER,                           -- Course credits
  professor TEXT,                            -- Instructor name
  semester INTEGER,                          -- Semester offered
  description TEXT                           -- Course description
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  grade TEXT,                                -- Final grade
  enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE
);
```

## 🔐 Security Architecture

### Password Security
```
Plain Password: "MyPassword123"
         ↓
bcryptjs.genSalt(10) → Generates random salt
         ↓
bcryptjs.hash(password, salt) → Hashes password
         ↓
Stored in DB: "$2a$10$..." (59 characters)
         ↓
On Login: bcryptjs.compare(input, stored) → Boolean
```

### Session Security
```javascript
Session Configuration:
├─ secret: Randomly generated key (never hardcode)
├─ cookie.secure: true (HTTPS only in production)
├─ cookie.httpOnly: true (Not accessible via JavaScript)
├─ cookie.maxAge: 24 hours (1 day)
└─ resave: false (Don't save unmodified sessions)
```

### Input Validation Layers
```
Client-side Validation (HTML5 attributes)
         ↓
Form Submit Handler (JavaScript)
         ↓
Server-side Validation
    ├─ Email format validation
    ├─ Password strength validation
    ├─ Duplicate email checking
    └─ SQL parameter binding
         ↓
Database Storage (Hashed & Validated)
```

## 🔗 Middleware Flow

```
request
  ├─ bodyParser.urlencoded()     → Parse form data
  ├─ bodyParser.json()            → Parse JSON
  ├─ express.static()             → Serve static files
  ├─ session()                    → Manage sessions
  ├─ Custom user middleware       → Add user to response
  └─ route handler               → Handle specific request
         ↓
response
```

## 📝 Routing Architecture

### Route Types

#### Public Routes
```javascript
GET  /              → Homepage
GET  /auth/signup   → Signup form
POST /auth/signup   → Handle signup
GET  /auth/login    → Login form
POST /auth/login    → Handle login
```

#### Protected Routes (Requires Authentication)
```javascript
GET  /dashboard          → Dashboard display
GET  /dashboard/profile  → Profile page
POST /dashboard/update   → Update profile
GET  /auth/logout        → Logout
```

#### Error Handling
```javascript
GET  *              → 404 Not Found (Catch-all)
```

## 🎨 Frontend Architecture

### CSS Organization
```css
Variables & Root Colors
         ↓
Basic Element Styles (*, html, body)
         ↓
Layout Components (navbar, container)
         ↓
Common Elements (buttons, forms, cards)
         ↓
Feature Styles (alerts, grid, tables)
         ↓
Responsive Media Queries
```

### EJS Template Hierarchy
```
header.ejs (Navigation)
    ↓
Each Page Specific
    ├─ index.ejs
    ├─ login.ejs
    ├─ signup.ejs
    ├─ dashboard.ejs
    ├─ profile.ejs
    └─ error.ejs
    ↓
footer.ejs (Footer)
```

## 🚀 Performance Optimizations

### Current Implementation
1. **Static File Caching**: CSS/JS served with caching headers
2. **Session Management**: Memory-efficient session handling
3. **Database Queries**: All queries use parameter binding (prevents SQL injection)
4. **Middleware Optimization**: Only run necessary middleware

### Future Enhancements
1. **Database Indexing**: Add indexes on frequently queried columns
2. **Query Optimization**: Use JOIN for related data
3. **Caching Layer**: Implement Redis for session/data caching
4. **Compression**: Enable gzip compression for responses
5. **Lazy Loading**: Load non-critical resources on demand

## 🧪 Testing Strategy

### Unit Tests (to implement)
```javascript
// Test Models
├─ User.create() → Creates user with hashed password
├─ User.findByEmail() → Finds existing user
├─ User.getPassword() → Returns correct hashed password
└─ User.updateProfile() → Updates profile successfully

// Test Middleware
├─ validateEmail() → Validates email format
├─ validatePassword() → Checks password requirements
├─ isAuthenticated() → Verifies session
└─ hashPassword() → Hashes password correctly
```

### Integration Tests (to implement)
```javascript
// Test Authentication Flow
├─ Signup with valid data → User created
├─ Signup with duplicate email → Error returned
├─ Signup with weak password → Error returned
├─ Login with correct credentials → Session created
└─ Login with wrong password → Error returned

// Test Protected Routes
├─ Access without session → Redirected to login
├─ Access with session → Page loaded
└─ Session expiry → User logged out
```

## 📊 Data Flow Diagrams

### User Registration Data Flow
```
[Signup Form] → validates → hashes → stores → [Database]
      ↓
   [User Input]
   ├─ First Name
   ├─ Last Name
   ├─ Email
   └─ Password
           ↓
    [Server Validates]
    ├─ Email format
    ├─ Password strength
    └─ Email uniqueness
           ↓
    [bcryptjs Hashes]
    └─ salt + password → hash
           ↓
    [Database Stores]
    └─ INSERT users
```

### Profile Update Data Flow
```
[Profile Form] → validates → updates → [Database]
      ↓
   [User Input]
   ├─ Enrollment No
   ├─ Department
   ├─ Semester
   └─ CGPA
           ↓
    [Server Validates]
    ├─ Required fields present
    └─ Data type validation
           ↓
    [Database Updates]
    └─ UPDATE users WHERE id = ?
```

## 🔄 State Management

### Session State
```javascript
req.session = {
  userId: 1,           // User's database ID
  email: 'user@example.com'  // User's email
}

// Persisted in memory (can be replaced with Redis)
// Sent to client as cookie
// Verified on each request
```

### Error State Management
```javascript
// Pass error to template
res.render('login', { error: 'Invalid credentials' })

// Display error to user
<% if (typeof error !== 'undefined' && error) { %>
  <div class="alert alert-error"><%= error %></div>
<% } %>
```

## 🔗 API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | No | Home page |
| GET | /auth/signup | No | Signup form |
| POST | /auth/signup | No | Create account |
| GET | /auth/login | No | Login form |
| POST | /auth/login | No | Authenticate user |
| GET | /dashboard | Yes | User dashboard |
| GET | /dashboard/profile | Yes | Profile page |
| POST | /dashboard/update | Yes | Update profile |
| GET | /auth/logout | Yes | End session |

## 📦 Module Dependencies

### Direct Dependencies
- **express**: Web framework
- **sqlite3**: Database driver
- **bcryptjs**: Password hashing
- **express-session**: Session management
- **body-parser**: Request parsing
- **validator**: Input validation
- **dotenv**: Environment variables
- **ejs**: Template engine

### Indirect Dependencies
- Automatically installed sub-dependencies

## 🎯 Code Quality Metrics

### Current Implementation Follows:
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ Separation of Concerns (Models, Routes, Middleware)
- ✅ Secure by Default (Password hashing, validation)
- ✅ Error Handling (Try-catch blocks, validation)
- ✅ Comments and Documentation

---

**This architecture is scalable and can be extended with additional features.**
