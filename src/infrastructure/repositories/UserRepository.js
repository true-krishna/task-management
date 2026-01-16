/**
 * User Repository Implementation
 */
const User = require('../../domain/entities/User');
const UserModel = require('../database/mongoose/models/UserModel');

class UserRepository {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Create a new user
   */
  async create(userData) {
    try {
      const userDoc = new UserModel(userData);
      const savedUser = await userDoc.save();
      
      this.logger.info('User created successfully', { userId: savedUser._id });
      
      return this._mapToEntity(savedUser);
    } catch (error) {
      this.logger.error('Error creating user', { error: error.message });
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user ? this._mapToEntity(user) : null;
    } catch (error) {
      this.logger.error('Error finding user by ID', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      return user ? this._mapToEntity(user) : null;
    } catch (error) {
      this.logger.error('Error finding user by email', { email, error: error.message });
      throw error;
    }
  }

  /**
   * Find all users
   */
  async findAll({ isActive = null, role = null } = {}) {
    try {
      const query = {};
      
      if (isActive !== null) {
        query.isActive = isActive;
      }
      
      if (role) {
        query.role = role;
      }
      
      const users = await UserModel.find(query).sort({ createdAt: -1 });
      return users.map((user) => this._mapToEntity(user));
    } catch (error) {
      this.logger.error('Error finding all users', { error: error.message });
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(userId, updateData) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return null;
      }
      
      this.logger.info('User updated successfully', { userId });
      
      return this._mapToEntity(user);
    } catch (error) {
      this.logger.error('Error updating user', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Delete user (soft delete by setting isActive to false)
   */
  async delete(userId) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { isActive: false } },
        { new: true }
      );
      
      if (!user) {
        return false;
      }
      
      this.logger.info('User deactivated successfully', { userId });
      
      return true;
    } catch (error) {
      this.logger.error('Error deleting user', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Update last login time
   */
  async updateLastLogin(userId) {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        $set: { lastLoginAt: new Date() },
      });
      
      this.logger.debug('User last login updated', { userId });
    } catch (error) {
      this.logger.error('Error updating last login', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    try {
      const count = await UserModel.countDocuments({ email: email.toLowerCase() });
      return count > 0;
    } catch (error) {
      this.logger.error('Error checking email existence', { email, error: error.message });
      throw error;
    }
  }

  /**
   * Map Mongoose document to User entity
   */
  _mapToEntity(userDoc) {
    return new User({
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      avatar: userDoc.avatar,
      role: userDoc.role,
      isActive: userDoc.isActive,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      lastLoginAt: userDoc.lastLoginAt,
    });
  }
}

module.exports = UserRepository;
