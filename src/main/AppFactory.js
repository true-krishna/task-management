/**
 * Express Application Factory
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const config = require('./config/env');

class AppFactory {
  static createApp() {
    const app = express();

    // Security Middleware
    app.use(helmet());
    app.use(cors({ origin: config.cors.origin }));

    // Body Parser & Compression
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use(compression());

    // Health Check Endpoint
    app.get('/api/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    return app;
  }
}

module.exports = AppFactory;
