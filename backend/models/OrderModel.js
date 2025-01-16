import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

let dbConnection;

// Database connection
export const connectDB = async () => {
  if (!dbConnection) {
    dbConnection = await mysql.createConnection(process.env.MYSQL_URI);
    console.log('Connected to MySQL database');
  }
  return dbConnection;
};

// Create tables
export const createOrderTable = async (connection) => {
  const orderTableQuery = `
    CREATE TABLE IF NOT EXISTS \`Order\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      totalPrice DECIMAL(10, 2) NOT NULL,
      paidAt TIMESTAMP NULL,
      shippingAddress JSON NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  const orderProductTableQuery = `
    CREATE TABLE IF NOT EXISTS OrderProduct (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT NOT NULL,
      productId INT NOT NULL,
      quantity INT NOT NULL,
      FOREIGN KEY (orderId) REFERENCES \`Order\`(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
    );
  `;

  try {
    await connection.execute(orderTableQuery);
    await connection.execute(orderProductTableQuery);
    console.log('Order and OrderProduct tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error.message);
    throw error;
  }
};

// Create order function
export const createOrder = async ({
  userId,
  totalPrice,
  shippingAddress,
  products,
}) => {
  const connection = await connectDB();
  try {
    await connection.beginTransaction();

    // Insert into Order table
    const [orderResult] = await connection.execute(
      `INSERT INTO \`Order\` (userId, totalPrice, shippingAddress, paidAt) VALUES (?, ?, ?, ?)`,
      [userId, totalPrice, JSON.stringify(shippingAddress), null]
    );

    const orderId = orderResult.insertId;

    // Insert products into OrderProduct table
    for (const product of products) {
      if (!product.productId || !product.quantity) {
        throw new Error(
          'Invalid product data: productId and quantity are required.'
        );
      }

      await connection.execute(
        `INSERT INTO OrderProduct (orderId, productId, quantity) VALUES (?, ?, ?)`,
        [orderId, product.productId, product.quantity]
      );
    }

    await connection.commit();

    return {
      id: orderId,
      userId,
      totalPrice,
      shippingAddress,
      products,
      createdAt: new Date(),
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error.message);
    throw new Error('Order creation failed: ' + error.message);
  }
};
