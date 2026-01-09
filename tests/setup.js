/**
 * Test Setup and Configuration
 */
const mongoose = require('mongoose');
const redis = require('redis');

// Set test environment
process.env.NODE_ENV = 'test';

// Jest timeout
jest.setTimeout(10000);

// Mock console methods in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Cleanup after all tests
afterAll(async () => {
  // Close mongoose connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
});
