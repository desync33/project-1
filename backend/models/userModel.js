import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

let dbConnection;

// Establish MySQL connection
export const connectDB = async () => {
  try {
    dbConnection = await mysql.createConnection(process.env.MYSQL_URI);
    console.log('Connected to MySQL database');
    return dbConnection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Get the current database connection
export const getDBConnection = () => {
  if (!dbConnection) {
    throw new Error('Database connection is not established');
  }
  return dbConnection;
};

// Create 'User' table if it doesn't exist
export const createUserTable = async (connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS User (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      isAdmin BOOLEAN DEFAULT FALSE NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  try {
    await connection.execute(query);
    console.log('User table created or already exists');
  } catch (error) {
    console.error('Error creating User table:', error.message);
  }
};

// Find all users (for User Management)
export const findAllUsers = async () => {
  const connection = getDBConnection();
  const [rows] = await connection.execute('SELECT * FROM User');
  return rows;
};

// Find a user by email
export const findUserByEmail = async (email) => {
  const connection = getDBConnection();
  const [rows] = await connection.execute(
    'SELECT * FROM User WHERE email = ?',
    [email]
  );
  return rows[0];
};

// Find a user by ID
export const findUserById = async (id) => {
  const connection = getDBConnection();
  const [rows] = await connection.execute('SELECT * FROM User WHERE id = ?', [
    id,
  ]);
  return rows[0];
};

// Create a new user
export const createUser = async ({
  name,
  email,
  password,
  isAdmin = false,
}) => {
  const connection = getDBConnection();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `
    INSERT INTO User (name, email, password, isAdmin)
    VALUES (?, ?, ?, ?);
  `;
  const [result] = await connection.execute(query, [
    name,
    email,
    hashedPassword,
    isAdmin,
  ]);
  return { id: result.insertId, name, email, isAdmin };
};

// Delete a user by ID
export const deleteUserById = async (id) => {
  const connection = getDBConnection();
  const [result] = await connection.execute('DELETE FROM User WHERE id = ?', [
    id,
  ]);
  return result.affectedRows > 0; // Returns true if deletion was successful
};

// Update a user by ID
export const updateUserById = async (id, updatedFields) => {
  const connection = getDBConnection();
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updatedFields)) {
    if (key === 'password') {
      // Hash the password if it's being updated
      fields.push(`${key} = ?`);
      values.push(bcrypt.hashSync(value, 10));
    } else {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  values.push(id);

  const query = `
    UPDATE User 
    SET ${fields.join(', ')} 
    WHERE id = ?
  `;
  const [result] = await connection.execute(query, values);
  return result.affectedRows > 0; // Returns true if update was successful
};

// Authenticate user (optional helper method for login)
export const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return null;
};
