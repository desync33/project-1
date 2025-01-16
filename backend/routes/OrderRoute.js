import express from 'express';
import { connectDB, createOrder } from '../models/OrderModel.js';

const orderRouter = express.Router();

// Route to create an order
orderRouter.post('/', async (req, res) => {
  const { totalPrice, shippingAddress, products } = req.body;

  if (
    !totalPrice ||
    !shippingAddress ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return res.status(400).send({ message: 'Invalid order data' });
  }

  try {
    const userId = 3; // Example: Admin user ID
    const order = await createOrder({
      userId,
      totalPrice,
      shippingAddress,
      products,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).send({ message: 'Error creating order: ' + error.message });
  }
});

// Route to fetch all orders
orderRouter.get('/all', async (req, res) => {
  try {
    const connection = await connectDB();
    const [orders] = await connection.execute('SELECT * FROM `Order`');
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching orders: ' + error.message });
  }
});

// Route to fetch dashboard data
orderRouter.get('/dashboard', async (req, res) => {
  try {
    const connection = await connectDB();

    // Fetch total users
    const [[users]] = await connection.execute(
      'SELECT COUNT(*) as totalUsers FROM User'
    );

    // Fetch total orders
    const [[orders]] = await connection.execute(
      'SELECT COUNT(*) as totalOrders FROM `Order`'
    );

    // Fetch total revenue
    const [[revenue]] = await connection.execute(
      'SELECT COALESCE(SUM(totalPrice), 0) as totalRevenue FROM `Order`'
    );

    res.json({
      totalUsers: users.totalUsers,
      totalOrders: orders.totalOrders,
      totalRevenue: parseFloat(revenue.totalRevenue),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching dashboard data: ' + error.message });
  }
});

// Route to place an order
orderRouter.post('/place', async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).send({ message: 'Order ID is required' });
  }

  const connection = await connectDB();

  try {
    // Begin the transaction
    await connection.beginTransaction();

    // Step 1: Get the products and quantities for the order
    const [orderItems] = await connection.execute(
      'SELECT productId, quantity FROM OrderProduct WHERE orderId = ?',
      [orderId]
    );

    if (orderItems.length === 0) {
      return res.status(404).json({ message: 'Order items not found' });
    }

    // Step 2: Update Product table to reduce stock
    for (const { productId, quantity } of orderItems) {
      // Check if the product exists and has sufficient stock
      const [[product]] = await connection.execute(
        'SELECT countInStock FROM Product WHERE id = ?',
        [productId]
      );

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${productId} not found` });
      }

      if (product.countInStock < quantity) {
        // Rollback if there's insufficient stock
        await connection.rollback();
        return res.status(400).json({
          message: `Not enough stock for product with ID: ${productId}`,
        });
      }

      // Reduce the stock in Product table
      await connection.execute(
        'UPDATE Product SET countInStock = countInStock - ? WHERE id = ?',
        [quantity, productId]
      );
    }

    // Commit the transaction
    await connection.commit();

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Error placing order: ' + error.message });
  } finally {
    await connection.end(); // Close the connection
  }
});

// Route to delete an order
orderRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectDB();
    const [result] = await connection.execute(
      'DELETE FROM `Order` WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order: ' + error.message });
  }
});

export default orderRouter;
