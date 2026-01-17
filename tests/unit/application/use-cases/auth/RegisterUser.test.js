const RegisterUser = require('../../../../../src/application/use-cases/auth/RegisterUser');
const ValidationError = require('../../../../../src/domain/errors/ValidationError');
const ConflictError = require('../../../../../src/domain/errors/ConflictError');

describe('RegisterUser Use Case', () => {
  let registerUser;
  let mockUserRepository;
  let mockPasswordService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      emailExists: jest.fn(),
      create: jest.fn(),
    };

    mockPasswordService = {
      validatePasswordStrength: jest.fn(),
      hashPassword: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    registerUser = new RegisterUser({
      userRepository: mockUserRepository,
      passwordService: mockPasswordService,
      cacheService: { set: jest.fn() },
      logger: mockLogger,
    });
  });

  it('should register user successfully', async () => {
    const userData = {
      email: 'newuser@test.com',
      password: 'StrongPassword123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    const mockUser = {
      id: 'user123',
      ...userData,
      password: 'hashedpassword',
      role: 'user',
      isActive: true,
      createdAt: new Date(),
    };

    mockUserRepository.emailExists.mockResolvedValue(false);
    mockPasswordService.validatePasswordStrength.mockReturnValue({ isValid: true });
    mockPasswordService.hashPassword.mockResolvedValue('hashedpassword');
    mockUserRepository.create.mockResolvedValue(mockUser);

    const result = await registerUser.execute(userData);

    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
    expect(result.password).toBeUndefined(); // Password should not be returned
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(userData.password);
    expect(mockUserRepository.create).toHaveBeenCalled();
  });

  it('should throw ConflictError if email already exists', async () => {
    mockUserRepository.emailExists.mockResolvedValue(true);
    mockPasswordService.validatePasswordStrength.mockReturnValue({ isValid: true });

    await expect(
      registerUser.execute({
        email: 'existing@test.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      })
    ).rejects.toThrow(ConflictError);
  });

  it('should throw ValidationError for weak password', async () => {
    mockUserRepository.emailExists.mockResolvedValue(false);
    mockPasswordService.validatePasswordStrength.mockReturnValue({
      isValid: false,
      errors: ['Password is too weak'],
    });

    await expect(
      registerUser.execute({
        email: 'user@test.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for missing required fields', async () => {
    await expect(
      registerUser.execute({
        email: 'user@test.com',
        password: 'Password123!',
        // Missing firstName and lastName
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid email', async () => {
    await expect(
      registerUser.execute({
        email: '', // Empty email
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      })
    ).rejects.toThrow(ValidationError);
  });
});
