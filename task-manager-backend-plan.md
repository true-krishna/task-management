# Task Manager Backend - Clean Architecture Plan

## 1. Project Architecture Overview

### Clean Architecture Layers

```
src/
├── domain/              # Enterprise Business Rules
│   ├── entities/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── RefreshToken.js
│   │   └── AuditLog.js
│   ├── interfaces/
│   │   ├── repositories/
│   │   │   ├── IUserRepository.js
│   │   │   ├── IProjectRepository.js
│   │   │   ├── ITaskRepository.js
│   │   │   ├── IRefreshTokenRepository.js
│   │   │   └── IAuditLogRepository.js
│   │   └── services/
│   │       ├── IAuthService.js
│   │       ├── ITokenService.js
│   │       ├── IPasswordService.js
│   │       └── ICacheService.js
│   ├── enums/
│   │   ├── UserRole.js
│   │   ├── ProjectStatus.js
│   │   ├── ProjectVisibility.js
│   │   ├── TaskStatus.js
│   │   └── TaskPriority.js
│   └── errors/
│       ├── DomainError.js
│       ├── ValidationError.js
│       ├── AuthenticationError.js
│       ├── AuthorizationError.js
│       └── NotFoundError.js
│
├── application/         # Application Business Rules
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── RegisterUser.js
│   │   │   ├── LoginUser.js
│   │   │   ├── RefreshToken.js
│   │   │   ├── LogoutUser.js
│   │   │   └── VerifyToken.js
│   │   ├── user/
│   │   │   ├── GetUserProfile.js
│   │   │   ├── UpdateUserProfile.js
│   │   │   ├── GetAllUsers.js
│   │   │   ├── UpdateUserRole.js
│   │   │   └── DeactivateUser.js
│   │   ├── project/
│   │   │   ├── CreateProject.js
│   │   │   ├── GetProject.js
│   │   │   ├── GetAllProjects.js
│   │   │   ├── UpdateProject.js
│   │   │   ├── DeleteProject.js
│   │   │   ├── UpdateProjectVisibility.js
│   │   │   ├── AssignUserToProject.js
│   │   │   ├── RemoveUserFromProject.js
│   │   │   └── GetProjectMembers.js
│   │   ├── task/
│   │   │   ├── CreateTask.js
│   │   │   ├── GetTask.js
│   │   │   ├── GetProjectTasks.js
│   │   │   ├── UpdateTask.js
│   │   │   ├── UpdateTaskStatus.js
│   │   │   ├── UpdateTaskPriority.js
│   │   │   ├── ReorderTasks.js
│   │   │   ├── AssignTask.js
│   │   │   └── DeleteTask.js
│   │   └── dashboard/
│   │       ├── GetDashboardStats.js
│   │       ├── GetTaskDistribution.js
│   │       ├── GetPriorityDistribution.js
│   │       └── GetWeeklyTrend.js
│   ├── dto/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── project/
│   │   ├── task/
│   │   └── dashboard/
│   └── interfaces/
│       └── ILogger.js
│
├── infrastructure/      # Frameworks & Drivers
│   ├── database/
│   │   ├── mongoose/
│   │   │   ├── connection.js
│   │   │   ├── schemas/
│   │   │   │   ├── UserSchema.js
│   │   │   │   ├── ProjectSchema.js
│   │   │   │   ├── TaskSchema.js
│   │   │   │   ├── RefreshTokenSchema.js
│   │   │   │   └── AuditLogSchema.js
│   │   │   └── models/
│   │   │       ├── UserModel.js
│   │   │       ├── ProjectModel.js
│   │   │       ├── TaskModel.js
│   │   │       ├── RefreshTokenModel.js
│   │   │       └── AuditLogModel.js
│   ├── cache/
│   │   ├── RedisClient.js
│   │   └── CacheService.js
│   ├── repositories/
│   │   ├── UserRepository.js
│   │   ├── ProjectRepository.js
│   │   ├── TaskRepository.js
│   │   ├── RefreshTokenRepository.js
│   │   └── AuditLogRepository.js
│   ├── security/
│   │   ├── TokenService.js
│   │   ├── PasswordService.js
│   │   └── AuthService.js
│   ├── logging/
│   │   ├── WinstonLogger.js
│   │   └── LoggerConfig.js
│   └── config/
│       ├── database.config.js
│       ├── redis.config.js
│       ├── auth.config.js
│       └── app.config.js
│
├── presentation/        # Interface Adapters
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── ProjectController.js
│   │   ├── TaskController.js
│   │   └── DashboardController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── projectAccessMiddleware.js
│   │   ├── validationMiddleware.js
│   │   ├── errorHandlerMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   ├── cacheMiddleware.js
│   │   └── requestLoggerMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── index.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── userValidators.js
│   │   ├── projectValidators.js
│   │   └── taskValidators.js
│   └── swagger/
│       ├── swagger.config.js
│       └── schemas/
│           ├── authSchemas.js
│           ├── userSchemas.js
│           ├── projectSchemas.js
│           ├── taskSchemas.js
│           └── commonSchemas.js
│
└── main/               # Composition Root
    ├── factories/
    │   ├── useCaseFactory.js
    │   ├── repositoryFactory.js
    │   ├── controllerFactory.js
    │   └── serviceFactory.js
    ├── config/
    │   └── env.js
    └── server.js

tests/
├── unit/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── integration/
│   ├── auth.test.ts
│   ├── user.test.ts
│   ├── project.test.ts
│   └── task.test.ts
└── setup.ts

logs/
├── error.log
├── combined.log
└── access.log
```

