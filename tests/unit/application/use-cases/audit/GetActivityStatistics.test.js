const GetActivityStatistics = require('../../../../../src/application/use-cases/audit/GetActivityStatistics');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetActivityStatistics Use Case', () => {
  let getActivityStatistics;
  let mockAuditLogRepository;
  let mockLogger;

  beforeEach(() => {
    mockAuditLogRepository = {
      getStatistics: jest.fn(),
      count: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getActivityStatistics = new GetActivityStatistics({
      auditLogRepository: mockAuditLogRepository,
      logger: mockLogger,
    });
  });

  it('should retrieve activity statistics for admin', async () => {
    const mockStats = [
      { action: 'create', count: 50 },
      { action: 'update', count: 30 },
      { action: 'delete', count: 20 },
    ];

    mockAuditLogRepository.getStatistics.mockResolvedValue(mockStats);
    mockAuditLogRepository.count.mockResolvedValue(100);

    const result = await getActivityStatistics.execute('admin');

    expect(result.totalLogs).toBe(100);
    expect(result.byAction).toHaveLength(3);
    expect(result.byAction[0]).toEqual({
      action: 'create',
      count: 50,
      percentage: 50,
    });
  });

  it('should throw AuthorizationError for non-admin users', async () => {
    await expect(
      getActivityStatistics.execute('user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should apply date filters', async () => {
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';

    mockAuditLogRepository.getStatistics.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    const result = await getActivityStatistics.execute('admin', {
      startDate,
      endDate,
    });

    expect(mockAuditLogRepository.getStatistics).toHaveBeenCalledWith({
      startDate,
      endDate,
    });
    expect(result.dateRange).toEqual({
      startDate,
      endDate,
    });
  });

  it('should handle empty statistics', async () => {
    mockAuditLogRepository.getStatistics.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    const result = await getActivityStatistics.execute('admin');

    expect(result.totalLogs).toBe(0);
    expect(result.byAction).toHaveLength(0);
  });

  it('should calculate percentages correctly', async () => {
    const mockStats = [
      { action: 'create', count: 75 },
      { action: 'update', count: 25 },
    ];

    mockAuditLogRepository.getStatistics.mockResolvedValue(mockStats);
    mockAuditLogRepository.count.mockResolvedValue(100);

    const result = await getActivityStatistics.execute('admin');

    expect(result.byAction[0].percentage).toBe(75);
    expect(result.byAction[1].percentage).toBe(25);
  });

  it('should handle percentage rounding', async () => {
    const mockStats = [
      { action: 'create', count: 33 },
      { action: 'update', count: 33 },
      { action: 'delete', count: 34 },
    ];

    mockAuditLogRepository.getStatistics.mockResolvedValue(mockStats);
    mockAuditLogRepository.count.mockResolvedValue(100);

    const result = await getActivityStatistics.execute('admin');

    expect(result.byAction[0].percentage).toBe(33);
    expect(result.byAction[1].percentage).toBe(33);
    expect(result.byAction[2].percentage).toBe(34);
  });
});
