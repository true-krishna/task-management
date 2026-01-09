/**
 * Cache Service Interface
 */
class ICacheService {
  async get(_key) {
    throw new Error('Method not implemented');
  }

  async set(_key, _value, _ttl) {
    throw new Error('Method not implemented');
  }

  async del(_key) {
    throw new Error('Method not implemented');
  }

  async delPattern(_pattern) {
    throw new Error('Method not implemented');
  }

  async exists(_key) {
    throw new Error('Method not implemented');
  }

  async ttl(_key) {
    throw new Error('Method not implemented');
  }

  async flush() {
    throw new Error('Method not implemented');
  }
}

module.exports = ICacheService;
