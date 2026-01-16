/**
 * Use Case: Get All Users
 * Retrieves all users from cache or database (admin only)
 */
class GetAllUsers {
  /**
   * @param {Object} dependencies
   * @param {import('../../../domain/interfaces/repositories/IUserRepository')} dependencies.userRepository
   * @param {import('../../../domain/interfaces/services/ICacheService')} dependencies.cacheService
   * @param {import('../../../domain/interfaces/services/ILogger')} dependencies.logger
   */
  constructor({ userRepository, cacheService, logger }) {
    this.userRepository = userRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   * @param {Object} [options] - Query options
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=50] - Items per page
   * @param {string} [options.role] - Filter by role
   * @param {boolean} [options.isActive] - Filter by active status
   * @returns {Promise<Object>} Users list with pagination
   */
  async execute(options = {}) {
    try {
      const { page = 1, limit = 50, role, isActive } = options;

      this.logger.debug('GetAllUsers use case executing', { page, limit, role, isActive });

      // Create cache key based on filters
      const cacheKey = `user:all:${page}:${limit}:${role || 'all'}:${isActive !== undefined ? isActive : 'all'}`;
      const cachedData = await this.cacheService.get(cacheKey);

      if (cachedData) {
        this.logger.debug('Users list found in cache');
        return JSON.parse(cachedData);
      }

      // Build filter
      const filter = {};
      if (role) filter.role = role;
      if (isActive !== undefined) filter.isActive = isActive;

      // Get users from database
      const users = await this.userRepository.findAll(filter, {
        page,
        limit,
        sort: { createdAt: -1 },
      });

      // Map to safe profile data (exclude passwords)
      const userData = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      }));

      const response = {
        users: userData,
        pagination: {
          page,
          limit,
          total: userData.length,
        },
      };

      // Cache the result (5 minutes TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(response), 300);

      this.logger.info('Users list retrieved successfully', {
        count: userData.length,
        page,
        limit,
      });

      return response;
    } catch (error) {
      this.logger.error('Error in GetAllUsers use case', {
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = GetAllUsers;
