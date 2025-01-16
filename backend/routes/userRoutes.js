import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
  createUser,
  deleteUserById,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUserById,
} from '../models/userModel.js';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

// User Sign-In Route
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: 'Email and password are required' });
      return;
    }

    const user = await findUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  })
);

// User Sign-Up Route
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .send({ message: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).send({ message: 'Email is already in use' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    if (newUser) {
      res.status(201).send({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser),
      });
    } else {
      res.status(500).send({ message: 'Failed to create user' });
    }
  })
);

// Get All Users - For User Management
userRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await findAllUsers();
      res.send(users);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching users' });
    }
  })
);

// Delete a User
userRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await findUserById(req.params.id);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      if (user.isAdmin) {
        return res.status(403).send({ message: 'Cannot delete an admin user' });
      }

      const success = await deleteUserById(req.params.id);
      if (success) {
        res.send({ message: 'User deleted successfully' });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error deleting user' });
    }
  })
);

// Update User Information (Admin Update)
userRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { name, email, isAdmin, password } = req.body;

    try {
      const user = await findUserById(req.params.id);
      if (user) {
        const updatedUser = await updateUserById(req.params.id, {
          name: name || user.name,
          email: email || user.email,
          isAdmin: isAdmin ?? user.isAdmin,
          password: password ? bcrypt.hashSync(password, 8) : user.password,
        });
        res.send({ message: 'User updated successfully', user: updatedUser });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error updating user' });
    }
  })
);

export default userRouter;
