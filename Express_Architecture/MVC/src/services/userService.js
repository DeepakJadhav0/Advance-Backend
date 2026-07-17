import createUserRepository from '../models/User.js';

export default function createUserService(userRepository) {
  return {
    // ----- READ -----
    async getAllUsers() {
      return userRepository.findAll();
    },

    async getUserById(id) {
      const user = userRepository.findById(id);
      if (!user) throw new Error('User not found');
      return user;
    },

    // ----- CREATE -----
    async createUser(userData) {
      if (!userData.name || !userData.email) {
        throw new Error('Name and email are required');
      }
      if (!this.isValidEmail(userData.email)) {
        throw new Error('Invalid email format');
      }
      return userRepository.create(userData);
    },

    // ----- UPDATE -----
    async updateUser(id, userData) {
      const existing = userRepository.findById(id);
      if (!existing) throw new Error('User not found');
      if (userData.email && !this.isValidEmail(userData.email)) {
        throw new Error('Invalid email format');
      }
      return userRepository.update(id, userData);
    },

    // ----- DELETE -----
    async deleteUser(id) {
      const existing = userRepository.findById(id);
      if (!existing) throw new Error('User not found');
      return userRepository.delete(id);
    },

    // ----- Helper -----
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  };
}
