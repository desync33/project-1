import express from 'express';
import { connectDB } from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const connection = await connectDB();

  try {
    const [products] = await connection.execute('SELECT * FROM Product');
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send({ message: 'Error fetching products' });
  } finally {
    await connection.end();
  }
});

productRouter.get('/slug/:slug', async (req, res) => {
  const connection = await connectDB();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM Product WHERE slug = ?',
      [req.params.slug]
    );
    const product = rows[0];

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error('Error fetching product by slug:', error.message);
    res.status(500).send({ message: 'Error fetching product' });
  } finally {
    await connection.end();
  }
});

productRouter.get('/:id', async (req, res) => {
  const connection = await connectDB();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM Product WHERE id = ?',
      [req.params.id]
    );
    const product = rows[0];

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error.message);
    res.status(500).send({ message: 'Error fetching product' });
  } finally {
    await connection.end();
  }
});

export default productRouter;
