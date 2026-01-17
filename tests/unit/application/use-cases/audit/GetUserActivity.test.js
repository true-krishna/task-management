const GetUserActivity = require('../../../../../src/application/use-cases/audit/GetUserActivity');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetUserActivity Use Case', () => {
  let getUserActivity;
  let mockAuditLogRepository;
  let mockLogger;

  beforeEach(() => {
    mockAuditLogRepository = {
      findByUser: jest.fn(),
      count: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getUserActivity = new GetUserActivity({
      auditLogRepository: mockAuditLogRepository,
      logger: mockLogger,
    });
  });

  it('should allow users to view their own activity', async () => {
    const userId = 'user123';
    const mockLogs = [
      { id: 'log1', userId, action: 'create' },
      { id: 'log2', userId, action: 'update' },
    ];

    mockAuditLogRepository.findByUser.mockResolvedValue(mockLogs);
    mockAuditLogRepository.count.mockResolvedValue(10);

    const result = await getUserActivity.execute(userId, userId, 'user', {
      limit: 20,
      skip: 0,
    });

    expect(result.logs).toEqual(mockLogs);
    expect(result.pagination).toEqual({
      total: 10,
      limit: 20,
      skip: 0,
      hasMore: false,
    });
  });

  it('should allow admins to view any user activity', async () => {
    const targetUserId = 'user123';
    const adminId = 'admin456';
    const mockLogs = [{ id: 'log1', userId: targetUserId }];

    mockAuditLogRepository.findByUser.mockResolvedValue(mockLogs);
    mockAuditLogRepository.count.mockResolvedValue(1);

    const result = await getUserActivity.execute(targetUserId, adminId, 'admin');

    expect(result.logs).toEqual(mockLogs);
    expect(mockAuditLogRepository.findByUser).toHaveBeenCalledWith(targetUserId, {
      limit: 50,
      skip: 0,
      entityType: null,
    });
  });

  it('should throw AuthorizationError when user tries to view another user activity', async () => {
    await expect(
      getUserActivity.execute('user123', 'user456', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should apply entityType filter', async () => {
    const userId = 'user123';
    mockAuditLogRepository.findByUser.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getUserActivity.execute(userId, userId, 'user', {
      entityType: 'project',
    });

    expect(mockAuditLogRepository.findByUser).toHaveBeenCalledWith(userId, {
      limit: 50,
      skip: 0,
      entityType: 'project',
    });
  });

  it('should use default options when not provided', async () => {
    const userId = 'user123';
    mockAuditLogRepository.findByUser.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getUserActivity.execute(userId, userId, 'user');

    expect(mockAuditLogRepository.findByUser).toHaveBeenCalledWith(userId, {
      limit: 50,
      skip: 0,
      entityType: null,
    });
  });
});
