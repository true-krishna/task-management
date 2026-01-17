const GetAllProjects = require('../../../../../src/application/use-cases/project/GetAllProjects');

describe('GetAllProjects Use Case', () => {
  let getAllProjects;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
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

    getAllProjects = new GetAllProjects({
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should retrieve all projects for admin', async () => {
    const mockProjects = [
      { id: 'project1', name: 'Project 1', ownerId: 'user1' },
      { id: 'project2', name: 'Project 2', ownerId: 'user2' },
    ];

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue(mockProjects);

    const result = await getAllProjects.execute('admin123', 'admin');

    expect(result.projects).toHaveLength(2);
    expect(mockProjectRepository.findAll).toHaveBeenCalledWith({}, expect.any(Object));
  });

  it('should return cached projects if available', async () => {
    const cachedData = JSON.stringify({
      projects: [{ id: 'project1', name: 'Cached' }],
      pagination: { page: 1, limit: 50, total: 1 },
    });

    mockCacheService.get.mockResolvedValue(cachedData);

    const result = await getAllProjects.execute('user123', 'user');

    expect(result.projects).toHaveLength(1);
    expect(mockProjectRepository.findAll).not.toHaveBeenCalled();
  });

  it('should filter by status', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    await getAllProjects.execute('admin123', 'admin', { status: 'active' });

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith(
      { status: 'active' },
      expect.any(Object)
    );
  });

  it('should filter by visibility', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    await getAllProjects.execute('admin123', 'admin', { visibility: 'public' });

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith(
      { visibility: 'public' },
      expect.any(Object)
    );
  });

  it('should support pagination', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    await getAllProjects.execute('admin123', 'admin', { page: 2, limit: 10 });

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith(
      {},
      { page: 2, limit: 10 }
    );
  });
});