## 2. Domain Layer (Core Business Logic)

### 2.1 Entities

**User Entity**
```typescript
{
  id: string
  email: string (unique)
  password: string (hashed)
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole (admin | user)
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}
```

**Project Entity**
```typescript
{
  id: string
  name: string
  description: string
  status: ProjectStatus (planning | active | completed | archived)
  visibility: ProjectVisibility (private | team | public)
  ownerId: string (User reference)
  members: string[] (User references)
  createdAt: Date
  updatedAt: Date
  createdBy: string (User reference)
  modifiedBy: string (User reference)
}
```

**Task Entity**
```typescript
{
  id: string
  title: string
  description?: string
  projectId: string (Project reference)
  assignedTo?: string (User reference)
  status: TaskStatus (not_started | in_progress | completed)
  priority: TaskPriority (none | low | medium | high)
  order: number (for kanban positioning within status)
  dueDate?: Date
  createdBy: string (User reference)
  createdAt: Date
  updatedAt: Date
  modifiedBy: string (User reference)
}
```

**RefreshToken Entity**
```typescript
{
  id: string
  userId: string (User reference)
  token: string (hashed)
  expiresAt: Date
  isRevoked: boolean
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}
```

**AuditLog Entity** (Track creation/modification)
```typescript
{
  id: string
  entityType: string (User | Project | Task)
  entityId: string
  action: string (create | update | delete)
  userId: string (User reference)
  changes: object (before and after values)
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}
```

### 2.2 Enums

**UserRole**
- admin: Full system access
- user: Standard user access

**ProjectVisibility**
- private: Only owner can see
- team: Owner and assigned members
- public: All authenticated users

**ProjectStatus**
- planning
- active
- completed
- archived

**TaskStatus**
- not_started
- in_progress
- completed

**TaskPriority**
- none
- low
- medium
- high

### 2.3 Domain Interfaces

**Repository Interfaces**
```javascript
IUserRepository
IProjectRepository
ITaskRepository
IRefreshTokenRepository
IAuditLogRepository
```

**Service Interfaces**
```javascript
IAuthService
ITokenService
IPasswordService
ICacheService
ILogger
```

## 3. Application Layer (Use Cases)

### 3.1 Authentication Use Cases
- **RegisterUser**: Create new user account with audit logging
- **LoginUser**: Authenticate and generate tokens
- **RefreshToken**: Generate new access token using refresh token
- **LogoutUser**: Revoke refresh token
- **VerifyToken**: Validate JWT token

