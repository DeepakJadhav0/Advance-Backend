import createUserService from '../services/userService.js';
import createUserRepository from '../models/User.js';

// Create instances
const userRepository = createUserRepository();
const userService = createUserService(userRepository);

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (
      error.message === 'Name and email are required' ||
      error.message === 'Invalid email format'
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      parseInt(req.params.id),
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    if (
      error.message === 'User not found' ||
      error.message === 'Invalid email format'
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(parseInt(req.params.id));
    if (result) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
