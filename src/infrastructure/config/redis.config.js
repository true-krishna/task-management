/**
 * Redis Connection Configuration
 */
const redis = require('redis');
const config = require('../../main/config/env');

let redisClient = null;

class RedisClient {
  static getInstance() {
    if (!redisClient) {
      redisClient = new RedisClient();
    }
    return redisClient;
  }

  async connect(logger) {
    try {
      if (!config.redis.enabled) {
        logger.warn('Redis cache is disabled');
        return null;
      }

      this.client = redis.createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis reconnection failed after 10 attempts');
              return new Error('Redis reconnection failed');
            }
            return Math.min(retries * 100, 3000);
          },
        },
        password: config.redis.password || undefined,
        database: config.redis.db,
      });

      this.client.on('error', (err) => {
        logger.error('Redis error', { error: err.message });
      });

      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      this.client.on('reconnecting', () => {
        logger.warn('Redis reconnecting');
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('Redis connection failed', { error: error.message });
      throw error;
    }
  }

  async disconnect(logger) {
    try {
      if (this.client) {
        await this.client.quit();
        logger.info('Redis disconnected successfully');
      }
    } catch (error) {
      logger.error('Redis disconnection failed', { error: error.message });
      throw error;
    }
  }

  getClient() {
    return this.client;
  }

  isConnected() {
    return this.client && this.client.isOpen;
  }
}

module.exports = RedisClient;