### 3.2 User Management Use Cases
- **GetUserProfile**: Retrieve current user details
- **UpdateUserProfile**: Update user information with audit trail
- **GetAllUsers**: List all users (admin only)
- **UpdateUserRole**: Change user role (admin only)
- **DeactivateUser**: Soft delete user (admin only)

### 3.3 Project Use Cases
- **CreateProject**: Create new project with visibility setting
- **GetProject**: Retrieve project by ID (check visibility)
- **GetAllProjects**: List projects based on visibility and user access
  - Admin: All projects
  - User: Owned projects + projects where user is member
  - Public projects visible to all authenticated users
- **UpdateProject**: Modify project details with audit logging
- **DeleteProject**: Remove project (owner or admin only)
- **UpdateProjectVisibility**: Change project visibility (owner or admin)
- **AssignUserToProject**: Add member to project
- **RemoveUserFromProject**: Remove member from project
- **GetProjectMembers**: List all project members

### 3.4 Task Use Cases
- **CreateTask**: Create new task in project with audit logging
- **GetTask**: Retrieve task by ID (check project access)
- **GetProjectTasks**: List all tasks by project ID
  - Filter tasks by project
  - Order by status and order field (kanban)
  - Check user has access to project
- **UpdateTask**: Modify task details with audit trail
- **UpdateTaskStatus**: Change task status (optimistic update)
- **UpdateTaskPriority**: Change task priority
- **ReorderTasks**: Update task order within status column (optimistic)
- **AssignTask**: Assign task to user
- **DeleteTask**: Remove task with audit logging

### 3.5 Dashboard Use Cases
- **GetDashboardStats**: Calculate task statistics for user's projects
- **GetTaskDistribution**: Get task status distribution
- **GetPriorityDistribution**: Get priority distribution
- **GetWeeklyTrend**: Calculate weekly completion trend

## 4. Infrastructure Layer

### 4.1 Database Configuration
```javascript
// MongoDB Connection with retry logic
- Connection pooling
- Mongoose configuration
- Index management
- Transaction support
```

### 4.2 Redis Cache Configuration
```javascript
// Redis Connection
- Connection with retry logic
- Error handling
- Reconnection strategy
- Connection pooling

// Cache Strategy
- TTL (Time To Live) for different data types
- Cache invalidation patterns
- Cache key naming conventions
```

### 4.3 Repository Implementations
```javascript
UserRepository implements IUserRepository
ProjectRepository implements IProjectRepository
TaskRepository implements ITaskRepository
RefreshTokenRepository implements IRefreshTokenRepository
AuditLogRepository implements IAuditLogRepository
```

### 4.4 Cache Service Implementation
```javascript
CacheService implements ICacheService
  - get(key) - Get value from cache
  - set(key, value, ttl) - Set value with TTL
  - del(key) - Delete key from cache
  - delPattern(pattern) - Delete keys matching pattern
  - exists(key) - Check if key exists
  - ttl(key) - Get remaining TTL
  - flush() - Clear all cache

// Cache Keys Convention
user:profile:{userId}
user:all (for user list)
project:{projectId}
project:user:{userId} (user's projects)
task:project:{projectId} (project tasks)
dashboard:stats:{userId}
dashboard:distribution:{userId}
```

### 4.5 Security Services
```javascript
TokenService implements ITokenService
  - generateAccessToken()
  - generateRefreshToken()
  - verifyAccessToken()
  - verifyRefreshToken()

PasswordService implements IPasswordService
  - hashPassword()
  - comparePassword()

AuthService implements IAuthService
  - authenticate()
  - authorize()
```

### 4.6 Logging Service
```javascript
WinstonLogger implements ILogger
  - info(message, meta)
  - error(message, meta)
  - warn(message, meta)
  - debug(message, meta)
  - http(message, meta)

Log Levels:
  - error: 0
  - warn: 1
  - info: 2
  - http: 3
  - debug: 4

Log Transports:
  - Console (development)
  - File (production): error.log, combined.log
  - Rotate logs daily
```

### 4.7 Mongoose Schemas & Indexes

