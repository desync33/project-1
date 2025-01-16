import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URI);
    //console.log('Connected to the MySQL database');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export const createProductTable = async (connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS Product (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      slug VARCHAR(255) NOT NULL UNIQUE,
      image VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      countInStock INT NOT NULL,
      rating DECIMAL(2, 1) NOT NULL,
      numReviews INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  try {
    await connection.execute(query);
    console.log('Product table created or already exists');
  } catch (err) {
    console.error('Error creating table:', err.message);
  }
};
