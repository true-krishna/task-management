const RefreshToken = require('../../../../../src/domain/entities/RefreshToken');

describe('RefreshToken Entity', () => {
  let validTokenData;

  beforeEach(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    validTokenData = {
      id: 'token123',
      userId: 'user123',
      token: 'refresh_token_value',
      expiresAt: futureDate,
      isRevoked: false,
      createdAt: new Date(),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    };
  });

  it('should create refresh token with all properties', () => {
    const token = new RefreshToken(validTokenData);

    expect(token.id).toBe('token123');
    expect(token.userId).toBe('user123');
    expect(token.token).toBe('refresh_token_value');
    expect(token.isRevoked).toBe(false);
  });

  it('should have default values', () => {
    const token = new RefreshToken({
      id: 'token123',
      userId: 'user123',
      token: 'value',
      expiresAt: new Date(),
    });

    expect(token.isRevoked).toBe(false);
    expect(token.createdAt).toBeInstanceOf(Date);
    expect(token.ipAddress).toBeNull();
    expect(token.userAgent).toBeNull();
  });

  describe('isExpired', () => {
    it('should return false for non-expired token', () => {
      const token = new RefreshToken(validTokenData);

      expect(token.isExpired()).toBe(false);
    });

    it('should return true for expired token', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const token = new RefreshToken({
        ...validTokenData,
        expiresAt: pastDate,
      });

      expect(token.isExpired()).toBe(true);
    });
  });

  describe('isValid', () => {
    it('should return true for valid token', () => {
      const token = new RefreshToken(validTokenData);

      expect(token.isValid()).toBe(true);
    });

    it('should return false if token is revoked', () => {
      const token = new RefreshToken({
        ...validTokenData,
        isRevoked: true,
      });

      expect(token.isValid()).toBe(false);
    });

    it('should return false if token is expired', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const token = new RefreshToken({
        ...validTokenData,
        expiresAt: pastDate,
      });

      expect(token.isValid()).toBe(false);
    });

    it('should return false if token is both revoked and expired', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const token = new RefreshToken({
        ...validTokenData,
        isRevoked: true,
        expiresAt: pastDate,
      });

      expect(token.isValid()).toBe(false);
    });
  });

  describe('revoke', () => {
    it('should revoke the token', () => {
      const token = new RefreshToken(validTokenData);

      expect(token.isRevoked).toBe(false);

      token.revoke();

      expect(token.isRevoked).toBe(true);
    });

    it('should make token invalid after revocation', () => {
      const token = new RefreshToken(validTokenData);

      expect(token.isValid()).toBe(true);

      token.revoke();

      expect(token.isValid()).toBe(false);
    });
  });
});
