/**
 * Refresh Token Repository Interface
 */
class IRefreshTokenRepository {
  async findById(_id) {
    throw new Error('Method not implemented');
  }

  async findByToken(_token) {
    throw new Error('Method not implemented');
  }

  async create(_refreshToken) {
    throw new Error('Method not implemented');
  }

  async revoke(_id) {
    throw new Error('Method not implemented');
  }

  async revokeByUserId(_userId) {
    throw new Error('Method not implemented');
  }

  async delete(_id) {
    throw new Error('Method not implemented');
  }

  async findValidTokensByUserId(_userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = IRefreshTokenRepository;
