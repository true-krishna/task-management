# Task Manager Backend API

A production-ready RESTful API backend for a Task Manager application built with Node.js, Express, MongoDB, and Redis following Clean Architecture principles.

## ✨ Features

- 🔐 **Authentication & Authorization**: JWT-based auth with refresh tokens and role-based access control
- 👥 **User Management**: User profiles, admin controls, and user deactivation
- 📁 **Project Management**: Create, update, and manage projects with team collaboration
- ✅ **Task Management**: Full task lifecycle with priorities, statuses, assignments, and due dates
- 📊 **Dashboard & Analytics**: Real-time statistics, task distributions, and weekly trends
- 📝 **Audit Trail**: Complete activity logging for compliance and tracking
- ⚡ **Redis Caching**: High-performance caching layer for frequent queries
- 📚 **Swagger Documentation**: Interactive API documentation at `/api-docs`
- 🔒 **Security**: Rate limiting, helmet protection, input validation, and secure password hashing
- 📈 **Logging**: Structured logging with Winston and daily rotation

## 🏗️ Architecture

This project follows **Clean Architecture** with clear separation of concerns:

```
src/
├── domain/                 # Enterprise Business Rules
│   ├── entities/          # Business entities (User, Project, Task)
│   ├── enums/             # Domain enumerations
│   ├── errors/            # Domain-specific errors
│   └── interfaces/        # Repository & service interfaces
│
├── application/           # Application Business Rules
│   └── use-cases/        # Business logic (auth, projects, tasks, etc.)
│
├── infrastructure/        # Frameworks & Drivers
│   ├── database/         # MongoDB connection & schemas
│   ├── cache/            # Redis implementation
│   ├── security/         # Password & token services
│   └── repositories/     # Data access implementations
│
├── presentation/         # Interface Adapters
│   ├── controllers/      # HTTP request handlers
│   ├── routes/           # API routes with Swagger docs
│   ├── middlewares/      # Auth, validation, error handling
│   └── validators/       # Request validation schemas
│
└── main/                 # Application Entry Point
    ├── factories/        # Dependency injection factories
    └── server.js         # Application bootstrap
```

### Key Design Patterns

- **Clean Architecture**: Dependency inversion, business logic isolation
- **Repository Pattern**: Abstract data access layer
- **Factory Pattern**: Centralized dependency injection
- **Use Case Pattern**: Single responsibility business operations
- **Middleware Pattern**: Cross-cutting concerns (auth, validation, logging)

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB 8.0 with Mongoose ODM
- **Cache**: Redis 4.6
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs, Helmet, express-rate-limit
- **Logging**: Winston with daily rotation
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **Code Quality**: ESLint (Airbnb style), Prettier

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: v5.0 or higher
- **Redis**: v6.0 or higher
- **npm**: v8.0 or higher (or yarn)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/true-krishna/task-management.git
cd task-manager-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Application
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/taskmanager
MONGODB_TEST_URI=mongodb://localhost:27017/taskmanager-test

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs
```

### 4. Start Required Services

#### MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:8.0

# Or use your local MongoDB installation
mongod
```

#### Redis
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Or use your local Redis installation
redis-server
```

### 5. Initialize Database (Optional)

Create an admin user:
```bash
node create-admin.js
```

## 🎮 Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Production Mode
```bash
npm start
```

### Docker (Coming Soon)
```bash
docker-compose up -d
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests by Type
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode (for development)
npm run test:watch
```

### Test Coverage
```bash
# Generate coverage report
npm test

# Coverage reports are in ./coverage/lcov-report/index.html
```

### Manual API Testing

Use the provided test scripts:
```bash
# Test authentication endpoints
./test-server.sh

# Test user management
./test-user-management.sh

# Test project management
./test-project-management.sh

# Test task management
./test-task-management.sh

# Test dashboard
./test-dashboard.sh

# Test audit logs
./test-audit.sh
```

## 📖 API Documentation

### Interactive Documentation (Swagger)
Once the server is running, access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

### Complete API Guide
See [API_GUIDE.md](./API_GUIDE.md) for comprehensive documentation with examples.

### Quick Start Examples

#### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Create Project and Task
```bash
# Set your access token
TOKEN="your-access-token-here"

# Create project
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "visibility": "team"
  }'

# Create task
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "projectId": "project-id-here",
    "priority": "high"
  }'
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Rate Limiting**: Prevent brute force attacks with configurable rate limits
- **Helmet**: Security headers for common vulnerabilities
- **Input Validation**: Joi schemas for request validation
- **CORS**: Configured CORS for cross-origin requests
- **Role-Based Access Control**: Admin and user roles with permission checks
- **Audit Logging**: Complete activity trail for security compliance

## 📊 Performance Features

- **Redis Caching**: High-performance caching layer for frequently accessed data
- **Database Indexing**: Optimized MongoDB indexes for fast queries
- **Connection Pooling**: Efficient database connection management
- **Compression**: Response compression with gzip
- **Query Optimization**: Aggregation pipelines and efficient queries

## 🗂️ Project Status

### Completed Phases

- ✅ **Phase 1**: Foundation & Setup
- ✅ **Phase 2**: Authentication System
- ✅ **Phase 3**: User Management
- ✅ **Phase 4**: Project Management
- ✅ **Phase 5**: Task Management
- ✅ **Phase 6**: Dashboard & Analytics
- ✅ **Phase 7**: Audit Trail & Activity Logs
- 🔄 **Phase 8**: Testing & Documentation (In Progress)
- ⏳ **Phase 9**: Deployment & Production Setup (Pending)

See individual phase completion documents:
- [PHASE2_COMPLETED.md](./PHASE2_COMPLETED.md) - Authentication
- [PHASE3_COMPLETED.md](./PHASE3_COMPLETED.md) - User Management
- [PHASE4_COMPLETED.md](./PHASE4_COMPLETED.md) - Project Management
- [PHASE5_COMPLETED.md](./PHASE5_COMPLETED.md) - Task Management
- [PHASE6_COMPLETED.md](./PHASE6_COMPLETED.md) - Dashboard & Analytics
- [PHASE7_COMPLETED.md](./PHASE7_COMPLETED.md) - Audit Trail

## 📁 Code Quality

### Linting
```bash
# Check code quality
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Formatting
```bash
# Check code formatting
npm run format:check

# Auto-format code
npm run format
```

### Code Style
- **ESLint**: Airbnb JavaScript Style Guide
- **Prettier**: Consistent code formatting
- **EditorConfig**: Consistent editor settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Guidelines
- Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, etc.
- Keep commits atomic and descriptive
- Reference issues in commits when applicable

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@true-krishna](https://github.com/true-krishna)

## 🙏 Acknowledgments

- Clean Architecture principles by Robert C. Martin
- Express.js community
- MongoDB and Redis teams
- All open-source contributors

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the [API_GUIDE.md](./API_GUIDE.md) for API documentation
- Review server logs in the `logs/` directory

## 🚀 Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Email notifications
- [ ] File attachments for tasks
- [ ] Advanced search and filtering
- [ ] API versioning
- [ ] GraphQL endpoint
- [ ] Docker deployment
- [ ] Kubernetes configuration
- [ ] CI/CD pipeline
- [ ] Performance monitoring

---

**Version**: 1.0.0  
**Last Updated**: January 16, 2026