**User Schema Indexes**
```javascript
email: unique index
role: index
isActive: index
```

**Project Schema Indexes**
```javascript
ownerId: index
members: index
visibility: index
status: index
compound: [visibility, status]
```

**Task Schema Indexes**
```javascript
projectId: index
status: index
priority: index
assignedTo: index
order: index
compound: [projectId, status, order]
compound: [projectId, priority]
```

**RefreshToken Schema Indexes**
```javascript
token: unique index
userId: index
expiresAt: index with TTL
```

**AuditLog Schema Indexes**
```javascript
entityType: index
entityId: index
userId: index
createdAt: index
compound: [entityType, entityId, createdAt]
```

## 5. Presentation Layer

### 5.1 REST API Endpoints

**Authentication Routes** (`/api/v1/auth`)
```
POST   /register          - Register new user
POST   /login             - Login user
POST   /refresh           - Refresh access token
POST   /logout            - Logout user
GET    /me                - Get current user (authenticated)
```

**User Routes** (`/api/v1/users`)
```
GET    /profile           - Get current user profile
PUT    /profile           - Update current user profile
GET    /                  - Get all users (admin only)
PUT    /:id/role          - Update user role (admin only)
DELETE /:id               - Deactivate user (admin only)
```

**Project Routes** (`/api/v1/projects`)
```
POST   /                  - Create project
GET    /                  - Get all accessible projects
GET    /:id               - Get project by ID
PUT    /:id               - Update project
DELETE /:id               - Delete project (owner/admin)
PATCH  /:id/visibility    - Update project visibility (owner/admin)
POST   /:id/members       - Assign user to project
DELETE /:id/members/:userId - Remove user from project
GET    /:id/members       - Get project members
```

**Task Routes** (`/api/v1/tasks`)
```
POST   /                  - Create task
GET    /                  - Get all tasks (with filters)
GET    /project/:projectId - Get tasks by project
GET    /:id               - Get task by ID
PUT    /:id               - Update task
PATCH  /:id/status        - Update task status
PATCH  /:id/priority      - Update task priority
PATCH  /:id/assign        - Assign task to user
PUT    /reorder           - Reorder tasks (optimistic)
DELETE /:id               - Delete task
```

**Dashboard Routes** (`/api/v1/dashboard`)
```
GET    /stats             - Get dashboard statistics
GET    /task-distribution - Get task status distribution
GET    /priority-distribution - Get priority distribution
GET    /weekly-trend      - Get weekly completion trend
```

**Audit Routes** (`/api/v1/audit`) (admin only)
```
GET    /                  - Get audit logs with filters
GET    /entity/:type/:id  - Get audit logs for specific entity
GET    /user/:userId      - Get audit logs for specific user
```

### 5.2 Middlewares

**authMiddleware**
```javascript
- Verify JWT access token
- Attach user to request object
- Handle token expiration
- Log authentication attempts
```

**roleMiddleware(allowedRoles: UserRole[])**
```javascript
- Check if user has required role
- admin: Full access
- user: Limited access
- Log authorization failures
```

**projectAccessMiddleware**
```javascript
- Verify user has access to project
- Check visibility settings:
  - private: only owner
  - team: owner + members
  - public: any authenticated user
- Log access attempts
```

**cacheMiddleware(options)**
```javascript
- Cache GET request responses
- Set custom TTL per endpoint
- Generate cache keys from request
- Invalidate cache on mutations
- Skip cache for authenticated user-specific data

Example usage:
  router.get('/projects', cacheMiddleware({ ttl: 300 }), getProjects)
```

**validationMiddleware(schema)**
```javascript
- Validate request body/params/query
- Return validation errors
- Log validation failures
```

**errorHandlerMiddleware**
```javascript
- Catch all errors
- Format error response
- Log errors with stack trace
- Handle different error types:
  - ValidationError: 400
  - AuthenticationError: 401
  - AuthorizationError: 403
  - NotFoundError: 404
  - DomainError: 422
  - Generic: 500
```

**rateLimitMiddleware**
```javascript
- Limit requests per IP/user
- Different limits for different endpoints
- Log rate limit violations
- Use Redis for distributed rate limiting
```

