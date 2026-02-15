import db from '../config/database.js';

export const User = {
  create: (firstname, lastname, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
      db.run(sql, [firstname, lastname, email, hashedPassword], function(err) {
        if (err) {
          reject({
            message: err.message.includes('UNIQUE constraint failed') 
              ? 'Email already exists' 
              : 'Error creating user',
            code: err.code
          });
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, firstname, lastname, email, enrollmentNo, department, semester, cgpa, createdAt FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  updateProfile: (id, enrollmentNo, department, semester, cgpa) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE users SET enrollmentNo = ?, department = ?, semester = ?, cgpa = ? WHERE id = ?';
      db.run(sql, [enrollmentNo, department, semester, cgpa, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  getPassword: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, password FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
};

export default User;
