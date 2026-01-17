const GetAllActivity = require('../../../../../src/application/use-cases/audit/GetAllActivity');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetAllActivity Use Case', () => {
  let getAllActivity;
  let mockAuditLogRepository;
  let mockLogger;

  beforeEach(() => {
    mockAuditLogRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getAllActivity = new GetAllActivity({
      auditLogRepository: mockAuditLogRepository,
      logger: mockLogger,
    });
  });

  it('should retrieve all activity for admin', async () => {
    const mockLogs = [
      { id: 'log1', action: 'create', entityType: 'project' },
      { id: 'log2', action: 'update', entityType: 'task' },
    ];

    mockAuditLogRepository.findAll.mockResolvedValue(mockLogs);
    mockAuditLogRepository.count.mockResolvedValue(50);

    const result = await getAllActivity.execute('admin', {
      limit: 10,
      skip: 0,
    });

    expect(result.logs).toEqual(mockLogs);
    expect(result.pagination).toEqual({
      total: 50,
      limit: 10,
      skip: 0,
      hasMore: true,
    });
  });

  it('should throw AuthorizationError for non-admin users', async () => {
    await expect(
      getAllActivity.execute('user', {})
    ).rejects.toThrow(AuthorizationError);
  });

  it('should apply filters correctly', async () => {
    const mockLogs = [
      { id: 'log1', action: 'create', entityType: 'project' },
    ];

    mockAuditLogRepository.findAll.mockResolvedValue(mockLogs);
    mockAuditLogRepository.count.mockResolvedValue(1);

    await getAllActivity.execute('admin', {
      entityType: 'project',
      action: 'create',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });

    expect(mockAuditLogRepository.findAll).toHaveBeenCalledWith({
      limit: 100,
      skip: 0,
      entityType: 'project',
      action: 'create',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
  });

  it('should use default pagination values', async () => {
    mockAuditLogRepository.findAll.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getAllActivity.execute('admin');

    expect(mockAuditLogRepository.findAll).toHaveBeenCalledWith({
      limit: 100,
      skip: 0,
      entityType: null,
      action: null,
      startDate: null,
      endDate: null,
    });
  });

  it('should calculate hasMore correctly when no more results', async () => {
    const mockLogs = [{ id: 'log1' }];

    mockAuditLogRepository.findAll.mockResolvedValue(mockLogs);
    mockAuditLogRepository.count.mockResolvedValue(1);

    const result = await getAllActivity.execute('admin', {
      limit: 10,
      skip: 0,
    });

    expect(result.pagination.hasMore).toBe(false);
  });
});
