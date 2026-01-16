# Task Manager API - Complete Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Project Management](#project-management)
5. [Task Management](#task-management)
6. [Dashboard & Analytics](#dashboard--analytics)
7. [Audit Logs](#audit-logs)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Best Practices](#best-practices)

---

## Getting Started

### Base URL
```
http://localhost:5000/api/v1
```

### API Documentation
Interactive API documentation is available via Swagger UI:
```
http://localhost:5000/api-docs
```

### Authentication
All endpoints except registration and login require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## Authentication

### 1. Register a New User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-16T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### 2. Login
Authenticate and receive access/refresh tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 3. Refresh Token
Get a new access token using the refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Logout
Invalidate the current refresh token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "User logged out successfully"
  }
}
```

---

## User Management

### 1. Get User Profile
Retrieve the authenticated user's profile.

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-16T10:00:00.000Z"
    }
  }
}
```

---

### 2. Update User Profile
Update the authenticated user's profile information.

**Endpoint:** `PUT /users/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

---

### 3. Get All Users (Admin Only)
Retrieve a list of all users with pagination.

**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `role` (optional): Filter by role (user, admin)
- `isActive` (optional): Filter by active status (true, false)
- `search` (optional): Search by email or username

**Example:**
```
GET /users?page=1&limit=20&role=user&isActive=true&search=john
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "email": "john.doe@example.com",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "isActive": true
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

## Project Management

### 1. Create Project
Create a new project.

**Endpoint:** `POST /projects`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "visibility": "team",
  "status": "active"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "507f1f77bcf86cd799439020",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "ownerId": "507f1f77bcf86cd799439011",
      "visibility": "team",
      "status": "active",
      "members": [],
      "createdAt": "2024-01-16T10:30:00.000Z"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "visibility": "team"
  }'
```

---

### 2. Get All Projects
Retrieve projects (owned by user or where user is a member).

**Endpoint:** `GET /projects`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `status` (optional): Filter by status (active, completed, archived)
- `visibility` (optional): Filter by visibility (private, team, public)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "507f1f77bcf86cd799439020",
        "name": "Website Redesign",
        "description": "Complete redesign of company website",
        "ownerId": "507f1f77bcf86cd799439011",
        "visibility": "team",
        "status": "active",
        "memberCount": 3,
        "taskCount": 15,
        "createdAt": "2024-01-16T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

### 3. Get Project by ID
Retrieve a specific project's details.

**Endpoint:** `GET /projects/:projectId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "507f1f77bcf86cd799439020",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "owner": {
        "id": "507f1f77bcf86cd799439011",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "visibility": "team",
      "status": "active",
      "members": [
        {
          "userId": "507f1f77bcf86cd799439030",
          "role": "member",
          "addedAt": "2024-01-16T11:00:00.000Z"
        }
      ],
      "taskStats": {
        "total": 15,
        "notStarted": 5,
        "inProgress": 7,
        "done": 3
      },
      "createdAt": "2024-01-16T10:30:00.000Z"
    }
  }
}
```

---

### 4. Update Project
Update project information.

**Endpoint:** `PUT /projects/:projectId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "507f1f77bcf86cd799439020",
      "name": "Website Redesign v2",
      "description": "Updated description",
      "status": "completed",
      "updatedAt": "2024-01-16T12:00:00.000Z"
    }
  }
}
```

---

### 5. Assign User to Project
Add a user as a project member.

**Endpoint:** `POST /projects/:projectId/members`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439030",
  "role": "member"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "507f1f77bcf86cd799439020",
      "name": "Website Redesign",
      "members": [
        {
          "userId": "507f1f77bcf86cd799439030",
          "role": "member",
          "addedAt": "2024-01-16T13:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## Task Management

### 1. Create Task
Create a new task within a project.

**Endpoint:** `POST /tasks`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Design homepage mockup",
  "description": "Create initial mockup designs for the homepage",
  "projectId": "507f1f77bcf86cd799439020",
  "priority": "high",
  "status": "not_started",
  "dueDate": "2024-01-20T23:59:59.000Z",
  "assigneeId": "507f1f77bcf86cd799439030"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439040",
      "title": "Design homepage mockup",
      "description": "Create initial mockup designs for the homepage",
      "projectId": "507f1f77bcf86cd799439020",
      "assigneeId": "507f1f77bcf86cd799439030",
      "priority": "high",
      "status": "not_started",
      "dueDate": "2024-01-20T23:59:59.000Z",
      "order": 0,
      "createdAt": "2024-01-16T14:00:00.000Z"
    }
  }
}
```

---

### 2. Get Project Tasks
Retrieve all tasks for a specific project.

