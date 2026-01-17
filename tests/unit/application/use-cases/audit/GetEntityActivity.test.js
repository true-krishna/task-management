const GetEntityActivity = require('../../../../../src/application/use-cases/audit/GetEntityActivity');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');

describe('GetEntityActivity Use Case', () => {
  let getEntityActivity;
  let mockAuditLogRepository;
  let mockProjectRepository;
  let mockTaskRepository;
  let mockLogger;

  beforeEach(() => {
    mockAuditLogRepository = {
      findByEntity: jest.fn(),
      count: jest.fn(),
    };

    mockProjectRepository = {
      findById: jest.fn(),
    };

    mockTaskRepository = {
      findById: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getEntityActivity = new GetEntityActivity({
      auditLogRepository: mockAuditLogRepository,
      projectRepository: mockProjectRepository,
      taskRepository: mockTaskRepository,
      logger: mockLogger,
    });
  });

  it('should retrieve project activity for owner', async () => {
    const userId = 'user123';
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      ownerId: userId,
      members: [],
    };

    const mockLogs = [
      { id: 'log1', entityType: 'project', entityId: projectId },
    ];

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockAuditLogRepository.findByEntity.mockResolvedValue(mockLogs);
    mockAuditLogRepository.count.mockResolvedValue(5);

    const result = await getEntityActivity.execute('project', projectId, userId, 'user');

    expect(result.logs).toEqual(mockLogs);
    expect(result.pagination.total).toBe(5);
  });

  it('should retrieve project activity for member', async () => {
    const userId = 'user123';
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      ownerId: 'owner456',
      members: [userId],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockAuditLogRepository.findByEntity.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getEntityActivity.execute('project', projectId, userId, 'user');

    expect(mockAuditLogRepository.findByEntity).toHaveBeenCalled();
  });

  it('should retrieve project activity for public project', async () => {
    const userId = 'user123';
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      ownerId: 'owner456',
      members: [],
      visibility: 'public',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockAuditLogRepository.findByEntity.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getEntityActivity.execute('project', projectId, userId, 'user');

    expect(mockAuditLogRepository.findByEntity).toHaveBeenCalled();
  });

  it('should allow admin to view any project activity', async () => {
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      ownerId: 'owner456',
      members: [],
      visibility: 'private',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockAuditLogRepository.findByEntity.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getEntityActivity.execute('project', projectId, 'admin789', 'admin');

    expect(mockAuditLogRepository.findByEntity).toHaveBeenCalled();
  });

  it('should throw NotFoundError for non-existent project', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      getEntityActivity.execute('project', 'nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when user has no access to private project', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      members: [],
      visibility: 'private',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      getEntityActivity.execute('project', 'project123', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should retrieve task activity when user has access', async () => {
    const userId = 'user123';
    const taskId = 'task123';
    const projectId = 'project123';

    const mockTask = {
      id: taskId,
      projectId,
    };

    const mockProject = {
      id: projectId,
      ownerId: userId,
      members: [],
    };

    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockAuditLogRepository.findByEntity.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getEntityActivity.execute('task', taskId, userId, 'user');

    expect(mockAuditLogRepository.findByEntity).toHaveBeenCalledWith('task', taskId, {
      limit: 50,
      skip: 0,
    });
  });

  it('should throw NotFoundError for non-existent task', async () => {
    mockTaskRepository.findById.mockResolvedValue(null);

    await expect(
      getEntityActivity.execute('task', 'nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should apply pagination options', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'user123',
      members: [],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockAuditLogRepository.findByEntity.mockResolvedValue([]);
    mockAuditLogRepository.count.mockResolvedValue(0);

    await getEntityActivity.execute('project', 'project123', 'user123', 'user', {
      limit: 25,
      skip: 10,
    });

    expect(mockAuditLogRepository.findByEntity).toHaveBeenCalledWith('project', 'project123', {
      limit: 25,
      skip: 10,
    });
  });
});
