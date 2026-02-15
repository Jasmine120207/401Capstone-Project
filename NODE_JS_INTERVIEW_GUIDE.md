# Node.js Interview Questions - Video Preparation Guide

This guide provides comprehensive answers to the Node.js interview questions you'll need to address in your video submission. Study these answers thoroughly and prepare your own explanations.

## Question 1: What is Node.js, and how does it differ from other server-side technologies like Apache or PHP?

### Answer Points:
- **Definition**: Node.js is a JavaScript runtime built on the V8 JavaScript engine that allows you to run JavaScript outside the browser, specifically on the server-side.

- **Key Differences**:
  - **Event-Driven & Asynchronous**: Node.js uses non-blocking I/O and event-driven architecture, making it efficient for handling multiple concurrent connections.
  - **Single-Threaded**: Unlike Apache, which spawns a new thread for each connection, Node.js uses a single-threaded event loop.
  - **Language**: PHP requires you to write code in PHP and then execute it on the server. Node.js lets you write JavaScript on both frontend and backend.
  - **Performance**: Node.js is typically faster for I/O operations compared to traditional technologies.
  - **Scalability**: Better suited for real-time, data-intensive applications.

### Example to include:
```javascript
// Node.js - Non-blocking, asynchronous
const server = http.createServer((req, res) => {
  database.query('SELECT * FROM users', (err, results) => {
    // Doesn't block - can handle other requests
    res.end(JSON.stringify(results));
  });
});

// In contrast, PHP would block waiting for the database query
```

---

## Question 2: What is a callback function in Node.js, and why are they commonly used in asynchronous programming?

### Answer Points:
- **Definition**: A callback function is a function that is passed as an argument to another function, and it's executed after a certain event or operation has been completed.

- **Why callbacks are used**:
  - Handle asynchronous operations without blocking execution
  - Execute code after I/O operations complete
  - Maintain non-blocking behavior

- **Example**:
```javascript
function readFile(filename, callback) {
  fs.readFile(filename, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

readFile('file.txt', (err, data) => {
  if (err) console.error(err);
  console.log(data);
});
```

- **Challenges** (Callback Hell):
```javascript
// Deep nesting can make code hard to read
fs.readFile('file1.txt', (err, data1) => {
  fs.readFile('file2.txt', (err, data2) => {
    fs.readFile('file3.txt', (err, data3) => {
      // Callback hell!
    });
  });
});
```

- **Modern Solutions**: Promises and async/await make asynchronous code cleaner.

---

## Question 3: What is the purpose of the package.json file in a Node.js project? Can you explain the key properties found in this file?

### Answer Points:
- **Purpose**: package.json is a manifest file that describes your Node.js project and its dependencies.

- **Key Properties**:
  - **name**: Project name (unique identifier)
  - **version**: Current version (follows semantic versioning)
  - **description**: Brief description of the project
  - **main**: Entry point of the application
  - **scripts**: Custom commands you can run (npm start, npm test)
  - **keywords**: Array of search keywords
  - **author**: Author information
  - **license**: Project license
  - **dependencies**: Production dependencies required to run the app
  - **devDependencies**: Dependencies only needed for development
  - **engines**: Specifies Node.js version requirements

### Example with explanation:
```json
{
  "name": "student-portal",
  "version": "1.0.0",
  "description": "A student management web application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## Question 4: Explain the difference between require and import statements in Node.js. When and why would you use one over the other?

### Answer Points:
- **require()** (CommonJS):
  - Traditional Node.js module system
  - Synchronous loading
  - Returns a module object
  - Widely compatible

```javascript
const express = require('express');
const User = require('./models/User');
```

- **import** (ES6 Modules):
  - Modern JavaScript standard
  - Asynchronous loading
  - More readable syntax
  - Better for static analysis and tree-shaking
  - Requires Node.js 12+ or .mjs extension

```javascript
import express from 'express';
import User from './models/User.js';
```

- **When to use each**:
  - **require**: Existing codebases, legacy projects, compatibility concerns
  - **import**: New projects, modern development, better performance

- **Important**: In this capstone project, we're using ES6 `import` syntax with `"type": "module"` in package.json.

---

## Question 5: What is middleware in the context of Express.js? Can you give an example of how you would use middleware in an Express application?

### Answer Points:
- **Definition**: Middleware are functions that have access to the request object (req), response object (res), and the next middleware function in the request-response cycle.

- **Purpose**:
  - Modify request/response objects
  - Execute code in request cycle
  - End request-response cycle
  - Call next middleware

- **Types of Middleware**:
  1. **Application-level**: Applied to entire application
  2. **Router-level**: Applied to specific routes
  3. **Built-in**: Provided by Express (express.static)
  4. **Error-handling**: Handles errors
  5. **Third-party**: External middleware

### Example from the project:
```javascript
// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files middleware
app.use(express.static('public'));

// Session middleware
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