**requestLoggerMiddleware**
```javascript
- Log all incoming requests
- Log request method, path, IP
- Log response status and time
- Log user if authenticated
```

### 5.3 Request Validators (Joi/Zod)

**authValidators**
```javascript
registerSchema
loginSchema
refreshTokenSchema
```

**userValidators**
```javascript
updateProfileSchema
updateRoleSchema
```

**projectValidators**
```javascript
createProjectSchema
updateProjectSchema
updateVisibilitySchema
assignMemberSchema
```

**taskValidators**
```javascript
createTaskSchema
updateTaskSchema
updateStatusSchema
updatePrioritySchema
reorderTasksSchema
assignTaskSchema
```

### 5.4 Swagger Documentation

**swagger.config.js**
```javascript
OpenAPI 3.0 specification
API info, version, contact
Server configurations
Security schemes (Bearer JWT)
Global tags and descriptions
```

**API Documentation Structure**
```yaml
/api-docs - Swagger UI
/api-docs.json - OpenAPI JSON

Components:
  - securitySchemes (Bearer Token)
  - schemas (all DTOs)
  - responses (common responses)
  - parameters (common params)

Each endpoint includes:
  - Summary and description
  - Request body schema
  - Response schemas (success/error)
  - Authentication requirements
  - Tags for grouping
```

## 6. Redis Caching Strategy

### 6.1 What to Cache

**User Data**
```javascript
Key: user:profile:{userId}
TTL: 1 hour
Invalidate: On profile update, role change

Key: user:all
TTL: 5 minutes
Invalidate: On new user, user update, user deletion
```

**Project Data**
```javascript
Key: project:{projectId}
TTL: 10 minutes
Invalidate: On project update, member change

Key: project:user:{userId}
TTL: 5 minutes
Invalidate: On project create/delete, member assignment
```

**Task Data**
```javascript
Key: task:project:{projectId}
TTL: 2 minutes
Invalidate: On task create/update/delete, status change

Key: task:{taskId}
TTL: 5 minutes
Invalidate: On task update
```

**Dashboard Data**
```javascript
Key: dashboard:stats:{userId}
TTL: 5 minutes
Invalidate: On task status change, project change

Key: dashboard:distribution:{userId}
TTL: 5 minutes
Invalidate: On task status/priority change
```

### 6.2 Cache Invalidation Patterns

**Write-Through Pattern**
```javascript
1. Update database
2. Invalidate cache
3. Next read will populate cache
```

**Cache-Aside Pattern**
```javascript
1. Check cache
2. If miss, query database
3. Store in cache
4. Return result
```

**Example Cache Invalidation Flow**
```javascript
// Update Task Status
1. Update task in MongoDB
2. Delete cache keys:
   - task:{taskId}
   - task:project:{projectId}
   - dashboard:stats:{userId}
   - dashboard:distribution:{userId}
3. Return response
```

### 6.3 Cache Key Naming Convention

```javascript
// Pattern: {entity}:{action}:{identifier}

// Single entity
user:profile:{userId}
project:{projectId}
task:{taskId}

// Collections
user:all
project:user:{userId}
task:project:{projectId}

// Computed data
dashboard:stats:{userId}
dashboard:distribution:{userId}
dashboard:trend:{userId}

// Session data
session:{sessionId}
token:refresh:{tokenId}
```

## 7. Access Control Matrix

### Project Visibility & Access

| Visibility | Owner | Members | Other Users | Admin |
|------------|-------|---------|-------------|-------|
| private    | Full  | None    | None        | Full  |
| team       | Full  | Read/Write | None     | Full  |
| public     | Full  | Read/Write | Read     | Full  |

### Role-Based Access Control (RBAC)

**Admin Role**
- All user operations
- All project operations
- All task operations
- View/manage all users
- View audit logs
- Change user roles
- Access all projects regardless of visibility

**User Role**
- Own profile operations
- Create projects (become owner)
- Access projects based on visibility
- CRUD tasks in accessible projects
- View own audit trail
- Cannot change roles
- Cannot view other users' private projects

