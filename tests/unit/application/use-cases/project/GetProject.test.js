const GetProject = require('../../../../../src/application/use-cases/project/GetProject');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetProject Use Case', () => {
  let getProject;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      findById: jest.fn(),
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

    getProject = new GetProject({
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should retrieve project successfully as owner', async () => {
    const projectId = 'project123';
    const userId = 'user123';

    const mockProject = {
      id: projectId,
      name: 'Test Project',
      ownerId: userId,
      members: [],
      visibility: 'team',
    };

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getProject.execute(projectId, userId, 'user');

    expect(result).toEqual(mockProject);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached project if available', async () => {
    const projectId = 'project123';
    const userId = 'user123';

    const mockProject = {
      id: projectId,
      ownerId: userId,
      members: [],
    };

    mockCacheService.get.mockResolvedValue(JSON.stringify(mockProject));

    const result = await getProject.execute(projectId, userId, 'user');

    expect(result).toEqual(mockProject);
    expect(mockProjectRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      getProject.execute('nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user has no access', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
      visibility: 'team',
    };

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      getProject.execute('project123', 'user123', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should allow member to access project', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: ['user123'],
      visibility: 'team',
    };

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getProject.execute('project123', 'user123', 'user');

    expect(result).toEqual(mockProject);
  });

  it('should allow anyone to access public project', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: [],
      visibility: 'public',
    };

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getProject.execute('project123', 'randomuser', 'user');

    expect(result).toEqual(mockProject);
  });

  it('should allow admin to access any project', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otheruser',
      members: [],
      visibility: 'team',
    };

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getProject.execute('project123', 'admin123', 'admin');

    expect(result).toEqual(mockProject);
  });
});
