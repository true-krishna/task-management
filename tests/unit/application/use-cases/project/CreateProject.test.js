/**
 * Unit Tests for CreateProject Use Case
 */
const CreateProject = require('../../../../../src/application/use-cases/project/CreateProject');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');

describe('CreateProject Use Case', () => {
  let createProject;
  let mockProjectRepository;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    createProject = new CreateProject({
      projectRepository: mockProjectRepository,
      cacheService: { del: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should create a project successfully', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'Test Description',
      status: 'active',
      visibility: 'team',
      userId: 'user123',
    };

    const mockProject = {
      id: 'project123',
      name: projectData.name,
      description: projectData.description,
      ownerId: projectData.userId,
      visibility: projectData.visibility,
      status: 'active',
      members: [projectData.userId],
      createdBy: projectData.userId,
      modifiedBy: projectData.userId,
    };

    mockProjectRepository.create.mockResolvedValue(mockProject);

    const result = await createProject.execute(projectData);

    expect(result).toEqual(mockProject);
    expect(mockProjectRepository.create).toHaveBeenCalledWith({
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      visibility: projectData.visibility,
      ownerId: projectData.userId,
      createdBy: projectData.userId,
      modifiedBy: projectData.userId,
      members: [projectData.userId],
    });
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('should throw ValidationError for missing name', async () => {
    const projectData = {
      userId: 'user123',
      // missing name
    };

    await expect(
      createProject.execute(projectData)
    ).rejects.toThrow(ValidationError);
  });

  it('should use default values for optional fields', async () => {
    const projectData = {
      name: 'Minimal Project',
      userId: 'user123',
    };

    const mockProject = {
      id: 'project123',
      name: projectData.name,
      ownerId: projectData.userId,
      members: [projectData.userId],
      createdBy: projectData.userId,
      modifiedBy: projectData.userId,
    };

    mockProjectRepository.create.mockResolvedValue(mockProject);

    await createProject.execute(projectData);

    expect(mockProjectRepository.create).toHaveBeenCalledWith({
      name: projectData.name,
      description: undefined,
      status: undefined,
      visibility: undefined,
      ownerId: projectData.userId,
      createdBy: projectData.userId,
      modifiedBy: projectData.userId,
      members: [projectData.userId],
    });
  });
});
