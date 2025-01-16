import express from 'express';
import data from '../data.js';
import { connectDB } from '../models/productModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  const connection = await connectDB();

  try {
    // Clear the Product table
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

    // Clear the User table
    await connection.execute('DELETE FROM User');

    const insertUserQuery = `
      INSERT INTO User (name, email, password, isAdmin)
      VALUES (?, ?, ?, ?)
    `;

    for (const user of data.users) {
      await connection.execute(insertUserQuery, [
        user.name,
        user.email,
        user.password,
        user.isAdmin,
      ]);
    }

    res.send({ message: 'Products and Users seeded successfully' });
  } catch (error) {
    console.error('Error seeding data:', error.message);
    res.status(500).send({ message: 'Error seeding data' });
  } finally {
    await connection.end();
  }
});

export default seedRouter;
