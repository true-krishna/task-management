/**
 * User Entity
 * Represents a user in the system
 */
class User {
  constructor({
    id,
    email,
    password,
    firstName,
    lastName,
    avatar = null,
    role = 'user',
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
    lastLoginAt = null,
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatar = avatar;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
  }

  /**
   * Get user's full name
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Check if user is active
   */
  isUserActive() {
    return this.isActive;
  }
}

module.exports = User;
