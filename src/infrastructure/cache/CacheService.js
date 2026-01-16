/**
 * Cache Service Implementation using Redis
 */
const ICacheService = require('../../domain/interfaces/services/ICacheService');
const config = require('../../main/config/env');

class CacheService extends ICacheService {
  constructor(redisClient, logger) {
    super();
    this.redis = redisClient;
    this.logger = logger;
    this.enabled = config.redis.enabled;
  }

  async get(key) {
    if (!this.enabled) return null;

    try {
      const value = await this.redis.get(key);
      if (value) {
        this.logger.debug('Cache hit', { key });
        return value;
      }
      this.logger.debug('Cache miss', { key });
      return null;
    } catch (error) {
      this.logger.error('Cache get error', { error: error.message, key });
      return null;
    }
  }

  async set(key, value, ttl = config.redis.ttlDefault) {
    if (!this.enabled) return;

    try {
      await this.redis.setEx(key, ttl, value);
      this.logger.debug('Cache set', { key, ttl });
    } catch (error) {
      this.logger.error('Cache set error', { error: error.message, key });
    }
  }

  async del(key) {
    if (!this.enabled) return;

    try {
      await this.redis.del(key);
      this.logger.debug('Cache deleted', { key });
    } catch (error) {
      this.logger.error('Cache delete error', { error: error.message, key });
    }
  }

  async delPattern(pattern) {
    if (!this.enabled) return;

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
        this.logger.debug('Cache pattern deleted', { pattern, count: keys.length });
      }
    } catch (error) {
      this.logger.error('Cache delete pattern error', { error: error.message, pattern });
    }
  }

  async exists(key) {
    if (!this.enabled) return false;

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error('Cache exists error', { error: error.message, key });
      return false;
    }
  }

  async ttl(key) {
    if (!this.enabled) return -2;

    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error('Cache ttl error', { error: error.message, key });
      return -2;
    }
  }

  async flush() {
    if (!this.enabled) return;

    try {
      await this.redis.flushDb();
      this.logger.info('Cache flushed');
    } catch (error) {
      this.logger.error('Cache flush error', { error: error.message });
    }
  }
}

module.exports = CacheService;
