const LogActivity = require('../../../../../src/application/use-cases/audit/LogActivity');

describe('LogActivity Use Case', () => {
  let logActivity;
  let mockAuditLogRepository;
  let mockLogger;

  beforeEach(() => {
    mockAuditLogRepository = {
      create: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    logActivity = new LogActivity({
      auditLogRepository: mockAuditLogRepository,
      logger: mockLogger,
    });
  });

  it('should create audit log successfully with all fields', async () => {
    const logData = {
      entityType: 'project',
      entityId: 'project123',
      action: 'create',
      userId: 'user123',
      changes: { name: 'New Project' },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    };

    const mockAuditLog = {
      id: 'log123',
      ...logData,
    };

    mockAuditLogRepository.create.mockResolvedValue(mockAuditLog);

    const result = await logActivity.execute(logData);

    expect(result).toEqual(mockAuditLog);
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(logData);
  });

  it('should create audit log with minimal fields', async () => {
    const logData = {
      entityType: 'task',
      entityId: 'task123',
      action: 'update',
      userId: 'user123',
    };

    const mockAuditLog = {
      id: 'log123',
      ...logData,
      changes: {},
      ipAddress: null,
      userAgent: null,
    };

    mockAuditLogRepository.create.mockResolvedValue(mockAuditLog);

    const result = await logActivity.execute(logData);

    expect(result.id).toBe('log123');
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
      ...logData,
      changes: {},
      ipAddress: null,
      userAgent: null,
    });
  });

  it('should handle errors and rethrow', async () => {
    const logData = {
      entityType: 'project',
      entityId: 'project123',
      action: 'delete',
      userId: 'user123',
    };

    const error = new Error('Database error');
    mockAuditLogRepository.create.mockRejectedValue(error);

    await expect(logActivity.execute(logData)).rejects.toThrow('Database error');
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
