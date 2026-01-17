const WinstonLogger = require('../../../../src/infrastructure/logging/WinstonLogger');

describe('WinstonLogger', () => {
  let winstonLogger;
  let mockWinston;

  beforeEach(() => {
    mockWinston = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    winstonLogger = new WinstonLogger(mockWinston);
  });

  it('should log info messages', () => {
    winstonLogger.info('Test info', { userId: '123' });

    expect(mockWinston.info).toHaveBeenCalledWith('Test info', { userId: '123' });
  });

  it('should log error messages', () => {
    winstonLogger.error('Test error', { error: 'details' });

    expect(mockWinston.error).toHaveBeenCalledWith('Test error', { error: 'details' });
  });

  it('should log warn messages', () => {
    winstonLogger.warn('Test warning', { warning: 'data' });

    expect(mockWinston.warn).toHaveBeenCalledWith('Test warning', { warning: 'data' });
  });

  it('should log debug messages', () => {
    winstonLogger.debug('Test debug', { debug: 'info' });

    expect(mockWinston.debug).toHaveBeenCalledWith('Test debug', { debug: 'info' });
  });

  it('should log http messages', () => {
    winstonLogger.http('HTTP request', { method: 'GET' });

    expect(mockWinston.info).toHaveBeenCalledWith('HTTP request', {
      method: 'GET',
      level: 'http',
    });
  });

  it('should handle empty metadata', () => {
    winstonLogger.info('Test');

    expect(mockWinston.info).toHaveBeenCalledWith('Test', {});
  });
});
