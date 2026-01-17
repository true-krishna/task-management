const CacheService = require('../../../../src/infrastructure/cache/CacheService');

describe('CacheService', () => {
  let cacheService;
  let mockRedisClient;
  let mockLogger;

  beforeEach(() => {
    mockRedisClient = {
      get: jest.fn(),
      setEx: jest.fn(),
      del: jest.fn(),
      keys: jest.fn(),
      exists: jest.fn(),
      ttl: jest.fn(),
    };

    mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    // Create cache service with enabled = true
    cacheService = new CacheService(mockRedisClient, mockLogger);
    cacheService.enabled = true; // Override for testing
  });

  describe('get', () => {
    it('should return cached value on cache hit', async () => {
      mockRedisClient.get.mockResolvedValue('cached_value');

      const result = await cacheService.get('test_key');

      expect(result).toBe('cached_value');
      expect(mockRedisClient.get).toHaveBeenCalledWith('test_key');
      expect(mockLogger.debug).toHaveBeenCalledWith('Cache hit', { key: 'test_key' });
    });

    it('should return null on cache miss', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await cacheService.get('test_key');

      expect(result).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith('Cache miss', { key: 'test_key' });
    });

    it('should return null on error', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.get('test_key');

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should return null if cache is disabled', async () => {
      cacheService.enabled = false;

      const result = await cacheService.get('test_key');

      expect(result).toBeNull();
      expect(mockRedisClient.get).not.toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should set value with TTL', async () => {
      await cacheService.set('test_key', 'value', 300);

      expect(mockRedisClient.setEx).toHaveBeenCalledWith('test_key', 300, 'value');
      expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('should handle errors silently', async () => {
      mockRedisClient.setEx.mockRejectedValue(new Error('Redis error'));

      await cacheService.set('test_key', 'value');

      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should not set if cache is disabled', async () => {
      cacheService.enabled = false;

      await cacheService.set('test_key', 'value');

      expect(mockRedisClient.setEx).not.toHaveBeenCalled();
    });
  });

  describe('del', () => {
    it('should delete key', async () => {
      await cacheService.del('test_key');

      expect(mockRedisClient.del).toHaveBeenCalledWith('test_key');
    });

    it('should handle errors silently', async () => {
      mockRedisClient.del.mockRejectedValue(new Error('Redis error'));

      await cacheService.del('test_key');

      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should not delete if cache is disabled', async () => {
      cacheService.enabled = false;

      await cacheService.del('test_key');

      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });
  });

  describe('delPattern', () => {
    it('should delete keys matching pattern', async () => {
      mockRedisClient.keys.mockResolvedValue(['key1', 'key2']);

      await cacheService.delPattern('test:*');

      expect(mockRedisClient.keys).toHaveBeenCalledWith('test:*');
      expect(mockRedisClient.del).toHaveBeenCalledWith(['key1', 'key2']);
    });

    it('should not delete if no keys found', async () => {
      mockRedisClient.keys.mockResolvedValue([]);

      await cacheService.delPattern('test:*');

      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should handle errors silently', async () => {
      mockRedisClient.keys.mockRejectedValue(new Error('Redis error'));

      await cacheService.delPattern('test:*');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('exists', () => {
    it('should return true if key exists', async () => {
      mockRedisClient.exists.mockResolvedValue(1);

      const result = await cacheService.exists('test_key');

      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      mockRedisClient.exists.mockResolvedValue(0);

      const result = await cacheService.exists('test_key');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockRedisClient.exists.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.exists('test_key');

      expect(result).toBe(false);
    });
  });
});
