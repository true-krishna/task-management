/**
 * RefreshToken Entity
 * Represents a refresh token in the system
 */
class RefreshToken {
  constructor({
    id,
    userId,
    token,
    expiresAt,
    isRevoked = false,
    createdAt = new Date(),
    ipAddress = null,
    userAgent = null,
  }) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.expiresAt = expiresAt;
    this.isRevoked = isRevoked;
    this.createdAt = createdAt;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }

  /**
   * Check if token is expired
   */
  isExpired() {
    return new Date() > this.expiresAt;
  }

  /**
   * Check if token is valid
   */
  isValid() {
    return !this.isRevoked && !this.isExpired();
  }

  /**
   * Revoke token
   */
  revoke() {
    this.isRevoked = true;
  }
}

module.exports = RefreshToken;
