const GetProjectMembers = require('../../../../../src/application/use-cases/project/GetProjectMembers');
const NotFoundError = require('../../../../../src/domain/errors/NotFoundError');
const AuthorizationError = require('../../../../../src/domain/errors/AuthorizationError');

describe('GetProjectMembers Use Case', () => {
  let getProjectMembers;
  let mockProjectRepository;
  let mockUserRepository;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      findById: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getProjectMembers = new GetProjectMembers({
      projectRepository: mockProjectRepository,
      userRepository: mockUserRepository,
      logger: mockLogger,
    });
  });

  it('should retrieve project members for owner', async () => {
    const userId = 'user123';
    const projectId = 'project123';

    const mockProject = {
      id: projectId,
      name: 'Test Project',
      ownerId: userId,
      members: ['member1', 'member2'],
      visibility: 'private',
    };

    const mockMembers = [
      { id: 'member1', email: 'mem1@test.com', firstName: 'John', lastName: 'Doe', role: 'user' },
      { id: 'member2', email: 'mem2@test.com', firstName: 'Jane', lastName: 'Smith', role: 'user' },
    ];

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockImplementation((id) => {
      return Promise.resolve(mockMembers.find(m => m.id === id));
    });

    const result = await getProjectMembers.execute(projectId, userId, 'user');

    expect(result.projectId).toBe(projectId);
    expect(result.projectName).toBe('Test Project');
    expect(result.members).toHaveLength(2);
    expect(result.members[0].email).toBe('mem1@test.com');
  });

  it('should allow admins to view any project members', async () => {
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      name: 'Test Project',
      ownerId: 'owner456',
      members: [],
      visibility: 'private',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getProjectMembers.execute(projectId, 'admin789', 'admin');

    expect(result.projectId).toBe(projectId);
    expect(result.members).toHaveLength(0);
  });

  it('should allow members to view team project members', async () => {
    const userId = 'user123';
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      name: 'Test Project',
      ownerId: 'owner456',
      members: [userId],
      visibility: 'team',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockResolvedValue({
      id: userId,
      email: 'user@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
    });

    const result = await getProjectMembers.execute(projectId, userId, 'user');

    expect(result.members).toHaveLength(1);
  });

  it('should allow anyone to view public project members', async () => {
    const projectId = 'project123';
    const mockProject = {
      id: projectId,
      name: 'Public Project',
      ownerId: 'owner456',
      members: [],
      visibility: 'public',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    const result = await getProjectMembers.execute(projectId, 'random123', 'user');

    expect(result.projectId).toBe(projectId);
  });

  it('should throw NotFoundError if project does not exist', async () => {
    mockProjectRepository.findById.mockResolvedValue(null);

    await expect(
      getProjectMembers.execute('nonexistent', 'user123', 'user')
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError for unauthorized access', async () => {
    const mockProject = {
      id: 'project123',
      ownerId: 'owner456',
      members: [],
      visibility: 'private',
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);

    await expect(
      getProjectMembers.execute('project123', 'user123', 'user')
    ).rejects.toThrow(AuthorizationError);
  });

  it('should filter out null members', async () => {
    const mockProject = {
      id: 'project123',
      name: 'Test Project',
      ownerId: 'user123',
      members: ['member1', 'deleted'],
    };

    mockProjectRepository.findById.mockResolvedValue(mockProject);
    mockUserRepository.findById.mockImplementation((id) => {
      if (id === 'member1') {
        return Promise.resolve({ id: 'member1', email: 'mem1@test.com', firstName: 'John', lastName: 'Doe', role: 'user' });
      }
      return Promise.resolve(null);
    });

    const result = await getProjectMembers.execute('project123', 'user123', 'user');

    expect(result.members).toHaveLength(1);
  });
});
