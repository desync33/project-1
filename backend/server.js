import dotenv from 'dotenv';
import express from 'express';
import { connectDB, createProductTable } from './models/productModel.js';
import productRouter from './routes/productRoutes.js';
import seedRouter from './routes/seedRoutes.js';

dotenv.config();

const app = express();

connectDB()
  .then((connection) => {
    createProductTable(connection);
    console.log('Connected to MySQL and ensured Product table exists');
  })
  .catch((error) => {
    console.error('Error connecting to MySQL:', error.message);
    process.exit(1);
  });

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