**Endpoint:** `GET /tasks/project/:projectId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (not_started, in_progress, completed, done)
- `priority` (optional): Filter by priority (none, low, medium, high)
- `assigneeId` (optional): Filter by assignee
- `page` (optional): Page number
- `limit` (optional): Results per page

**Example:**
```
GET /tasks/project/507f1f77bcf86cd799439020?status=in_progress&priority=high
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "507f1f77bcf86cd799439040",
        "title": "Design homepage mockup",
        "description": "Create initial mockup designs",
        "projectId": "507f1f77bcf86cd799439020",
        "assignee": {
          "id": "507f1f77bcf86cd799439030",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "priority": "high",
        "status": "in_progress",
        "dueDate": "2024-01-20T23:59:59.000Z",
        "order": 0
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20
    }
  }
}
```

---

### 3. Update Task
Update task information.

**Endpoint:** `PUT /tasks/:taskId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Design homepage mockup - Updated",
  "description": "Updated description",
  "priority": "medium",
  "dueDate": "2024-01-22T23:59:59.000Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439040",
      "title": "Design homepage mockup - Updated",
      "priority": "medium",
      "updatedAt": "2024-01-16T15:00:00.000Z"
    }
  }
}
```

---

### 4. Update Task Status
Change task status (workflow transition).

**Endpoint:** `PATCH /tasks/:taskId/status`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439040",
      "title": "Design homepage mockup",
      "status": "in_progress",
      "updatedAt": "2024-01-16T15:30:00.000Z"
    }
  }
}
```

---

### 5. Assign Task
Assign or reassign a task to a user.

**Endpoint:** `PATCH /tasks/:taskId/assign`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "assigneeId": "507f1f77bcf86cd799439030"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "507f1f77bcf86cd799439040",
      "title": "Design homepage mockup",
      "assigneeId": "507f1f77bcf86cd799439030",
      "assignee": {
        "id": "507f1f77bcf86cd799439030",
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  }
}
```

---

## Dashboard & Analytics

### 1. Get Dashboard Stats
Retrieve comprehensive dashboard statistics.

**Endpoint:** `GET /dashboard/stats`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProjects": 5,
      "activeProjects": 3,
      "completedProjects": 2,
      "totalTasks": 47,
      "completedTasks": 15,
      "inProgressTasks": 20,
      "overdues": 3
    },
    "recentActivity": [
      {
        "type": "task_created",
        "title": "Design homepage mockup",
        "projectName": "Website Redesign",
        "timestamp": "2024-01-16T14:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Task Distribution
Get task distribution by status.

**Endpoint:** `GET /dashboard/tasks/distribution`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `projectId` (optional): Filter by specific project

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "distribution": [
      {
        "status": "not_started",
        "count": 12,
        "percentage": 25.5
      },
      {
        "status": "in_progress",
        "count": 20,
        "percentage": 42.6
      },
      {
        "status": "completed",
        "count": 10,
        "percentage": 21.3
      },
      {
        "status": "done",
        "count": 5,
        "percentage": 10.6
      }
    ],
    "total": 47
  }
}
```

---

### 3. Get Priority Distribution
Get task distribution by priority.

**Endpoint:** `GET /dashboard/tasks/priority`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "distribution": [
      {
        "priority": "high",
        "count": 15,
        "percentage": 31.9
      },
      {
        "priority": "medium",
        "count": 20,
        "percentage": 42.6
      },
      {
        "priority": "low",
        "count": 10,
        "percentage": 21.3
      },
      {
        "priority": "none",
        "count": 2,
        "percentage": 4.2
      }
    ],
    "total": 47
  }
}
```

---

### 4. Get Weekly Trend
Get task completion trend for the past weeks.

**Endpoint:** `GET /dashboard/tasks/weekly-trend`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `weeks` (optional): Number of weeks (default: 4)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "trend": [
      {
        "week": "2024-W01",
        "created": 12,
        "completed": 8,
        "startDate": "2024-01-01",
        "endDate": "2024-01-07"
      },
      {
        "week": "2024-W02",
        "created": 15,
        "completed": 10,
        "startDate": "2024-01-08",
        "endDate": "2024-01-14"
      },
      {
        "week": "2024-W03",
        "created": 10,
        "completed": 12,
        "startDate": "2024-01-15",
        "endDate": "2024-01-21"
      }
    ],
    "summary": {
      "totalCreated": 37,
      "totalCompleted": 30,
      "avgCreatedPerWeek": 12.3,
      "avgCompletedPerWeek": 10.0
    }
  }
}
```

---

## Audit Logs

### 1. Get Entity Activity
Retrieve activity logs for a specific entity (project or task).

