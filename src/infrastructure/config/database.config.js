/**
 * MongoDB Connection Configuration
 */
const mongoose = require('mongoose');
const config = require('../../main/config/env');

let connectionInstance = null;

class MongoDBConnection {
  static getInstance() {
    if (!connectionInstance) {
      connectionInstance = new MongoDBConnection();
    }
    return connectionInstance;
  }

  async connect(logger) {
    try {
      const uri = config.nodeEnv === 'test' ? config.mongodb.testUri : config.mongodb.uri;

      await mongoose.connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
      });

      logger.info('MongoDB connected successfully', { uri });
      return mongoose.connection;
    } catch (error) {
      logger.error('MongoDB connection failed', { error: error.message });
      throw error;
    }
  }

  async disconnect(logger) {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected successfully');
      }
    } catch (error) {
      logger.error('MongoDB disconnection failed', { error: error.message });
      throw error;
    }
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = MongoDBConnection;
