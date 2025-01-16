import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { connectDB } from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const connection = await connectDB();

    try {
      const [categories] = await connection.execute(
        'SELECT DISTINCT category FROM Product'
      );
      res.send(categories.map((row) => row.category));
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).send({ message: 'Error fetching categories' });
    } finally {
      await connection.end();
    }
  })
);

productRouter.get(
  '/category/:category',
  expressAsyncHandler(async (req, res) => {
    const { category } = req.params;
    const connection = await connectDB();

    try {
      const [products] = await connection.execute(
        'SELECT * FROM Product WHERE category = ?',
        [category]
      );
      if (products.length > 0) {
        res.send(products);
      } else {
        res
          .status(404)
          .send({ message: `No products found in category: ${category}` });
      }
    } catch (error) {
      console.error('Error fetching products by category:', error.message);
      res.status(500).send({ message: 'Error fetching products by category' });
    } finally {
      await connection.end();
    }
  })
);

productRouter.get(
  '/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const { slug } = req.params;
    const connection = await connectDB();

    try {
      const [product] = await connection.execute(
        'SELECT * FROM Product WHERE slug = ?',
        [slug]
      );
      if (product.length > 0) {
        res.send(product[0]);
      } else {
        res
          .status(404)
          .send({ message: `Product with slug '${slug}' not found` });
      }
    } catch (error) {
      console.error('Error fetching product by slug:', error.message);
      res.status(500).send({ message: 'Error fetching product by slug' });
    } finally {
      await connection.end();
    }
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const connection = await connectDB();
    try {
      const [product] = await connection.execute(
        'SELECT * FROM Product WHERE id = ?',
        [id]
      );
      if (product.length > 0) {
        res.send(product[0]);
      } else {
        res.status(404).send({ message: `Product with ID '${id}' not found` });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error fetching product by ID' });
    } finally {
      await connection.end();
    }
  })
);

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
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
  })
);

export default productRouter;