**Endpoint:** `GET /audit/:entityType/:entityId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `entityType`: Type of entity (project, task, user)
- `entityId`: ID of the entity

**Query Parameters:**
- `limit` (optional): Results per page (default: 50)
- `skip` (optional): Skip results (default: 0)

**Example:**
```
GET /audit/project/507f1f77bcf86cd799439020?limit=20&skip=0
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "507f1f77bcf86cd799439050",
        "entityType": "project",
        "entityId": "507f1f77bcf86cd799439020",
        "action": "update",
        "userId": "507f1f77bcf86cd799439011",
        "changes": {
          "old": { "name": "Website Redesign" },
          "new": { "name": "Website Redesign v2" }
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2024-01-16T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 20,
      "skip": 0,
      "hasMore": true
    }
  }
}
```

---

### 2. Get User Activity
Retrieve activity logs for a specific user.

**Endpoint:** `GET /audit/user/:userId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional): Results per page
- `skip` (optional): Skip results
- `entityType` (optional): Filter by entity type

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "507f1f77bcf86cd799439050",
        "entityType": "task",
        "entityId": "507f1f77bcf86cd799439040",
        "action": "create",
        "userId": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-16T14:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 50,
      "skip": 0,
      "hasMore": false
    }
  }
}
```

---

### 3. Get All Activity (Admin Only)
Retrieve all system activity logs with filtering.

**Endpoint:** `GET /audit`

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `limit` (optional): Results per page
- `skip` (optional): Skip results
- `entityType` (optional): Filter by entity type
- `action` (optional): Filter by action (create, update, delete, assign, etc.)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "507f1f77bcf86cd799439050",
        "entityType": "project",
        "action": "create",
        "userId": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-16T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 500,
      "limit": 100,
      "skip": 0,
      "hasMore": true
    }
  }
}
```

---

### 4. Get Activity Statistics (Admin Only)
Get aggregated statistics on system activity.

**Endpoint:** `GET /audit/statistics`

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLogs": 500,
    "byAction": [
      {
        "action": "create",
        "count": 150,
        "percentage": 30.0
      },
      {
        "action": "update",
        "count": 200,
        "percentage": 40.0
      },
      {
        "action": "delete",
        "count": 50,
        "percentage": 10.0
      },
      {
        "action": "status_change",
        "count": 100,
        "percentage": 20.0
      }
    ],
    "dateRange": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-16T23:59:59.000Z"
    }
  }
}
```

---

## Error Handling

All API errors follow a consistent format:

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "password": "Password must be at least 8 characters"
      }
    }
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or missing authentication token"
  }
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Insufficient permissions to perform this action"
  }
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

#### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT_ERROR",
    "message": "Email already exists"
  }
}
```

#### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

### Default Limits
- **Authentication endpoints:** 5 requests per 15 minutes per IP
- **General API endpoints:** 100 requests per 15 minutes per IP
- **Admin endpoints:** 200 requests per 15 minutes per IP

### Rate Limit Headers
Each response includes rate limit information:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705419600000
```

### Exceeding Rate Limits
When you exceed the rate limit, you'll receive a 429 status code:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

---

## Best Practices

### 1. Token Management
- Store tokens securely (never in localStorage for sensitive apps)
- Refresh access tokens before they expire
- Handle token expiration gracefully
- Logout users when refresh token is invalid

### 2. Error Handling
- Always check the `success` field in responses
- Implement proper error handling for all HTTP status codes
- Display user-friendly error messages
- Log errors for debugging

### 3. Pagination
- Use pagination for list endpoints to improve performance
- Start with reasonable page sizes (20-50 items)
- Cache paginated results when appropriate

### 4. Filtering and Sorting
- Use query parameters for filtering
- Implement search functionality for better UX
- Consider implementing debouncing for search inputs

### 5. Security
- Never expose sensitive data in URLs
- Use HTTPS in production
- Implement proper authentication on client side
- Validate all user inputs

### 6. Performance
- Use caching for frequently accessed data
- Minimize unnecessary API calls
- Implement optimistic UI updates where appropriate
- Use webhooks for real-time updates (if available)

### 7. Testing
- Test all endpoints in your development environment
- Use Swagger UI for interactive testing
- Implement automated tests for critical workflows
- Test error scenarios

---

## Example Workflows

### Complete User Registration and Project Creation
```bash
# 1. Register a new user
ACCESS_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }' | jq -r '.data.accessToken')

# 2. Create a project
PROJECT_ID=$(curl -s -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Project",
    "description": "Project description",
    "visibility": "team"
  }' | jq -r '.data.project.id')

# 3. Create a task
TASK_ID=$(curl -s -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"My First Task\",
    \"description\": \"Task description\",
    \"projectId\": \"$PROJECT_ID\",
    \"priority\": \"high\"
  }" | jq -r '.data.task.id')

# 4. Update task status
curl -X PATCH http://localhost:5000/api/v1/tasks/$TASK_ID/status \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# 5. Get project tasks
curl -X GET "http://localhost:5000/api/v1/tasks/project/$PROJECT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Support

For issues or questions:
- Check the Swagger documentation: `http://localhost:5000/api-docs`
- Review error messages and status codes
- Check server logs for detailed error information
- Refer to this guide for API usage examples

---

**Version:** 1.0.0  
**Last Updated:** January 16, 2024