### Task Access Rules
- Task visibility follows project visibility
- Only project members can view tasks
- Only project members can create tasks
- Task assignee can update task status
- Project owner can delete any task
- Admin can access all tasks

## 8. Audit Logging Strategy

### What to Log

**User Actions**
```javascript
- User registration
- User login/logout
- Profile updates
- Role changes
```

**Project Actions**
```javascript
- Project creation
- Project updates (track field changes)
- Project deletion
- Visibility changes
- Member assignments/removals
```

**Task Actions**
```javascript
- Task creation
- Task updates (track field changes)
- Task deletion
- Status changes
- Priority changes
- Assignee changes
- Task reordering
```

### Audit Log Format
```javascript
{
  entityType: "Task",
  entityId: "task_123",
  action: "update",
  userId: "user_456",
  changes: {
    before: { status: "not_started", priority: "low" },
    after: { status: "in_progress", priority: "high" }
  },
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: "2024-01-09T10:30:00Z"
}
```

## 9. Logging Standards

### Log Levels and Usage

**Error** (Priority: 0)
```typescript
- Authentication failures
- Database connection errors
- Unhandled exceptions
- Critical business logic failures
- Third-party service failures
```

**Warn** (Priority: 1)
```typescript
- Deprecated API usage
- Rate limit warnings
- Invalid token attempts
- Permission denied attempts
- Resource not found
```

**Info** (Priority: 2)
```typescript
- User registration
- User login/logout
- Project creation
- Task creation
- Configuration loading
- Server start/stop
```

**HTTP** (Priority: 3)
```typescript
- All HTTP requests
- Response status codes
- Response times
- Request paths and methods
```

**Debug** (Priority: 4)
```typescript
- Use case execution details
- Repository query details
- Validation results
- Token generation/verification
- Development debugging
```

### Log Format
```javascript
{
  timestamp: "2024-01-09T10:30:00.123Z",
  level: "info",
  message: "User logged in successfully",
  meta: {
    userId: "user_123",
    email: "user@example.com",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0..."
  }
}
```

### Log Files
```
logs/
  ├── error.log       - Only errors
  ├── combined.log    - All logs
  └── access.log      - HTTP requests only

- Daily rotation
- Keep last 14 days
- Max file size: 20MB
- Compress old logs
```

## 10. Optimistic Updates for Kanban

### Strategy
```javascript
Client sends update request
  ↓
Backend validates and processes
  ↓
Returns updated resource
  ↓
Client syncs with server state

No websockets or real-time updates
Client is responsible for optimistic UI
Backend provides consistent data
```

### Task Reordering Endpoint
```javascript
PUT /api/v1/tasks/reorder

Request Body:
{
  taskId: "task_123",
  newStatus: "in_progress",
  newOrder: 3
}

Response:
{
  success: true,
  data: {
    task: { /* updated task */ },
    affectedTasks: [ /* other tasks with updated orders */ ]
  }
}

Backend Logic:
1. Validate user has project access
2. Update task status and order
3. Recalculate orders for other tasks in column
4. Invalidate cache (task:project:{projectId})
5. Return all affected tasks
6. Log the change in audit trail
```

## 11. Implementation Phases

### Phase 1: Foundation & Setup (Week 1)
**Tasks:**
- Initialize Node.js project with JavaScript
- Set up project structure (Clean Architecture)
- Configure MongoDB connection
- Set up Redis connection
- Set up Winston logger
- Create base domain entities
- Create repository interfaces
- Set up environment configuration
- Initialize Git repository
- Configure ESLint and Prettier

**Deliverables:**
- Project structure
- Database connections (MongoDB + Redis)
- Logger configuration
- Base entities and interfaces

---

### Phase 2: Authentication & Authorization (Week 1-2)
**Tasks:**
- Implement User entity and repository
- Create password hashing service
- Implement JWT token service
- Build authentication use cases
- Create auth controllers
- Set up auth middleware
- Implement role-based middleware
- Add audit logging for auth events
- Implement basic caching for user profiles
- Write unit tests for auth

