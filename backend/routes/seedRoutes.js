import express from 'express';
import data from '../data.js';
import { connectDB } from '../models/productModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  const connection = await connectDB();

  try {
    await connection.execute('DELETE FROM Product');

    const insertProductQuery = `
      INSERT INTO Product (name, slug, image, brand, category, description, price, countInStock, rating, numReviews)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const product of data.products) {
      await connection.execute(insertProductQuery, [
        product.name,
        product.slug,
        product.image,
        product.brand,
        product.category,
        product.description,
        product.price,
        product.countInStock,
        product.rating,
        product.numReviews,
      ]);
    }

    res.send({ message: 'Products seeded successfully' });
  } catch (error) {
    console.error('Error seeding products:', error.message);
    res.status(500).send({ message: 'Error seeding products' });
  } finally {
    await connection.end();
  }
});

export default seedRouter;