// Custom authentication middleware
app.use((req, res, next) => {
  if (req.session.userId) {
    next(); // Continue to next middleware
  } else {
    res.redirect('/login'); // End request-response cycle
  }
});

// Route with middleware
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard');
});
```

---

## Question 6: What is RESTful API, and how can you create one using Node.js and Express.js? Explain the main HTTP methods used in RESTful APIs.

### Answer Points:
- **REST** (Representational State Transfer):
  - Architectural style for designing networked applications
  - Uses standard HTTP methods
  - Stateless communication
  - Resource-based (nouns, not verbs)

- **Main HTTP Methods**:
  - **GET**: Retrieve data
  - **POST**: Create new data
  - **PUT/PATCH**: Update existing data
  - **DELETE**: Remove data

- **Example RESTful API**:
```javascript
// Routes file - auth.js
// GET /auth/signup - Render form
router.get('/signup', (req, res) => {
  res.render('signup');
});

// POST /auth/signup - Create account (Create)
router.post('/signup', async (req, res) => {
  // Handle user creation
});

// GET /auth/login - Render form
router.get('/login', (req, res) => {
  res.render('login');
});

// POST /auth/login - Authenticate (Read)
router.post('/login', async (req, res) => {
  // Handle authentication
});

// POST /dashboard/update - Update profile (Update)
router.post('/dashboard/update', isAuthenticated, (req, res) => {
  // Handle profile update
});

// GET /auth/logout - Delete session (Delete)
router.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
```

- **RESTful Principles**:
  - Use proper HTTP methods for operations
  - Use meaningful URLs (resources, not actions)
  - Use appropriate HTTP status codes
  - Stateless architecture
  - Client-server separation

---

## Question 7: What is the purpose of the Node Package Manager (NPM), and how do you use it to manage dependencies in a Node.js project?

### Answer Points:
- **Purpose**: NPM is a package manager for Node.js that allows you to install, manage, and publish packages/libraries.

- **Key Commands**:
```bash
npm init                    # Initialize a new project
npm install <package>       # Install a package
npm install -D <package>    # Install as dev dependency
npm list                    # List installed packages
npm update                  # Update packages
npm uninstall <package>     # Remove a package
npm start                   # Run start script from package.json
npm run <script>            # Run custom script
npm search <keyword>        # Search for packages
npm publish                 # Publish your own package
```

- **Dependencies vs DevDependencies**:
  - **dependencies**: Required to run the application in production
  - **devDependencies**: Only needed during development

- **Version Management**:
  - `^`: Allows patch and minor updates (^4.18.2 → 4.19.0)
  - `~`: Allows only patch updates (~4.18.2 → 4.18.5)
  - `*`: Latest version

- **npm modules used in this project**:
  ```bash
  npm install express dotenv bcryptjs sqlite3 express-session body-parser validator
  npm install -D nodemon
  ```

---

## Question 8: Why is it important to hash passwords in a web application?

### Answer Points:
- **Security**: Prevents attackers from directly accessing passwords if database is compromised.

- **Hashing vs Encryption**:
  - **Hashing**: One-way process (cannot be reversed)
  - **Encryption**: Two-way process (can be decrypted)

- **Why Password Hashing is Critical**:
  1. **Data Breach Protection**: If database is exposed, passwords are not directly readable
  2. **Compliance**: Required by security standards (OWASP, GDPR, etc.)
  3. **Legal Requirement**: Many regulations mandate password protection
  4. **User Trust**: Shows commitment to security

- **Implementation in this project**:
```javascript
// Using bcryptjs library
import bcrypt from 'bcryptjs';

// Hashing password during signup
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate salt
  return bcrypt.hash(password, salt);    // Hash with salt
};

// Storing hashed password
const hashedPassword = await hashPassword(userPassword);
await User.create(firstname, lastname, email, hashedPassword);

// Comparing passwords during login
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  // Invalid password
}
```

- **Best Practices**:
  - Use strong algorithms (bcryptjs, Argon2)
  - Use salt with multiple rounds
  - Never store plain-text passwords
  - Never log passwords
  - Implement password requirements (length, complexity)
  - Use HTTPS to protect passwords in transit

---

## 📹 Video Recording Tips

1. **Introduction**: Start with a brief intro about yourself and the project
2. **Clear Sound**: Use a good microphone for clarity
3. **Screen Sharing**: Show code examples and explain them
4. **Pace**: Speak clearly and not too fast
5. **Examples**: Use real code from your project as examples
6. **Engagement**: Look at camera, maintain natural tone
7. **Duration**: Aim for 5-10 minutes of content
8. **Practice**: Do a test run before final recording

---

## 📚 Additional Study Resources

- [Node.js Official Documentation](https://nodejs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MDN - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [OWASP Security Guidelines](https://owasp.org/)
- [RESTful API Design](https://restfulapi.net/)

---

**Good luck with your video submission!**