**Deliverables:**
- Complete authentication system
- JWT token management with refresh tokens
- Role-based access control (admin/user)
- Auth endpoints with Swagger docs
- Redis caching for user data

---

### Phase 3: User Management (Week 2)
**Tasks:**
- Implement user use cases
- Create user controllers
- Add user validators
- Implement user profile endpoints
- Add role management (admin only)
- Set up audit logging for user changes
- Implement caching for user lists
- Cache invalidation on user updates
- Write unit tests for user management
- Document user endpoints in Swagger

**Deliverables:**
- User management endpoints
- Profile management
- Role management (admin)
- User API documentation
- Cached user data

---

### Phase 4: Project Management (Week 2-3)
**Tasks:**
- Implement Project entity and repository
- Create project use cases
- Build project controllers
- Implement visibility settings (private/team/public)
- Add project access middleware
- Implement member management
- Set up audit logging for projects
- Implement caching for projects
- Cache invalidation patterns for projects
- Add project validators
- Write unit and integration tests
- Document project endpoints in Swagger

**Deliverables:**
- Complete project CRUD
- Visibility settings (private/team/public)
- Member management
- Project access control
- Project caching strategy
- Project API documentation

---

### Phase 5: Task Management & Kanban (Week 3-4)
**Tasks:**
- Implement Task entity and repository
- Create task use cases
- Build task controllers
- Implement task filtering by project
- Add kanban functionality (ordering)
- Implement optimistic update for reordering
- Set up caching for project tasks
- Cache invalidation for task updates
- Add task validators
- Set up audit logging for tasks
- Write unit and integration tests
- Document task endpoints in Swagger

**Deliverables:**
- Complete task CRUD
- Task listing by project
- Kanban with optimistic updates
- Task caching with invalidation
- Task audit trail
- Task API documentation

---

### Phase 6: Dashboard & Analytics (Week 4)
**Tasks:**
- Implement dashboard use cases
- Create aggregation queries
- Build dashboard controllers
- Calculate statistics
- Implement Redis caching for dashboard data
- Set short TTL for dashboard cache
- Cache invalidation on task/project changes
- Write unit tests
- Document dashboard endpoints in Swagger

**Deliverables:**
- Dashboard statistics
- Task distribution charts
- Priority distribution
- Weekly trends
- Cached dashboard data
- Dashboard API documentation

---

### Phase 7: Audit Trail & Logging (Week 4)
**Tasks:**
- Implement AuditLog entity and repository
- Create audit endpoints (admin only)
- Add audit trail viewing
- Enhance logging throughout application
- Add request logging middleware
- Configure log rotation
- Test Redis cache performance
- Write tests for audit functionality
- Document audit endpoints in Swagger

**Deliverables:**
- Complete audit trail system
- Audit log viewing (admin)
- Comprehensive logging
- Redis monitoring
- Audit API documentation

---

### Phase 8: Testing & Documentation (Week 5)
**Tasks:**
- Write comprehensive unit tests
- Create integration tests
- Test cache hit/miss scenarios
- Add end-to-end tests
- Complete Swagger documentation
- Create API usage guide
- Add code documentation (JSDoc)
- Performance testing
- Redis cache optimization
- Security audit

**Deliverables:**
- Full test coverage (>80%)
- Cache performance metrics
- Complete API documentation
- Usage guide
- Performance benchmarks

---

### Phase 9: Deployment & DevOps (Week 5)
**Tasks:**
- Set up Docker configuration (app, MongoDB, Redis)
- Create Docker Compose for local development
- Create CI/CD pipeline
- Configure production environment
- Set up monitoring and alerts
- Redis persistence configuration
- Database backup strategy
- Deploy to production
- Load testing with cache
- Security hardening

**Deliverables:**
- Production-ready application
- Docker containers
- CI/CD pipeline
- Redis clustering (if needed)
- Monitoring setup
- Deployment documentation

## 12. Technology Stack

