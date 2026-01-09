# Task Manager Backend API

A RESTful API backend for a Task Manager application built with Node.js, Express, MongoDB, and Redis using Clean Architecture pattern.

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **Security**: bcryptjs for password hashing, Helmet for security headers
- **Logging**: Winston with daily rotation
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint, Prettier

## Project Structure

This project follows **Clean Architecture** principles with four main layers:

- **Domain Layer**: Business entities, rules, and interfaces
- **Application Layer**: Use cases and business logic orchestration
- **Infrastructure Layer**: External service implementations (DB, Cache, Security)
- **Presentation Layer**: HTTP controllers, routes, and middlewares

```
src/
├── domain/              # Business entities & rules
├── application/         # Use cases & DTOs
├── infrastructure/      # External implementations
├── presentation/        # Controllers, routes, middlewares
└── main/               # Application setup & factories
```

## Prerequisites

- Node.js 18+
- MongoDB 5+
- Redis 6+
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd task-manager-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## API Documentation

Once the server is running, API documentation is available at:
- **Swagger UI**: http://localhost:5000/api-docs (Phase 6+)

### Health Check
```bash
curl http://localhost:5000/api/health
```

## Environment Variables

See `.env.example` for all available configuration options.

### Key Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | localhost:27017 |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| JWT_ACCESS_EXPIRATION | Access token TTL | 15m |
| JWT_REFRESH_EXPIRATION | Refresh token TTL | 7d |
| CACHE_ENABLED | Enable Redis caching | true |

## Development

### Database Setup

**Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Using local installation
mongod
```

**Start Redis**
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Using local installation
redis-server
```

### Project Phases

The project is developed in phases:

1. **Phase 1**: Foundation & Setup ✅ (Current)
2. **Phase 2**: Authentication & Authorization
3. **Phase 3**: User Management
4. **Phase 4**: Project Management
5. **Phase 5**: Task Management & Kanban
6. **Phase 6**: Dashboard & Analytics
7. **Phase 7**: Audit Trail & Logging
8. **Phase 8**: Testing & Documentation
9. **Phase 9**: Deployment & DevOps

## Architecture Notes

### Clean Architecture Benefits

- **Testability**: Business logic is independent of frameworks
- **Flexibility**: Easy to swap implementations (e.g., different DB)
- **Maintainability**: Clear separation of concerns
- **Scalability**: Well-organized code structure

### Design Patterns Used

- **Repository Pattern**: Abstract data access
- **Dependency Injection**: Loose coupling
- **Factory Pattern**: Object creation
- **Service Layer**: Business logic encapsulation
- **DTO Pattern**: Request/response transformation

## Security

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Input validation with Joi
- ✅ Rate limiting (Phase 2+)
- ✅ Audit logging (Phase 7+)

## Performance

- ✅ Redis caching for frequently accessed data
- ✅ MongoDB connection pooling
- ✅ Request compression with gzip
- ✅ Database query optimization with indexes
- ✅ Pagination for list endpoints

## Logging

Winston logger with multiple transports:
- **Console**: Development environment only
- **Daily Rotation Files**: Error and combined logs
- **Log Levels**: Error, Warn, Info, HTTP, Debug

Logs are stored in the `logs/` directory.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

---

**Next Phase**: Phase 2 - Authentication & Authorization
