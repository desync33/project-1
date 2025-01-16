import dotenv from 'dotenv';
import express from 'express';
import { createOrderTable } from './models/OrderModel.js';
import { createProductTable } from './models/productModel.js';
import { connectDB, createUserTable } from './models/userModel.js';
import orderRouter from './routes/OrderRoute.js';
import productRouter from './routes/productRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware to parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL and ensure tables are created
(async () => {
  try {
    const connection = await connectDB(); // Ensure DB connection is established

    // Create required tables in database
    await createUserTable(connection);
    await createProductTable(connection);
    await createOrderTable(connection);

    console.log('Connected to MySQL and ensured tables exist');
  } catch (error) {
    console.error('Error during initialization:', error.message);
    process.exit(1); // Exit with failure if there's an issue during initialization
  }
})();

// API Routes
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Server startup
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