### Core Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "rate-limit-redis": "^4.2.0",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^9.1.3",
    "redis-memory-server": "^0.7.0",
    "nodemon": "^3.0.2",
    "eslint": "^8.55.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.0",
    "prettier": "^3.1.1"
  }
}
```

### Key Libraries

**Database & Cache**
- `mongoose`: MongoDB ODM
- `redis`: Redis client for caching
- `rate-limit-redis`: Redis store for rate limiting

**Security**
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `helmet`: Security headers
- `cors`: CORS middleware

**Validation & Documentation**
- `joi`: Schema validation
- `swagger-ui-express`: Swagger UI
- `swagger-jsdoc`: Generate Swagger from JSDoc

**Logging & Monitoring**
- `winston`: Logging framework
- `winston-daily-rotate-file`: Log rotation
- `morgan`: HTTP request logger

**Development**
- `nodemon`: Auto-restart server
- `jest`: Testing framework
- `supertest`: API testing
- `eslint`: Code linting
- `prettier`: Code formatting

## 13. Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/taskmanager
MONGODB_TEST_URI=mongodb://localhost:27017/taskmanager_test

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL_DEFAULT=300
CACHE_ENABLED=true

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Security
BCRYPT_SALT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
LOG_MAX_FILES=14d
LOG_MAX_SIZE=20m

# Swagger
SWAGGER_ENABLED=true
SWAGGER_URL=/api-docs
```

## 14. Redis Configuration Best Practices

### Connection Configuration
```javascript
// redis.config.js
const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Redis reconnection failed');
      return Math.min(retries * 100, 3000);
    }
  },
  password: process.env.REDIS_PASSWORD,
  database: process.env.REDIS_DB
});

redisClient.on('error', (err) => logger.error('Redis error', err));
redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('reconnecting', () => logger.warn('Redis reconnecting'));
```

### Cache TTL Guidelines
```javascript
// Short-lived data (frequently changing)
TASK_CACHE_TTL = 120 seconds        // 2 minutes
DASHBOARD_CACHE_TTL = 300 seconds   // 5 minutes

// Medium-lived data (moderate changes)
PROJECT_CACHE_TTL = 600 seconds     // 10 minutes
USER_LIST_CACHE_TTL = 300 seconds   // 5 minutes

// Long-lived data (rarely changes)
USER_PROFILE_CACHE_TTL = 3600 seconds  // 1 hour
```

### Cache Invalidation Strategy
```javascript
// Cascade invalidation for related data
async function invalidateTaskCache(taskId, projectId, userId) {
  await Promise.all([
    cache.del(`task:${taskId}`),
    cache.del(`task:project:${projectId}`),
    cache.del(`dashboard:stats:${userId}`),
    cache.del(`dashboard:distribution:${userId}`)
  ]);
}
```

## 15. Security Considerations

### 15.1 Authentication & Authorization Security

Password requirements and best practices
JWT token security with rotation
Session management strategies
HTTP-only cookies implementation

### 15.2 Input Validation & Sanitization

Request validation patterns
NoSQL injection prevention
XSS protection techniques

### 15.3 Rate Limiting & DOS Protection

Redis-backed rate limiting examples
Different limits for different endpoints
Request size and timeout limits

### 15.4 CORS Configuration

Production CORS setup
Security headers with Helmet
CSP and HSTS configuration

### 15.5 Authorization & Access Control

RBAC middleware implementation
Resource-level authorization
Project access control examples

### 15.6 Data Security

Sensitive data protection
Database security best practices
Redis security hardening
Field exclusion in responses

### 15.7 Error Handling & Information Disclosure

Secure error responses
Preventing information leakage
Development vs production error handling

### 15.8 Dependency Security

NPM audit practices
Dependency management strategies
Security monitoring tools

### 15.9 API Security

Request ID tracing
Security headers implementation
HTTPS enforcement

### 15.10 Logging & Monitoring

Security event logging examples
What to monitor and alert on
Suspicious activity detection

### 15.11 Cache Security

Cache poisoning prevention
User-specific cache keys
Secure cache key generation

### 15.12 Production Checklist

Complete pre-deployment security checklist
OWASP Top 10 coverage