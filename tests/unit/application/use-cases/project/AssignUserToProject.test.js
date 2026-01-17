const AssignUserToProject = require('../../../../../src/application/use-cases/project/AssignUserToProject');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('AssignUserToProject Use Case', () => {
  let assignUserToProject;
  let mockProjectRepository;
  let mockUserRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      findById: jest.fn(),
      addMember: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
    };

    mockCacheService = {
      del: jest.fn(),
      delPattern: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    assignUserToProject = new AssignUserToProject({
      projectRepository: mockProjectRepository,
      userRepository: mockUserRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should assign user to project successfully', async () => {
    const projectId = 'project123';
    const userIdToAdd = 'user456';
    const requestingUserId = 'owner123';

    const mockProject = {
      id: projectId,
      ownerId: requestingUserId,
      members: [],
    };

    const mockUser = {
      id: userIdToAdd,
      email: 'user@test.com',
      isActive: true,
    };

    const mockUpdatedProject = {
      ...mockProject,
      members: [userIdToAdd],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockProjectRepository.addMember.mockResolvedValue(mockUpdatedProject);

    const result = await assignUserToProject.execute(projectId, userIdToAdd, requestingUserId, 'user');

    expect(result.members).toContain(userIdToAdd);
    expect(mockProjectRepository.addMember).toHaveBeenCalledWith(projectId, userIdToAdd);
  });

  it('should allow admin to assign user to any project', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otherowner',
      members: [],
    };

    const mockUser = {
      id: 'user456',
      isActive: true,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockProjectRepository.addMember.mockResolvedValue(mockProject);

    await assignUserToProject.execute('project123', 'user456', 'admin123', 'admin');

    expect(mockProjectRepository.addMember).toHaveBeenCalled();
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      assignUserToProject.execute('nonexistent', 'user456', 'owner123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError if user is not owner or admin', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'otherowner',
      members: [],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      assignUserToProject.execute('project123', 'user456', 'randomuser', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should throw NotFoundError if user to add does not exist', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: [],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      assignUserToProject.execute('project123', 'nonexistent', 'owner123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError if user is inactive', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: [],
    };

    const mockUser = {
      id: 'user456',
      isActive: false,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      assignUserToProject.execute('project123', 'user456', 'owner123', 'user')
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError if user is already a member', async () => {
    const userIdToAdd = 'user456';
    const mockProject = {
      id: 'project123',
      ownerId: 'owner123',
      members: [userIdToAdd],
    };

    const mockUser = {
      id: userIdToAdd,
      isActive: true,
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue(mockUser);

    await expect(
      assignUserToProject.execute('project123', userIdToAdd, 'owner123', 'user')
    ).rejects.toThrow(ValidationError);
  });
});
