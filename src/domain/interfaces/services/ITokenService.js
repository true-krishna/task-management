/**
 * Token Service Interface
 */
class ITokenService {
  async generateAccessToken(_userId, _role) {
    throw new Error('Method not implemented');
  }

  async generateRefreshToken(_userId) {
    throw new Error('Method not implemented');
  }

  async verifyAccessToken(_token) {
    throw new Error('Method not implemented');
  }

  async verifyRefreshToken(_token) {
    throw new Error('Method not implemented');
  }

  async decodeToken(_token) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITokenService;
