const GetTaskDistribution = require('../../../../../src/application/use-cases/dashboard/GetTaskDistribution');

describe('GetTaskDistribution Use Case', () => {
  let getTaskDistribution;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      getProjectStatistics: jest.fn(),
    };

    mockProjectRepository = {
      findAll: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getTaskDistribution = new GetTaskDistribution({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should get task distribution successfully', async () => {
    const userId = 'user123';
    const mockProjects = [
      { id: 'project1', ownerId: userId },
      { id: 'project2', members: [userId] },
    ];

    const mockStats = {
      byStatus: {
        not_started: 10,
        in_progress: 5,
        completed: 15,
      },
    };

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue(mockProjects);
    mockTaskRepository.getProjectStatistics.mockResolvedValue(mockStats);

    const result = await getTaskDistribution.execute(userId, 'user');

    expect(result).toBeDefined();
    expect(result.total).toBeDefined();
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached distribution if available', async () => {
    const cachedData = JSON.stringify({
      byStatus: [
        { status: 'not_started', count: 5, percentage: 50 },
        { status: 'in_progress', count: 3, percentage: 30 },
        { status: 'completed', count: 2, percentage: 20 },
      ],
      total: 10,
    });

    mockCacheService.get.mockResolvedValue(cachedData);

    const result = await getTaskDistribution.execute('user123', 'user');

    expect(result.total).toBe(10);
    expect(mockProjectRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return empty distribution for user with no projects', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    const result = await getTaskDistribution.execute('user123', 'user');

    expect(result.total).toBe(0);
    expect(result.byStatus).toHaveLength(3);
  });

  it('should get all projects for admin users', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    await getTaskDistribution.execute('admin123', 'admin');

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith({});
  });
});
