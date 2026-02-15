# 🚀 Quick Start Guide

Get your Student Portal application up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 14+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Git installed (optional but recommended)

## Installation Steps

### Step 1: Install Dependencies
```bash
cd 401Project
npm install
```

This will install all required packages:
- express - Web framework
- sqlite3 - Database
- bcryptjs - Password hashing
- express-session - Session management
- ejs - Template engine
- And more...

**Estimated time: 2-3 minutes**

### Step 2: Verify Installation
```bash
npm list
```

You should see all dependencies listed without errors.

### Step 3: Start the Application
```bash
npm start
```

You should see:
```
Connected to SQLite database
Users table created/exists
...
Database initialized successfully
Server running on http://localhost:3000
```

### Step 4: Open in Browser

Visit: **http://localhost:3000**

✅ Server is running!

## 🧪 Test the Application

### Create a New Account
1. Click "Sign Up"
2. Enter details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Password123
   - Confirm: Password123
3. Click "Create Account"

### Login
1. Click "Login"
2. Enter your email: john@example.com
3. Enter password: Password123
4. Click "Login"

### View Dashboard
You should see your personalized dashboard with your information.

### Update Profile
1. Click "Profile" in navigation
2. Update your academic information:
   - Enrollment No: EN2024001
   - Department: Computer Science
   - Semester: 4
   - CGPA: 8.5
3. Click "Update Profile"

### Logout
Click "Logout" to end your session.

## 🔍 Project Structure Overview

```
401Project/
├── app.js                    # Main application entry point
├── package.json              # Dependencies and scripts
├── .env                      # Configuration (create this)
├── .gitignore                # Git ignore rules
├── database.db               # SQLite database (created on first run)
│
├── config/
│   └── database.js           # Database connection and initialization
│
├── models/
│   └── User.js               # User data model and queries
│
├── routes/
│   ├── auth.js               # Authentication routes
│   └── dashboard.js          # Dashboard routes
│
├── middleware/
│   └── auth.js               # Authentication middleware and helpers
│
├── views/                    # HTML templates (EJS)
│   ├── index.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── dashboard.ejs
│   ├── profile.ejs
│   ├── error.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
│
└── public/
    └── styles.css            # CSS styling
```

## 📚 Important Files to Review

### 1. `app.js` - Application Setup
The main application file. Shows:
- Express configuration
- Middleware setup
- Session management
- Route definitions

### 2. `routes/auth.js` - Authentication Logic
Implements:
- Signup validation
- Password hashing
- Email duplicate check
- Login authentication

### 3. `middleware/auth.js` - Security Functions
Contains:
- Password validation
- Email validation
- Authentication middleware
- Password hashing utilities

## 🔑 Key Features Demonstrated

| Feature | File | Key Point |
|---------|------|-----------|
| Password Hashing | middleware/auth.js | Uses bcryptjs with salt |
| Email Validation | middleware/auth.js | Validates format and uniqueness |
| Database | config/database.js | SQLite with proper schema |
| Authentication | routes/auth.js | Session-based with POST methods |
| Protected Routes | routes/dashboard.js | Middleware checks authentication |
| Responsive UI | public/styles.css | Mobile-first design |

## ⚙️ Configuration

### .env File
Create a `.env` file with:
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_key_change_in_production
DB_PATH=./database.db
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

Or change PORT in `.env`: `PORT=3001`

### Database Issues

**Reset database:**
```bash
# Delete database file
rm database.db
# Or on Windows
del database.db

# Restart server - it will recreate
npm start
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

## 📖 Next Steps

1. **Customize the Application**
   - Change styling in `public/styles.css`
   - Modify forms in `views/*.ejs`
   - Add new routes in `routes/`

2. **Add More Features**
   - Course management
   - Grade tracking
   - Attendance system
   - Notification system

3. **Deploy to Production**
   - See DEPLOYMENT.md for detailed instructions
   - Use Heroku, Render, or AWS

4. **Create Video Submission**
   - Project explanation video (5+ min)
   - Node.js interview questions video
   - Upload to YouTube
   - Share links in submission

## 📝 Common Terminal Commands

```bash
# Start development server
npm start

# Start with auto-reload (requires nodemon)
npm run dev

# Install a package
npm install package-name

# Install dev dependency
npm install -D package-name

# View installed packages
npm list

# Update all packages
npm update

# Remove package
npm uninstall package-name

# Run all tests
npm test

# Clear npm cache
npm cache clean --force
```

## 🎯 Development Checklist

- [ ] Application starts without errors
- [ ] Can create a new account
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Cannot create duplicate email
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Dashboard displays user info
- [ ] Can update profile
- [ ] Logout clears session
- [ ] UI looks good on mobile
- [ ] All links work correctly

## 💡 Tips for Success

1. **Version Control**: Use Git to track changes
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Test Thoroughly**: Try different scenarios
   - Valid inputs
   - Invalid inputs
   - Edge cases

3. **Read Error Messages**: They tell you what went wrong

4. **Check Console**: Browser console shows JavaScript errors

5. **Use Browser DevTools**: F12 to debug

## 📞 Getting Help

1. **Check README.md** - Comprehensive project documentation
2. **Review NODE_JS_INTERVIEW_GUIDE.md** - Concepts explanation
3. **Check code comments** - Most sections are commented
4. **Google the error** - Most issues have solutions online
5. **Review video tutorials** - Express.js setup tutorials

## ✅ You're All Set!

Your Student Portal application is ready for:
- ✅ Development and testing
- ✅ Feature enhancement
- ✅ Deployment to production
- ✅ Video demonstration
- ✅ GitHub submission

**Next:** Create your video presentations and submit!

---

**Happy coding! 🎉**
