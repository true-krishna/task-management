# Backend Engineering Complete Curriculum
## Building a Production-Ready Task Manager API

---

## Course Overview

This comprehensive backend engineering bootcamp teaches you to build enterprise-grade APIs from scratch using Node.js, Express, MongoDB, and Redis. Through building a complete Task Manager application, you'll master clean architecture, authentication, testing, and deployment.

**Duration:** 12-16 weeks (200+ hours)  
**Prerequisites:** Basic programming knowledge (variables, functions, loops, conditionals)  
**Final Project:** Production-ready Task Manager REST API with 78%+ test coverage

---

## 🎯 Learning Outcomes

By the end of this course, you will be able to:
- Design and implement RESTful APIs following industry best practices
- Apply Clean Architecture principles to create maintainable, scalable applications
- Implement secure authentication and authorization systems
- Work with databases (MongoDB) and caching (Redis)
- Write comprehensive unit and integration tests
- Deploy applications to production environments
- Debug and monitor production applications
- Follow software engineering best practices (SOLID, DRY, KISS)

---

## 📚 Course Structure

### **Module 1: Backend Fundamentals (Week 1-2)**

#### 1.1 Introduction to Backend Development
**Learning Objectives:**
- Understand the role of backend development in web applications
- Explain client-server architecture and how they communicate
- Master HTTP protocol and RESTful principles
- Set up a professional development environment

**Theory (4 hours):**

**1.1.1 What is Backend Development?**
- Frontend vs Backend vs Full-Stack
- Backend responsibilities: business logic, data storage, security
- Popular backend technologies and when to use them
- Understanding APIs and microservices

**1.1.2 Client-Server Architecture**
- How web applications work (3-tier architecture)
- Request-Response cycle explained
- Understanding IP addresses, DNS, and ports
- Network protocols (TCP/IP basics)

**1.1.3 HTTP Protocol Deep Dive**
- HTTP methods: GET, POST, PUT, PATCH, DELETE
- HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- HTTP headers (Content-Type, Authorization, Accept)
- Request parts: URL, headers, body
- Response parts: status, headers, body
- HTTPS and SSL/TLS basics

**1.1.4 REST API Principles**
- What is REST (Representational State Transfer)?
- RESTful constraints (stateless, cacheable, etc.)
- Resource-based URLs
- Standard HTTP methods for CRUD operations
- Idempotency concept
- REST vs SOAP vs GraphQL

**1.1.5 JSON Data Format**
- JSON syntax and structure
- JSON vs XML
- Parsing and stringifying JSON
- JSON schema validation

**1.1.6 API Design Best Practices**
- Naming conventions for endpoints
- Versioning strategies
- Error response format
- Consistent response structure
- Documentation importance

**Practical Exercises:**
1. **Environment Setup (1 hour)**
   - Install Node.js (LTS version) and verify installation
   - Install VS Code and recommended extensions
   - Set up Git and GitHub account
   - Install Postman for API testing
   - Configure terminal and shell

2. **Your First Express Server (2 hours)**
   - Initialize npm project
   - Install Express.js
   - Create basic server with health check endpoint
   - Understand app.listen() and port binding
   - Test with browser and Postman

3. **HTTP Methods Practice (2 hours)**
   - Create endpoints for all HTTP methods
   - Test each endpoint with Postman
   - Observe request/response in browser DevTools
   - Send different headers and body formats
   - Handle query parameters

4. **Build a Simple To-Do API (3 hours)**
   - In-memory array as data store
   - GET /todos - list all todos
   - POST /todos - create new todo
   - GET /todos/:id - get single todo
   - PUT /todos/:id - update todo
   - DELETE /todos/:id - delete todo

**Project File:** `src/index.js` (basic server)

```javascript
// Your first Express server
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// In-memory data store
let todos = [
  { id: 1, title: 'Learn Node.js', completed: false },
  { id: 2, title: 'Build an API', completed: false }
];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json({ success: true, data: todos });
});

// POST create todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  const newTodo = {
    id: todos.length + 1,
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json({ success: true, data: newTodo });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Assessment:**
- Quiz on HTTP methods and status codes
- Code review of your first API
- Debug broken endpoints exercise
- Design RESTful endpoints for a library system

**Resources:**
- MDN HTTP Documentation
- REST API Tutorial (restfulapi.net)
- Postman Learning Center

#### 1.2 Node.js Core Concepts
**Learning Objectives:**
- Understand Node.js architecture and event-driven model
- Master asynchronous programming patterns
- Work effectively with npm ecosystem
- Implement proper error handling strategies

**Theory (6 hours):**

**1.2.1 Node.js Runtime and Event Loop**
- What is Node.js? (JavaScript runtime built on V8)
- Single-threaded event-driven architecture
- Event loop explained with diagrams
- Call stack, callback queue, and event queue
- Blocking vs Non-blocking operations
- When to use Node.js vs other technologies
- libuv and the thread pool

#### 1.3 Express.js Framework Deep Dive
**Learning Objectives:**
- Build production-ready Express applications
- Master middleware pattern and create custom middleware
- Implement advanced routing strategies
- Handle requests and responses professionally

**Theory (8 hours):**

**1.3.1 Express Application Structure**
- What is Express.js and why use it?
- Express vs vanilla Node.js http module
- Application and router objects
- Best practices for organizing Express apps
- MVC pattern in Express
- Folder structure conventions

**1.3.2 Routing System**
- Basic routing (app.get, app.post, etc.)
- Route parameters (:id, :userId)
- Optional parameters and regex patterns
- Route handlers and multiple callbacks
- Router-level middleware
- express.Router() for modular routes
- Route precedence and matching

**1.3.3 Middleware Deep Dive**
- What is middleware?
- Middleware execution flow
- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware (express.json, express.static)
- Third-party middleware (cors, helmet, morgan)
- Writing custom middleware
- next() function explained
- Middleware best practices

**1.3.4 Request Object (req)**
- req.params - route parameters
- req.query - query strings
- req.body - request body (with body parser)
- req.headers - HTTP headers
- req.method - HTTP method
- req.url and req.path
- req.cookies (with cookie-parser)
- req.get() for headers

**1.3.5 Response Object (res)**
- res.status() - set status code
- res.json() - send JSON response
- res.send() - send response
- res.redirect() - redirect
- res.render() - render templates
- res.set() - set headers
- res.cookie() - set cookies
- Method chaining

**1.3.6 Query Parameters vs Route Parameters vs Body**
```javascript
// Route parameters
GET /api/users/:userId/posts/:postId
// Access: req.params.userId, req.params.postId

// Query parameters
GET /api/users?role=admin&active=true
// Access: req.query.role, req.query.active

// Request body
POST /api/users
Body: { "name": "John", "email": "john@example.com" }
// Access: req.body.name, req.body.email
```

**1.3.7 CORS (Cross-Origin Resource Sharing)**
- What is CORS and why it matters
- Same-origin policy
- CORS headers explained
- Configuring CORS in Express
- Preflight requests (OPTIONS)
- Security implications

**1.3.8 Static File Serving**
- Serving static files (images, CSS, JS)
- express.static() middleware
- Virtual path prefix
- Multiple static directories

**Practical Exercises:**

1. **Build a Middleware Chain (2 hours)**
   ```javascript
   // Logger middleware
   const logger = (req, res, next) => {
     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
     next();
   };
   
   // Authentication middleware
   const authenticate = (req, res, next) => {
     const token = req.headers.authorization;
     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }
     // Verify token logic
     req.user = { id: 1, name: 'John' }; // Mock user
     next();
   };
   
   // Authorization middleware
   const authorize = (roles) => {
     return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
         return res.status(403).json({ error: 'Access denied' });
       }
       next();
     };
   };
   
   // Usage
   app.use(logger);
   app.get('/api/admin', authenticate, authorize(['admin']), (req, res) => {
     res.json({ message: 'Admin access granted' });
   });
   ```

2. **Advanced Routing Practice (3 hours)**
   ```javascript
   const express = require('express');
   const router = express.Router();
   
   // Users router
   const usersRouter = express.Router();
   usersRouter.get('/', getAllUsers);
   usersRouter.post('/', createUser);
   usersRouter.get('/:id', getUserById);
   usersRouter.put('/:id', updateUser);
   usersRouter.delete('/:id', deleteUser);
   
   // Posts router
   const postsRouter = express.Router();
   postsRouter.get('/', getAllPosts);
   postsRouter.post('/', createPost);
   
   // Mount routers
   app.use('/api/v1/users', usersRouter);
   app.use('/api/v1/posts', postsRouter);
   ```

3. **Request Validation Middleware (2 hours)**
   ```javascript
   const validateUser = (req, res, next) => {
     const { email, password } = req.body;
     
     if (!email || !email.includes('@')) {
       return res.status(400).json({ 
         error: 'Valid email is required' 
       });
     }
     
     if (!password || password.length < 6) {
       return res.status(400).json({ 
         error: 'Password must be at least 6 characters' 
       });
     }
     
     next();
   };
   
   app.post('/api/users', validateUser, createUser);
   ```

4. **Error Handling Middleware (2 hours)**
   ```javascript
   // Custom error class
   class AppError extends Error {
     constructor(message, statusCode) {
       super(message);
       this.statusCode = statusCode;
       this.isOperational = true;
     }
   }
   
   // 404 handler
   app.use((req, res, next) => {
     res.status(404).json({
       success: false,
       message: 'Route not found'
     });
   });
   
   // Global error handler (must be last)
   app.use((err, req, res, next) => {
     console.error(err.stack);
     
     res.status(err.statusCode || 500).json({
       success: false,
       message: err.message || 'Internal server error',
       ...(process.env.NODE_ENV === 'development' && { 
         stack: err.stack 
       })
     });
   });
   ```

5. **CORS Configuration (1 hour)**
   ```javascript
   const cors = require('cors');
   
   // Basic CORS
   app.use(cors());
   
   // Advanced CORS
   const corsOptions = {
     origin: ['http://localhost:3000', 'https://myapp.com'],
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true,
     maxAge: 86400 // 24 hours
   };
   
   app.use(cors(corsOptions));
   ```

**Project Files:**

`src/main/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom request ID middleware
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/tasks', tasksRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});

module.exports = app;
```

**Assignment:**
- Build a blog API with posts and comments
- Implement middleware for request logging
- Add validation middleware for all endpoints
- Create error handling for all edge cases
- Set up CORS for specific origins

**Assessment:**
- Explain middleware execution order
- Debug middleware issues
- Design route structure for complex app
- Code review: Express best practicesotenv package
- Different environments (dev, staging, production)
- Security: never commit .env files
- .env.example for documentation

**1.2.6 Error Handling**
- Error types in Node.js
- Try-catch blocks
- Error-first callbacks
- Throwing and catching errors
- Creating custom error classes
- Process exit codes
- Uncaught exceptions and unhandled rejections

**Practical Exercises:**

1. **Understanding Event Loop (2 hours)**
   ```javascript
   // Experiment with different async patterns
   console.log('Start');
   
   setTimeout(() => {
     console.log('Timeout 1');
   }, 0);
   
   Promise.resolve().then(() => {
     console.log('Promise 1');
   });
   
   console.log('End');
   
   // Predict the output order and understand why
   ```

2. **Module System Practice (2 hours)**
   - Create a math utilities module (add, subtract, multiply, divide)
   - Create a string utilities module (capitalize, reverse, truncate)
   - Import and use these modules in your main file
   - Publish a simple npm package (optional)

3. **Async Programming Mastery (4 hours)**
   ```javascript
   // Convert callback to promise to async/await
   
   // Callback style
   fs.readFile('data.txt', 'utf8', (err, data) => {
     if (err) throw err;
     console.log(data);
   });
   
   // Promise style
   const readFilePromise = (path) => {
     return new Promise((resolve, reject) => {
       fs.readFile(path, 'utf8', (err, data) => {
         if (err) reject(err);
         else resolve(data);
       });
     });
   };
   
   // Async/await style
   const readData = async () => {
     try {
       const data = await readFilePromise('data.txt');
       console.log(data);
     } catch (error) {
       console.error('Error:', error);
     }
   };
   ```

4. **Build a File-Based Database (3 hours)**
   - Store todos in JSON file
   - Read from file on startup
   - Write to file on every change
   - Handle file errors gracefully
   - Add backup functionality

5. **Environment Configuration (1 hour)**
   ```javascript
   // .env file
   PORT=3000
   DB_HOST=localhost
   DB_PORT=27017
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   
   // Load in app
   require('dotenv').config();
   const port = process.env.PORT || 3000;
   ```

**Project Files:**

`package.json`:
```json
{
  "name": "task-manager-api",
  "version": "1.0.0",
  "description": "Task Manager Backend API",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "keywords": ["api", "backend", "express"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

`.env.example`:
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_URI=mongodb://localhost:27017/taskmanager

# JWT Secret
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Assignment:**
- Build a CLI tool that reads CSV files and converts to JSON
- Implement error handling for file not found
- Add command-line arguments support
- Use async/await throughout

**Assessment:**
- Explain event loop with code examples
- Debug async code exercises
- Code review: async best practices
- Build a module that handles file operations

#### 1.3 Express.js Framework Deep Dive
**Theory (8 hours):**
- Express application structure
- Routing and route parameters
- Middleware concept and chain
- Request and response objects
- Query parameters vs route parameters vs body
- Static file serving
- Template engines vs REST APIs

**Practical:**
- Build multiple routes with different HTTP methods
- Create custom middleware functions
- Parse JSON request bodies
- Handle query strings and URL parameters
- Implement request validation
- Set up CORS

**Project Files:** `src/main/server.js`, middleware setup

**Hands-on Exercise:**
```javascript
// Middleware example
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route with parameters
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ userId, message: 'User found' });
});
```

---

### **Module 2: Database Fundamentals (Week 3-4)**

#### 2.1 Database Concepts
**Learning Objectives:**
- Compare SQL and NoSQL databases effectively
- Design normalized and denormalized data models
- Understand database transactions and consistency
- Choose appropriate database for different use cases

**Theory (4 hours):**

**2.1.1 SQL vs NoSQL Databases**
- Relational databases (PostgreSQL, MySQL)
  - Tables, rows, columns
  - Schemas and relationships
  - SQL query language
  - JOINS and transactions
- NoSQL databases (MongoDB, Redis, Cassandra)
  - Document stores (MongoDB)
  - Key-value stores (Redis)
  - Column-family stores (Cassandra)
  - Graph databases (Neo4j)

**2.1.2 When to Use Each Type**
- SQL best for:
  - Complex queries and reporting
  - ACID compliance requirements
  - Structured data with clear relationships
  - Financial systems, banking
- NoSQL best for:
  - Flexible schemas
  - High scalability requirements
  - Big data and real-time applications
  - Content management, catalogs

**2.1.3 Data Modeling**
- Normalization (1NF, 2NF, 3NF)
- Denormalization and when to use it
- Relationships: One-to-One, One-to-Many, Many-to-Many
- Embedded vs Referenced documents

**2.1.4 ACID Properties**
- Atomicity: All or nothing
- Consistency: Valid state always
- Isolation: Transactions don't interfere
- Durability: Committed data persists

**Practical:**
- Choose the right database for different scenarios
- Design data models for our Task Manager
- Understand one-to-many and many-to-many relationships
- Draw ER diagrams

**Assessment:**
- Quiz on database types and ACID properties
- Design schema for given requirements

#### 2.2 MongoDB and Mongoose
**Learning Objectives:**
- Install and configure MongoDB for development
- Master Mongoose ODM for data modeling
- Implement efficient CRUD operations
- Design performant schemas with proper indexing
- Use aggregation pipelines for complex queries

**Theory (10 hours):**

**2.2.1 MongoDB Architecture**
- Document-oriented database
- BSON (Binary JSON) format
- Collections and documents
- Database → Collections → Documents hierarchy
- MongoDB Atlas (cloud) vs local installation
- Replica sets and sharding basics

**2.2.2 MongoDB CRUD Operations**
```javascript
// Create
db.users.insertOne({ name: 'John', email: 'john@example.com' })
db.users.insertMany([{ name: 'Alice' }, { name: 'Bob' }])

// Read
db.users.find({ age: { $gt: 18 } })
db.users.findOne({ email: 'john@example.com' })

// Update
db.users.updateOne({ _id: id }, { $set: { name: 'Jane' } })
db.users.updateMany({ active: false }, { $set: { status: 'inactive' } })

// Delete
db.users.deleteOne({ _id: id })
db.users.deleteMany({ createdAt: { $lt: date } })
```

**2.2.3 Mongoose ODM Benefits**
- Schema definition and enforcement
- Built-in validation
- Middleware (hooks)
- Population for relationships
- Virtual properties
- Instance and static methods
- Query helpers

**2.2.4 Schema Design with Validation**
- Type definitions
- Required fields
- Default values
- Enums for restricted values
- Custom validators
- Min/Max constraints
- Unique constraints

**2.2.5 Indexes for Performance**
- Single field indexes
- Compound indexes
- Text indexes for search
- Unique indexes
- When to use indexes
- Index overhead considerations

**2.2.6 Relationships**
- Embedded documents (One-to-Few)
- Referenced documents (One-to-Many)
- Population with .populate()
- Virtual populations
- Handling Many-to-Many

**2.2.7 Aggregation Framework**
- $match, $group, $sort
- $lookup for joins
- $project for field selection
- $unwind for arrays
- Pipeline stages

**Practical Exercises:**

1. **MongoDB Setup (1 hour)**
   - Install MongoDB Community Edition
   - Start MongoDB service
   - Install MongoDB Compass
   - Create database and collections
   - Insert sample documents

2. **Mongoose Connection (1 hour)**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

3. **Complete Schema Design (3 hours)**
   - User schema with all validations
   - Project schema with references
   - Task schema with relationships
   - Add indexes, virtuals, and methods

4. **CRUD Implementation (3 hours)**
   - Create documents with validation
   - Query with filters and pagination
   - Update with validation
   - Delete with cascade logic

5. **Aggregation Pipelines (2 hours)**
```javascript
// Task statistics by project
Task.aggregate([
  { $match: { projectId: mongoose.Types.ObjectId(projectId) } },
  { $group: {
    _id: '$status',
    count: { $sum: 1 },
    tasks: { $push: '$title' }
  }},
  { $sort: { count: -1 } }
]);
```

**Project Files:**
- `src/infrastructure/database/mongoose/connection.js`
- `src/infrastructure/database/mongoose/schemas/UserSchema.js`
- `src/infrastructure/database/mongoose/schemas/ProjectSchema.js`
- `src/infrastructure/database/mongoose/schemas/TaskSchema.js`
- `src/infrastructure/database/mongoose/models/`

**Assignment:**
- Design and implement all schemas
- Create repository pattern for each entity
- Implement complex aggregation queries
- Add proper error handling

**Assessment:**
- Schema design review
- Query optimization quiz
- Build aggregation pipelines
- Performance testing

**Example Schema:**
```javascript
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  priority: {
    type: String,
    enum: ['none', 'low', 'medium', 'high'],
    default: 'none'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add index for performance
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ assigneeId: 1 });

module.exports = mongoose.model('Task', TaskSchema);
```

#### 2.3 Data Validation and Business Rules
**Learning Objectives:**
- Distinguish between validation and business logic
- Implement comprehensive input validation
- Sanitize user inputs to prevent security issues
- Master Joi for schema-based validation

**Theory (4 hours):**

**2.3.1 Validation Layers**
- Client-side validation (UX)
- Server-side validation (Security)
- Database validation (Data integrity)
- Never trust client data

**2.3.2 Input Validation Strategies**
- Type checking
- Format validation
- Range validation
- Required field validation
- Custom business rules

**2.3.3 Data Sanitization**
- Remove dangerous characters
- Prevent NoSQL injection
- Prevent XSS attacks
- Normalize data (trim, lowercase)
- Escape special characters

**2.3.4 Joi Validation**
- Schema definition
- Built-in validators
- Custom validators
- Conditional validation
- Error message customization

**Practical Exercises:**

1. **Joi Schemas (2 hours)**
```javascript
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Valid email required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required()
});

const taskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  priority: Joi.string().valid('none', 'low', 'medium', 'high'),
  projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
});
```

2. **Validation Middleware (1 hour)**
```javascript
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }

    req.body = value;
    next();
  };
};
```

3. **Input Sanitization (1 hour)**
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS
```

**Project Files:** `src/presentation/validators/`

**Assignment:**
- Create validators for all endpoints
- Implement sanitization middleware
- Add custom validators
- Test validation edge cases

**Assessment:**
- Design validation schemas
- Security quiz on injection prevention

---

### **Module 3: Software Architecture (Week 5-6)**

#### 3.1 Clean Architecture Principles
**Learning Objectives:**
- Understand why architecture matters in large applications
- Apply Clean Architecture layers correctly
- Implement Dependency Inversion Principle
- Master SOLID principles in practice

**Theory (8 hours):**

**3.1.1 Why Architecture Matters**
- Maintainability and scalability
- Testability improvements
- Team collaboration benefits
- Technology independence
- Business logic preservation
- Long-term cost reduction

**3.1.2 Clean Architecture Layers**
```
┌─────────────────────────────────────┐
│      Presentation Layer             │  ← Controllers, Routes, Middleware
│  (Framework-specific, replaceable)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer              │  ← Use Cases, DTOs
│    (Application-specific logic)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Domain Layer                 │  ← Entities, Business Rules
│     (Pure business logic)           │
└─────────────────────────────────────┘
               ▲
               │
┌──────────────┴──────────────────────┐
│    Infrastructure Layer             │  ← Database, APIs, Services
│  (External tools and frameworks)    │
└─────────────────────────────────────┘
```

**3.1.3 Dependency Inversion Principle**
- High-level modules shouldn't depend on low-level modules
- Both should depend on abstractions
- Abstractions shouldn't depend on details
- Details should depend on abstractions
- Interfaces and dependency injection

**3.1.4 Separation of Concerns**
- Each layer has one responsibility
- Domain: Business rules and entities
- Application: Use case orchestration
- Infrastructure: External tools
- Presentation: User interface/API

**3.1.5 SOLID Principles Explained**

**S - Single Responsibility Principle**
```javascript
// Bad: User class doing too much
class User {
  saveToDatabase() { /* ... */ }
  sendEmail() { /* ... */ }
  validatePassword() { /* ... */ }
}

// Good: Separated responsibilities
class User {
  constructor(data) { /* ... */ }
  validatePassword(password) { /* ... */ }
}

class UserRepository {
  save(user) { /* ... */ }
}

class EmailService {
  sendWelcomeEmail(user) { /* ... */ }
}
```

**O - Open/Closed Principle**
```javascript
// Open for extension, closed for modification
class Logger {
  log(message) {
    this.output(message);
  }
  output(message) { /* abstract */ }
}

class ConsoleLogger extends Logger {
  output(message) { console.log(message); }
}

class FileLogger extends Logger {
  output(message) { /* write to file */ }
}
```

**L - Liskov Substitution Principle**
- Derived classes must be substitutable for base classes
- Child classes shouldn't break parent class behavior

**I - Interface Segregation Principle**
- Clients shouldn't depend on interfaces they don't use
- Many specific interfaces better than one general

**D - Dependency Inversion Principle**
```javascript
// Bad: High-level depends on low-level
class UserService {
  constructor() {
    this.db = new MongoDatabase(); // Tight coupling
  }
}

// Good: Both depend on abstraction
class UserService {
  constructor(userRepository) { // Dependency injection
    this.userRepository = userRepository;
  }
}
```

**3.1.6 Repository Pattern**
- Abstraction over data access
- Business logic doesn't know database details
- Easy to switch databases
- Testability with mocks

**3.1.7 Use Case Pattern**
- One use case = one business operation
- Orchestrates domain objects
- Independent and testable
- Clear input and output

**Practical Exercises:**

1. **Restructure Application (4 hours)**
   - Create layer folders
   - Move files to appropriate layers
   - Define interfaces
   - Implement dependency injection

2. **Apply SOLID Principles (3 hours)**
   - Identify SRP violations and fix
   - Make classes open for extension
   - Create proper abstractions

3. **Dependency Injection Setup (2 hours)**
```javascript
// Service factory
class ServiceFactory {
  static createUserService() {
    const userRepository = new UserRepository();
    const passwordService = new PasswordService();
    const logger = new WinstonLogger();
    
    return new UserService({
      userRepository,
      passwordService,
      logger
    });
  }
}
```

**Project Structure:**
```
src/
├── domain/              # Business entities and rules
│   ├── entities/
│   ├── interfaces/
│   ├── enums/
│   └── errors/
├── application/         # Use cases
│   ├── use-cases/
│   └── dto/
├── infrastructure/      # External tools
│   ├── database/
│   ├── repositories/
│   ├── cache/
│   └── logging/
├── presentation/        # API layer
│   ├── controllers/
│   ├── routes/
│   └── middlewares/
└── main/               # App setup
    ├── factories/
    └── server.js
```

**Assignment:**
- Refactor existing code to Clean Architecture
- Document layer responsibilities
- Create dependency injection container
- Explain SOLID violations and fixes

**Assessment:**
- Draw architecture diagram
- Explain dependency flow
- Code review: architecture violations
- Design new feature following Clean Architecture

#### 3.2 Domain Layer
**Learning Objectives:**
- Design rich domain entities with business logic
- Create value objects for domain concepts
- Implement custom error classes
- Use enums for type safety

**Theory (6 hours):**

**3.2.1 Entity Design**
- What is a domain entity?
- Identity and lifecycle
- Encapsulating business rules
- Entities vs Anemic models
- Rich domain models
- Entity invariants

**3.2.2 Value Objects**
- Immutable objects
- No identity, only values
- Examples: Email, Money, Address
- Validation in constructor

**3.2.3 Business Rule Encapsulation**
- Keep business logic in domain
- Methods that enforce rules
- Validation vs business logic
- Domain events

**3.2.4 Custom Error Types**
- Domain-specific errors
- Error hierarchy
- Meaningful error messages
- Error vs Exception

**3.2.5 Enums for Type Safety**
- Prevent invalid values
- Self-documenting code
- Centralized constants

**Practical Exercises:**

1. **Create Entity Classes (3 hours)**
```javascript
// User Entity
class User {
  constructor({ id, email, password, firstName, lastName, role, isActive }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role || 'user';
    this.isActive = isActive !== undefined ? isActive : true;
  }

  // Business methods
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  canManageProject(project) {
    return this.isAdmin() || project.isOwner(this.id);
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    if (this.isAdmin()) {
      throw new DomainError('Cannot deactivate admin user');
    }
    this.isActive = false;
  }
}
```

2. **Project Entity with Business Logic (2 hours)**
```javascript
class Project {
  constructor({ id, name, description, ownerId, members, visibility, status }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.members = members || [];
    this.visibility = visibility || 'private';
    this.status = status || 'active';
    this.validateInvariants();
  }

  validateInvariants() {
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationError('Project name is required');
    }
  }

  addMember(userId) {
    if (this.members.includes(userId)) {
      throw new ConflictError('User already member');
    }
    this.members.push(userId);
  }

  removeMember(userId) {
    if (userId === this.ownerId) {
      throw new DomainError('Cannot remove owner');
    }
    this.members = this.members.filter(id => id !== userId);
  }

  isOwner(userId) {
    return this.ownerId === userId;
  }

  isMember(userId) {
    return this.members.includes(userId);
  }

  hasAccess(userId, userRole) {
    if (userRole === 'admin') return true;
    if (this.isOwner(userId)) return true;
    if (this.visibility === 'public') return true;
    if (this.visibility === 'team' && this.isMember(userId)) return true;
    return false;
  }

  archive() {
    this.status = 'archived';
  }
}
```

3. **Custom Error Classes (1 hour)**
```javascript
class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DomainError';
  }
}

class ValidationError extends DomainError {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends DomainError {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

class AuthorizationError extends DomainError {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

class ConflictError extends DomainError {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}
```

4. **Enums for Type Safety (1 hour)**
```javascript
// User Role Enum
class UserRole {
  static USER = 'user';
  static ADMIN = 'admin';
  static MODERATOR = 'moderator';

  static values() {
    return [this.USER, this.ADMIN, this.MODERATOR];
  }

  static isValid(role) {
    return this.values().includes(role);
  }
}

// Task Priority Enum
class TaskPriority {
  static NONE = 'none';
  static LOW = 'low';
  static MEDIUM = 'medium';
  static HIGH = 'high';

  static values() {
    return [this.NONE, this.LOW, this.MEDIUM, this.HIGH];
  }
}

// Task Status Enum
class TaskStatus {
  static NOT_STARTED = 'not_started';
  static IN_PROGRESS = 'in_progress';
  static COMPLETED = 'completed';
  static CANCELLED = 'cancelled';

  static values() {
    return [this.NOT_STARTED, this.IN_PROGRESS, this.COMPLETED, this.CANCELLED];
  }
}
```

**Project Files:**
- `src/domain/entities/User.js`
- `src/domain/entities/Project.js`
- `src/domain/entities/Task.js`
- `src/domain/entities/RefreshToken.js`
- `src/domain/entities/AuditLog.js`
- `src/domain/enums/UserRole.js`
- `src/domain/enums/TaskStatus.js`
- `src/domain/enums/TaskPriority.js`
- `src/domain/enums/ProjectStatus.js`
- `src/domain/enums/ProjectVisibility.js`
- `src/domain/errors/DomainError.js`
- `src/domain/errors/ValidationError.js`
- `src/domain/errors/NotFoundError.js`
- `src/domain/errors/AuthorizationError.js`
- `src/domain/errors/ConflictError.js`

**Assignment:**
- Create all domain entities
- Implement business methods
- Add comprehensive validation
- Create all error classes
- Document business rules

**Assessment:**
- Design entity for new feature
- Identify where business logic belongs
- Code review: rich vs anemic models
- Explain domain-driven design benefits

**Entity Example:**
```javascript
class Project {
  constructor({ id, name, description, ownerId, members, visibility, status }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.members = members || [];
    this.visibility = visibility || 'private';
    this.status = status || 'active';
  }

  // Business logic methods
  addMember(userId) {
    if (this.members.includes(userId)) {
      throw new ValidationError('User is already a member');
    }
    this.members.push(userId);
  }

  isOwner(userId) {
    return this.ownerId === userId;
  }

  isMember(userId) {
    return this.members.includes(userId);
  }

  hasAccess(userId, userRole) {
    if (userRole === 'admin') return true;
    if (this.isOwner(userId)) return true;
    if (this.visibility === 'public') return true;
    if (this.visibility === 'team' && this.isMember(userId)) return true;
    return false;
  }
}
```

#### 3.3 Application Layer - Use Cases
**Learning Objectives:**
- Implement Use Case pattern for business operations
- Apply Single Responsibility to use cases
- Design DTOs for data transfer
- Master Dependency Injection pattern

**Theory (8 hours):**

**3.3.1 Use Case Pattern**
- One class per business operation
- Input: DTOs or primitives
- Output: DTOs or entities
- Orchestrates domain objects
- No framework dependencies

**3.3.2 Single Responsibility in Use Cases**
- One reason to change
- Do one thing well
- Easy to test
- Easy to understand

**3.3.3 DTOs (Data Transfer Objects)**
- Transfer data between layers
- No business logic
- Simple data structures
- Validation at boundaries

**3.3.4 Dependency Injection**
- Constructor injection
- Interface-based dependencies
- Testability with mocks
- Loose coupling

**Practical Exercises:**

1. **Create Use Case Structure (2 hours)**
```javascript
class CreateProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectData, userId) {
    // 1. Validation
    if (!projectData.name) {
      throw new ValidationError('Project name required');
    }

    // 2. Business logic
    const project = new Project({
      ...projectData,
      ownerId: userId,
      members: [],
      status: 'active'
    });

    // 3. Persistence
    const savedProject = await this.projectRepository.create(project);

    // 4. Side effects
    await this.cacheService.del(`projects:user:${userId}`);
    this.logger.info('Project created', { projectId: savedProject.id });

    return savedProject;
  }
}
```

2. **Auth Use Cases (3 hours)**
```javascript
class RegisterUser {
  constructor({ userRepository, passwordService, tokenService, logger }) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  async execute({ email, password, firstName, lastName }) {
    // Check existing
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    // Validate password
    const validation = this.passwordService.validatePasswordStrength(password);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(password);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user'
    });

    const savedUser = await this.userRepository.create(user);
    
    this.logger.info('User registered', { userId: savedUser.id });
    
    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName
    };
  }
}

class LoginUser {
  constructor({ userRepository, passwordService, tokenService, logger }) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  async execute({ email, password }) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check password
    const isValid = await this.passwordService.comparePassword(
      password,
      user.password
    );
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check if active
    if (!user.isActive) {
      throw new AuthorizationError('Account is deactivated');
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    this.logger.info('User logged in', { userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }
}
```

3. **Task Use Cases (2 hours)**
```javascript
class CreateTask {
  async execute(taskData, userId) {
    // Check project exists and user has access
    const project = await this.projectRepository.findById(taskData.projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    if (!project.hasAccess(userId, 'user')) {
      throw new AuthorizationError();
    }

    // Create task
    const task = new Task({
      ...taskData,
      createdBy: userId,
      status: 'not_started'
    });

    const savedTask = await this.taskRepository.create(task);
    await this.cacheService.del(`tasks:project:${project.id}`);
    
    return savedTask;
  }
}

class UpdateTask {
  async execute(taskId, updates, userId, userRole) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task');
    }

    const project = await this.projectRepository.findById(task.projectId);
    if (!project.hasAccess(userId, userRole)) {
      throw new AuthorizationError();
    }

    Object.assign(task, updates);
    const updated = await this.taskRepository.update(taskId, task);
    await this.cacheService.del(`tasks:project:${project.id}`);
    
    return updated;
  }
}
```

4. **Dashboard Use Cases (1 hour)**
```javascript
class GetDashboardStats {
  async execute(userId, userRole) {
    let projects;
    if (userRole === 'admin') {
      projects = await this.projectRepository.findAll();
    } else {
      projects = await this.projectRepository.findByUserId(userId);
    }

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0
    };

    for (const project of projects) {
      const tasks = await this.taskRepository.findByProject(project.id);
      stats.totalTasks += tasks.length;
      stats.completedTasks += tasks.filter(t => t.status === 'completed').length;
      stats.inProgressTasks += tasks.filter(t => t.status === 'in_progress').length;
    }

    return stats;
  }
}
```

**Project Files:** `src/application/use-cases/`
- auth/RegisterUser.js
- auth/LoginUser.js
- auth/RefreshToken.js
- auth/LogoutUser.js
- user/GetUser.js
- user/UpdateUser.js
- user/ListUsers.js
- project/CreateProject.js
- project/GetProject.js
- project/UpdateProject.js
- project/DeleteProject.js
- project/AddMember.js
- task/CreateTask.js
- task/GetTask.js
- task/UpdateTask.js
- task/DeleteTask.js
- task/AssignTask.js
- dashboard/GetDashboardStats.js

**Assignment:**
- Implement all use cases
- Add proper error handling
- Implement authorization checks
- Write unit tests for use cases

**Assessment:**
- Design use case for new feature
- Explain separation from domain logic
- Code review: use case best practices

**Use Case Example:**
```javascript
class CreateProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectData, userId) {
    // Validation
    if (!projectData.name) {
      throw new ValidationError('Project name is required');
    }

    // Business logic
    const project = await this.projectRepository.create({
      ...projectData,
      ownerId: userId,
      members: [],
      status: 'active'
    });

    // Side effects
    await this.cacheService.del(`projects:user:${userId}`);
    this.logger.info('Project created', { projectId: project.id });

    return project;
  }
}
```

#### 3.4 Infrastructure Layer
**Learning Objectives:**
- Implement Repository pattern for data access
- Integrate external services properly
- Design caching strategies
- Set up structured logging

**Theory (6 hours):**

**3.4.1 Repository Implementation**
- Abstraction over database
- Interface in domain, implementation in infrastructure
- CRUD operations
- Complex queries
- Transaction handling

**3.4.2 External Service Integration**
- Email services
- File storage (S3, etc.)
- Payment gateways
- Third-party APIs
- Service interfaces

**3.4.3 Caching Strategies**
- Cache-aside pattern
- Write-through caching
- Cache invalidation
- TTL management

**3.4.4 Logging Best Practices**
- Structured logging
- Log levels
- Contextual information
- Log rotation

**Practical Exercises:**

1. **Repository Implementation (3 hours)**
```javascript
class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async create(userData) {
    const user = await this.userModel.create(userData);
    return this.toEntity(user);
  }

  async findById(id) {
    const user = await this.userModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email) {
    const user = await this.userModel.findOne({ 
      email: email.toLowerCase() 
    });
    return user ? this.toEntity(user) : null;
  }

  async update(id, updates) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    return user ? this.toEntity(user) : null;
  }

  async delete(id) {
    await this.userModel.findByIdAndDelete(id);
  }

  toEntity(doc) {
    return new User({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      firstName: doc.firstName,
      lastName: doc.lastName,
      role: doc.role,
      isActive: doc.isActive
    });
  }
}
```

2. **Cache Service (2 hours)**
```javascript
class CacheService {
  constructor(redisClient) {
    this.client = redisClient;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, ttl = 300) {
    await this.client.setEx(key, ttl, value);
  }

  async del(key) {
    await this.client.del(key);
  }

  async delPattern(pattern) {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }
}
```

3. **Logger Setup (1 hour)**
```javascript
const winston = require('winston');

class WinstonLogger {
  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }
}
```

**Project Files:**
- `src/infrastructure/repositories/`
- `src/infrastructure/cache/CacheService.js`
- `src/infrastructure/logging/WinstonLogger.js`
- `src/infrastructure/security/PasswordService.js`
- `src/infrastructure/security/TokenService.js`

**Assignment:**
- Implement all repositories
- Set up Redis caching
- Configure Winston logger
- Handle all infrastructure errors

#### 3.5 Presentation Layer
**Learning Objectives:**
- Implement Controller pattern
- Organize routes effectively
- Version APIs properly
- Format responses consistently

**Theory (4 hours):**

**3.5.1 Controller Pattern**
- Thin controllers
- Delegate to use cases
- Handle HTTP concerns only
- Request/response formatting

**3.5.2 Route Organization**
- Group by resource
- Use routers for modules
- Consistent naming
- RESTful conventions

**3.5.3 API Versioning**
- URL versioning (/api/v1/)
- Header versioning
- When to version
- Backward compatibility

**3.5.4 Response Formatting**
- Consistent structure
- Success responses
- Error responses
- Pagination format

**Practical Exercises:**

1. **Controller Implementation (2 hours)**
```javascript
class ProjectController {
  constructor({
    createProject,
    getProject,
    updateProject,
    deleteProject
  }) {
    this.createProject = createProject;
    this.getProject = getProject;
    this.updateProject = updateProject;
    this.deleteProject = deleteProject;
  }

  async create(req, res, next) {
    try {
      const project = await this.createProject.execute(
        req.body,
        req.user.id
      );

      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const project = await this.getProject.execute(
        req.params.id,
        req.user.id,
        req.user.role
      );

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  }
}
```

2. **Route Organization (1 hour)**
```javascript
const express = require('express');
const router = express.Router();

router.post('/', 
  authenticate,
  validate(projectValidator.create),
  projectController.create
);

router.get('/:id',
  authenticate,
  projectController.get
);

router.put('/:id',
  authenticate,
  validate(projectValidator.update),
  projectController.update
);

router.delete('/:id',
  authenticate,
  authorize(['admin']),
  projectController.delete
);

module.exports = router;
```

**Project Files:**
- `src/presentation/controllers/`
- `src/presentation/routes/`
- `src/presentation/middlewares/`

**Assessment:**
- Implement all controllers
- Organize routes properly
- Consistent response format
- Error handling review

---

### **Module 4: Authentication & Authorization (Week 7-8)**

#### 4.1 Security Fundamentals
**Learning Objectives:**
- Understand authentication vs authorization
- Master password security with bcrypt
- Implement JWT-based authentication
- Protect against common security vulnerabilities

**Theory (6 hours):**

**4.1.1 Authentication vs Authorization**
- **Authentication:** "Who are you?" (Identity verification)
- **Authorization:** "What can you do?" (Permission checking)
- Examples of each
- Why both are needed

**4.1.2 Password Security**
- Never store plaintext passwords
- Hashing vs Encryption
  - Hashing: One-way function (password storage)
  - Encryption: Two-way function (data protection)
- Salt: Random data added to password
- bcrypt: Adaptive hash function
  - Cost factor (work factor)
  - Automatically generates salt
  - Slow by design (prevents brute force)

**4.1.3 Session-Based vs Token-Based Auth**

**Session-Based:**
```
Client                  Server
  |─login────────>|  Create session, store in DB
  |<─session ID─────|  Send session cookie
  |─request+cookie─>|  Lookup session in DB
```
Pros: Can revoke immediately, server controls
Cons: Scalability issues, requires session storage

**Token-Based (JWT):**
```
Client                  Server
  |─login────────>|  Generate JWT
  |<─JWT token─────|  Sign with secret
  |─request+JWT───>|  Verify signature
```
Pros: Stateless, scalable, works across domains
Cons: Can't revoke until expiry, larger payload

**4.1.4 JWT (JSON Web Tokens)**
- Structure: header.payload.signature
- Header: Algorithm and type
- Payload: Claims (user data)
- Signature: Verification

**JWT Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  ← Header
eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6ImEiLCJyb2xlIjoidXNlciJ9.  ← Payload
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

**4.1.5 Refresh Tokens**
- Access token: Short-lived (15 min)
- Refresh token: Long-lived (7 days)
- Why use both?
  - Security: Stolen access token expires quickly
  - UX: User doesn't re-login frequently
- Refresh token rotation

**4.1.6 Common Security Vulnerabilities (OWASP Top 10)**
1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, NoSQL)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Data Integrity Failures
9. Logging Failures
10. Server-Side Request Forgery

**Practical Exercises:**

1. **Password Service (2 hours)**
```javascript
const bcrypt = require('bcryptjs');

class PasswordService {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

2. **Token Service (3 hours)**
```javascript
const jwt = require('jsonwebtoken');

class TokenService {
  generateAccessToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    });
  }

  generateRefreshToken(user) {
    const payload = {
      userId: user.id,
      type: 'refresh'
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }
      throw new AuthenticationError('Invalid token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }
}
```

3. **Security Testing (1 hour)**
   - Test password hashing
   - Test JWT generation and verification
   - Test token expiration
   - Test password strength validation

**Project Files:**
- `src/infrastructure/security/PasswordService.js`
- `src/infrastructure/security/TokenService.js`

**Assignment:**
- Implement complete password service
- Implement JWT token service
- Add password strength requirements
- Handle all security errors

**Assessment:**
- Security quiz on auth vs authz
- Explain JWT structure
- Design secure authentication flow
- Identify security vulnerabilities

#### 4.2 User Registration and Login
**Learning Objectives:**
- Implement complete user registration flow
- Build secure login system
- Validate user inputs properly
- Handle authentication errors gracefully

**Theory (4 hours):**

**4.2.1 Registration Flow**
```
1. User submits: email, password, name
2. Validate input format
3. Check if email already exists
4. Validate password strength
5. Hash password with bcrypt
6. Create user in database
7. (Optional) Send verification email
8. Return success (don't auto-login for security)
```

**4.2.2 Email Validation**
- Format validation (regex)
- Normalize (lowercase, trim)
- Check uniqueness
- Consider email verification

**4.2.3 Password Requirements**
- Minimum length (8+ characters)
- Complexity requirements
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
- Check against common passwords
- Consider password strength meter

**4.2.4 Login Flow**
```
1. User submits: email, password
2. Find user by email
3. Compare password with bcrypt
4. Check account status (active/blocked)
5. Generate access & refresh tokens
6. (Optional) Save refresh token to database
7. Return tokens and user data
```

**4.2.5 Account Activation**
- Email verification
- Verification tokens
- Token expiration
- Resend verification

**Practical Exercises:**

1. **RegisterUser Use Case (2 hours)**
```javascript
class RegisterUser {
  constructor({ userRepository, passwordService, logger }) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.logger = logger;
  }

  async execute({ email, password, firstName, lastName }) {
    // 1. Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if exists
    const existingUser = await this.userRepository.findByEmail(
      normalizedEmail
    );
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // 3. Validate password strength
    const validation = this.passwordService.validatePasswordStrength(
      password
    );
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // 4. Hash password
    const hashedPassword = await this.passwordService.hashPassword(
      password
    );

    // 5. Create user
    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: UserRole.USER,
      isActive: true
    });

    const savedUser = await this.userRepository.create(user);

    this.logger.info('User registered successfully', {
      userId: savedUser.id,
      email: savedUser.email
    });

    // Return without password
    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role
    };
  }
}
```

2. **LoginUser Use Case (2 hours)**
```javascript
class LoginUser {
  constructor({ 
    userRepository, 
    passwordService, 
    tokenService,
    refreshTokenRepository,
    logger 
  }) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.refreshTokenRepository = refreshTokenRepository;
    this.logger = logger;
  }

  async execute({ email, password }) {
    // 1. Find user (include password)
    const user = await this.userRepository.findByEmailWithPassword(
      email.toLowerCase()
    );
    
    if (!user) {
      // Don't reveal if email exists
      throw new AuthenticationError('Invalid credentials');
    }

    // 2. Verify password
    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      this.logger.warn('Failed login attempt', { email });
      throw new AuthenticationError('Invalid credentials');
    }

    // 3. Check if account is active
    if (!user.isActive) {
      throw new AuthorizationError(
        'Account is deactivated. Contact support.'
      );
    }

    // 4. Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    // 5. Save refresh token to database
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    this.logger.info('User logged in successfully', {
      userId: user.id
    });

    // 6. Return user and tokens (without password)
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }
}
```

3. **Auth Controller (1 hour)**
```javascript
class AuthController {
  constructor({ registerUser, loginUser, refreshToken, logoutUser }) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.refreshToken = refreshToken;
    this.logoutUser = logoutUser;
  }

  async register(req, res, next) {
    try {
      const user = await this.registerUser.execute(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.loginUser.execute(req.body);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
```

**Project Files:**
- `src/application/use-cases/auth/RegisterUser.js`
- `src/application/use-cases/auth/LoginUser.js`
- `src/presentation/controllers/AuthController.js`

**Assignment:**
- Implement complete registration flow
- Implement login with all validations
- Add rate limiting for login attempts
- Handle all edge cases

**Assessment:**
- Design secure registration flow
- Explain why we hash passwords
- Security review of auth implementation

**Registration Example:**
```javascript
class RegisterUser {
  constructor({ userRepository, passwordService, tokenService, logger }) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  async execute({ email, password, firstName, lastName }) {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Validate password strength
    const validation = this.passwordService.validatePasswordStrength(password);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '));
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      isActive: true
    });

    // Don't return password
    delete user.password;

    this.logger.info('User registered', { userId: user.id });
    return user;
  }
}
```

#### 4.3 JWT Implementation
**Learning Objectives:**
- Understand JWT structure deeply
- Implement token generation and verification
- Handle token expiration properly
- Implement refresh token rotation

**Theory (6 hours):**

**4.3.1 JWT Structure**
```
Header (Algorithm & Type):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Claims):
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "iat": 1516239022,
  "exp": 1516239922
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

**4.3.2 Token Claims**
- **Standard Claims:**
  - iss (issuer)
  - sub (subject)
  - aud (audience)
  - exp (expiration time)
  - iat (issued at)
  - nbf (not before)
- **Custom Claims:**
  - userId, email, role, permissions

**4.3.3 Access vs Refresh Tokens**

| Aspect | Access Token | Refresh Token |
|--------|-------------|---------------|
| Lifespan | Short (15 min) | Long (7 days) |
| Purpose | API access | Get new access token |
| Storage | Memory/localStorage | HttpOnly cookie |
| Payload | User data, permissions | User ID only |
| Revocable | No (stateless) | Yes (store in DB) |

**4.3.4 Token Rotation**
- Issue new refresh token on each use
- Invalidate old refresh token
- Detect token reuse (security breach)
- Token family tracking

**4.3.5 Token Storage**
- **Access Token:** localStorage, memory
- **Refresh Token:** HttpOnly cookie (XSS protection)
- Never store in plain cookies
- Clear on logout

**Practical Exercises:**

1. **Complete Token Service (3 hours)**
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenService {
  generateAccessToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'access'
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: 'task-manager-api',
        audience: 'task-manager-client'
      }
    );
  }

  generateRefreshToken(user) {
    const payload = {
      userId: user.id,
      type: 'refresh',
      tokenFamily: crypto.randomBytes(16).toString('hex')
    };

    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '7d',
        issuer: 'task-manager-api'
      }
    );
  }

  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
          issuer: 'task-manager-api',
          audience: 'task-manager-client'
        }
      );

      if (decoded.type !== 'access') {
        throw new AuthenticationError('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      }
      throw error;
    }
  }

  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET,
        { issuer: 'task-manager-api' }
      );

      if (decoded.type !== 'refresh') {
        throw new AuthenticationError('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}
```

2. **RefreshToken Use Case (2 hours)**
```javascript
class RefreshToken {
  constructor({ 
    refreshTokenRepository,
    userRepository,
    tokenService,
    logger 
  }) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.logger = logger;
  }

  async execute(refreshToken) {
    // 1. Verify token
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    // 2. Check if token exists in database
    const storedToken = await this.refreshTokenRepository.findByToken(
      refreshToken
    );

    if (!storedToken) {
      // Token reuse detected - potential security breach
      this.logger.error('Refresh token reuse detected', {
        userId: decoded.userId
      });
      
      // Invalidate all tokens for this user
      await this.refreshTokenRepository.deleteAllForUser(
        decoded.userId
      );
      
      throw new AuthenticationError(
        'Token reuse detected. Please login again.'
      );
    }

    // 3. Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(storedToken.id);
      throw new AuthenticationError('Refresh token expired');
    }

    // 4. Get user
    const user = await this.userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // 5. Generate new tokens (rotation)
    const newAccessToken = this.tokenService.generateAccessToken(user);
    const newRefreshToken = this.tokenService.generateRefreshToken(user);

    // 6. Delete old refresh token
    await this.refreshTokenRepository.delete(storedToken.id);

    // 7. Save new refresh token
    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    this.logger.info('Tokens refreshed', { userId: user.id });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}
```

3. **Logout Implementation (1 hour)**
```javascript
class LogoutUser {
  async execute(refreshToken) {
    if (refreshToken) {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
      this.logger.info('User logged out');
    }
    return { message: 'Logged out successfully' };
  }
}
```

**Project Files:**
- `src/infrastructure/security/TokenService.js`
- `src/application/use-cases/auth/RefreshToken.js`
- `src/application/use-cases/auth/LogoutUser.js`
- `src/domain/entities/RefreshToken.js`
- `src/infrastructure/repositories/RefreshTokenRepository.js`

**Assignment:**
- Implement complete token service
- Implement refresh token rotation
- Add token blacklisting
- Handle all token errors

**Assessment:**
- Explain JWT structure
- Design token refresh flow
- Security review of implementation

#### 4.4 Authorization and Middleware
**Learning Objectives:**
- Implement role-based access control (RBAC)
- Create reusable authentication middleware
- Protect routes effectively
- Handle authorization errors properly

**Theory (4 hours):**

**4.4.1 Role-Based Access Control (RBAC)**
- Roles: admin, user, moderator
- Permissions per role
- Role hierarchy
- Checking user roles

**4.4.2 Authentication Middleware**
- Extract token from header
- Verify token signature
- Attach user to request
- Handle errors gracefully

**4.4.3 Authorization Middleware**
- Check user roles
- Check resource ownership
- Return 403 for denied access
- Combine with authentication

**4.4.4 Route Protection**
- Public routes (no auth)
- Protected routes (auth required)
- Admin-only routes
- Owner-only routes

**Practical Exercises:**

1. **Authentication Middleware (2 hours)**
```javascript
const authenticate = (tokenService) => {
  return async (req, res, next) => {
    try {
      // 1. Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer '

      // 2. Verify token
      const decoded = tokenService.verifyAccessToken(token);

      // 3. Attach user to request
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  };
};

module.exports = authenticate;
```

2. **Authorization Middleware (2 hours)**
```javascript
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Usage examples:
// router.delete('/users/:id', authenticate, authorize(['admin']), deleteUser);
// router.get('/admin/stats', authenticate, authorize(['admin', 'moderator']), getStats);

module.exports = authorize;
```

3. **Resource Ownership Check (1 hour)**
```javascript
const checkProjectOwnership = (projectRepository) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.id || req.params.projectId;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Admins can access everything
      if (userRole === 'admin') {
        return next();
      }

      // Get project
      const project = await projectRepository.findById(projectId);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Check ownership or membership
      if (!project.isOwner(userId) && !project.isMember(userId)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this project'
        });
      }

      // Attach project to request for later use
      req.project = project;
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

4. **Route Protection Examples (1 hour)**
```javascript
const router = express.Router();

// Public routes (no authentication)
router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);

// Protected routes (authentication required)
router.get('/profile', 
  authenticate(tokenService), 
  userController.getProfile
);

router.put('/profile',
  authenticate(tokenService),
  validate(updateProfileSchema),
  userController.updateProfile
);

// Admin-only routes
router.get('/admin/users',
  authenticate(tokenService),
  authorize(['admin']),
  userController.listAll
);

router.delete('/admin/users/:id',
  authenticate(tokenService),
  authorize(['admin']),
  userController.deleteUser
);

// Resource-specific authorization
router.put('/projects/:id',
  authenticate(tokenService),
  checkProjectOwnership(projectRepository),
  validate(updateProjectSchema),
  projectController.update
);

router.delete('/projects/:id',
  authenticate(tokenService),
  authorize(['admin']), // Only admins can delete
  projectController.delete
);
```

**Project Files:**
- `src/presentation/middlewares/authenticate.js`
- `src/presentation/middlewares/authorize.js`
- `src/presentation/middlewares/checkOwnership.js`

**Assignment:**
- Implement all auth/authz middleware
- Protect all routes appropriately
- Add role-based access control
- Test authorization edge cases
- Document permission requirements

**Assessment:**
- Explain difference between authentication and authorization
- Design access control for new feature
- Security review of middleware
- Test authorization scenarios

**Middleware Example:**
```javascript
const authenticate = (tokenService) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const token = authHeader.substring(7);
      const decoded = tokenService.verifyAccessToken(token);

      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };
};
```

---

### **Module 5: Advanced Backend Concepts (Week 9-10)**

#### 5.1 Caching Strategies
**Theory (6 hours):**
- Why caching matters
- Cache invalidation strategies
- Redis fundamentals
- Cache-aside pattern
- Write-through vs Write-behind
- TTL (Time To Live)
- Cache warming

**Practical:**
- Set up Redis
- Implement CacheService
- Add caching to read operations
- Implement cache invalidation
- Monitor cache hit rates

**Project Files:**
- `src/infrastructure/cache/CacheService.js`
- `src/infrastructure/config/redis.config.js`

**Caching Example:**
```javascript
class GetProject {
  async execute(projectId, userId, userRole) {
    // Try cache first
    const cacheKey = `project:${projectId}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      this.logger.debug('Cache hit', { projectId });
      return JSON.parse(cached);
    }

    // Fetch from database
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Check authorization
    if (!project.hasAccess(userId, userRole)) {
      throw new AuthorizationError('Access denied');
    }

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, JSON.stringify(project), 300);

    return project;
  }
}
```

#### 5.2 Logging and Monitoring
**Theory (4 hours):**
- Logging levels (debug, info, warn, error)
- Structured logging
- Winston logger
- Log rotation
- Application monitoring
- Error tracking

**Practical:**
- Set up Winston logger
- Implement structured logging
- Configure log rotation
- Add logging to use cases
- Log rotation strategies

**Project Files:**
- `src/infrastructure/logging/WinstonLogger.js`
- `src/infrastructure/logging/LoggerConfig.js`

#### 5.3 Error Handling
**Theory (4 hours):**
- Error handling strategies
- Custom error classes
- Error middleware in Express
- Operational vs Programmer errors
- Error logging
- User-friendly error messages

**Practical:**
- Create custom error classes
- Implement global error handler
- Handle different error types
- Return appropriate status codes
- Log errors properly

**Project Files:**
- `src/domain/errors/`
- `src/presentation/middlewares/errorHandler.js`

**Error Handler Example:**
```javascript
const errorHandler = (logger) => {
  return (err, req, res, next) => {
    logger.error('Error occurred', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method
    });

    if (err instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (err instanceof NotFoundError) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    if (err instanceof AuthorizationError) {
      return res.status(403).json({
        success: false,
        message: err.message
      });
    }

    // Default to 500
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  };
};
```

#### 5.4 API Security
**Theory (6 hours):**
- CORS (Cross-Origin Resource Sharing)
- Rate limiting
- Helmet for security headers
- Input sanitization
- SQL/NoSQL injection prevention
- XSS protection
- CSRF protection
- Security best practices

**Practical:**
- Configure CORS properly
- Implement rate limiting with Redis
- Add Helmet middleware
- Sanitize inputs
- Prevent injection attacks

**Project Files:**
- `src/main/server.js` (security middleware)

#### 5.5 Audit Logging
**Theory (4 hours):**
- Audit trail importance
- What to audit
- Audit log design
- Compliance requirements
- Querying audit logs

**Practical:**
- Design AuditLog entity
- Create LogActivity use case
- Automatically log important actions
- Query audit logs
- Implement audit endpoints

**Project Files:**
- `src/domain/entities/AuditLog.js`
- `src/application/use-cases/audit/`

---

### **Module 6: API Design & Documentation (Week 11)**

#### 6.1 RESTful API Best Practices
**Theory (6 hours):**
- REST principles
- Resource naming conventions
- HTTP methods proper usage
- Status codes selection
- Pagination strategies
- Filtering and sorting
- API versioning
- HATEOAS concepts

**Practical:**
- Design consistent API endpoints
- Implement pagination
- Add filtering capabilities
- Add sorting options
- Version your API

**API Design Examples:**
```
GET    /api/v1/projects              - List all projects
POST   /api/v1/projects              - Create project
GET    /api/v1/projects/:id          - Get project
PUT    /api/v1/projects/:id          - Update project
DELETE /api/v1/projects/:id          - Delete project
POST   /api/v1/projects/:id/members  - Add member
GET    /api/v1/projects/:id/tasks    - Get project tasks
```

#### 6.2 API Documentation with Swagger
**Theory (4 hours):**
- OpenAPI specification
- Swagger tools
- JSDoc for documentation
- Interactive documentation
- API examples

**Practical:**
- Install swagger-jsdoc and swagger-ui-express
- Document all endpoints with JSDoc
- Generate Swagger UI
- Add request/response examples
- Test APIs through Swagger

**Project Files:**
- `src/presentation/swagger/swaggerConfig.js`
- `src/presentation/swagger/swaggerSchemas.js`

**Swagger Documentation Example:**
```javascript
/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My New Project
 *               description:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, team, public]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
```

#### 6.3 Advanced API Features
**Theory (4 hours):**
- File uploads
- Real-time updates (WebSockets basics)
- Webhooks
- GraphQL vs REST
- API Gateway concepts

**Practical:**
- Implement file upload endpoint
- Add WebSocket for real-time notifications (bonus)
- Create webhook endpoint (bonus)

---

### **Module 7: Testing (Week 12-13)**

#### 7.1 Testing Fundamentals
**Theory (6 hours):**
- Why testing matters
- Testing pyramid (unit, integration, e2e)
- Test-Driven Development (TDD)
- Code coverage metrics
- Testing best practices
- AAA pattern (Arrange, Act, Assert)

**Practical:**
- Set up Jest testing framework
- Write your first test
- Understand test structure
- Use test matchers

#### 7.2 Unit Testing
**Theory (8 hours):**
- Unit testing explained
- Mocking and stubbing
- Test isolation
- Testing pure functions
- Testing async code
- Jest features (describe, it, beforeEach, etc.)

**Practical:**
- Test domain entities
- Test use cases with mocks
- Test services
- Test utility functions
- Achieve high unit test coverage

**Project Files:** `tests/unit/`

**Unit Test Example:**
```javascript
describe('CreateProject Use Case', () => {
  let createProject;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn()
    };
    mockCacheService = {
      del: jest.fn()
    };
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    };

    createProject = new CreateProject({
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger
    });
  });

  it('should create project successfully', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'Test Description'
    };

    const mockProject = {
      id: 'project123',
      ...projectData,
      ownerId: 'user123'
    };

    mockProjectRepository.create.mockResolvedValue(mockProject);

    const result = await createProject.execute(projectData, 'user123');

    expect(result).toEqual(mockProject);
    expect(mockProjectRepository.create).toHaveBeenCalledWith({
      ...projectData,
      ownerId: 'user123',
      members: [],
      status: 'active'
    });
  });

  it('should throw ValidationError for missing name', async () => {
    await expect(
      createProject.execute({}, 'user123')
    ).rejects.toThrow(ValidationError);
  });
});
```

#### 7.3 Integration Testing
**Theory (6 hours):**
- Integration testing explained
- Testing with real database
- Test database setup/teardown
- Supertest for API testing
- Testing authentication flows

**Practical:**
- Set up test database
- Write API integration tests
- Test complete user flows
- Test error scenarios
- Clean up test data

**Project Files:** `tests/integration/`

**Integration Test Example:**
```javascript
describe('Project API', () => {
  let accessToken;
  let userId;

  beforeAll(async () => {
    // Register and login
    const { token, user } = await registerAndLogin();
    accessToken = token;
    userId = user.id;
  });

  describe('POST /api/v1/projects', () => {
    it('should create project successfully', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Project',
          description: 'Test Description'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Project');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/v1/projects')
        .send({ name: 'Test' })
        .expect(401);
    });
  });
});
```

#### 7.4 Test Coverage and Quality
**Theory (4 hours):**
- Coverage metrics explained
- Setting coverage thresholds
- Testing edge cases
- Refactoring for testability
- Continuous testing

**Practical:**
- Generate coverage reports
- Identify untested code
- Write tests for edge cases
- Achieve 70%+ coverage
- Set up coverage gates

**Commands:**
```bash
npm test                    # Run all tests
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm test -- --coverage     # Generate coverage report
```

---

### **Module 8: Performance Optimization (Week 14)**

#### 8.1 Database Optimization
**Theory (4 hours):**
- Query optimization
- Indexing strategies
- N+1 query problem
- Aggregation pipeline
- Database profiling

**Practical:**
- Add indexes to schemas
- Optimize slow queries
- Use aggregation for analytics
- Monitor query performance

#### 8.2 API Performance
**Theory (4 hours):**
- Response compression
- Payload optimization
- Lazy loading
- Pagination best practices
- Request batching

**Practical:**
- Enable compression middleware
- Optimize response payloads
- Implement efficient pagination
- Add request/response logging

#### 8.3 Caching Advanced
**Theory (4 hours):**
- Multi-level caching
- Cache stampede prevention
- Cache warming strategies
- CDN concepts

**Practical:**
- Implement cache warming
- Handle cache failures gracefully
- Monitor cache performance

---

### **Module 9: Deployment & DevOps (Week 15-16)**

#### 9.1 Production Preparation
**Theory (4 hours):**
- Environment management
- Configuration management
- Secret management
- Health checks
- Graceful shutdown

**Practical:**
- Set up environment variables properly
- Configure for different environments
- Implement health check endpoint
- Handle process signals

#### 9.2 Containerization with Docker
**Theory (6 hours):**
- Docker fundamentals
- Dockerfile best practices
- Docker Compose
- Container orchestration basics
- Multi-stage builds

**Practical:**
- Create Dockerfile
- Create docker-compose.yml
- Run application in containers
- Set up development and production configs

**Dockerfile Example:**
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS production
COPY . .
EXPOSE 3000
CMD ["node", "src/main/server.js"]
```

#### 9.3 Deployment Strategies
**Theory (4 hours):**
- Deployment platforms (AWS, Heroku, DigitalOcean)
- CI/CD concepts
- Blue-green deployment
- Rolling updates
- Rollback strategies

**Practical:**
- Deploy to cloud platform
- Set up environment variables
- Configure database connections
- Test production deployment

#### 9.4 Monitoring and Maintenance
**Theory (4 hours):**
- Application monitoring
- Log aggregation
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

**Practical:**
- Set up PM2 for process management
- Configure log rotation
- Add error tracking
- Set up monitoring dashboard

---

## 🛠️ Project Milestones

### Milestone 1: Basic API (After Module 3)
- Express server running
- MongoDB connected
- User registration and login
- Basic CRUD for one entity
- Error handling

### Milestone 2: Complete Backend (After Module 6)
- All entities (User, Project, Task)
- Complete authentication system
- Authorization implemented
- Caching with Redis
- Audit logging
- API documentation

### Milestone 3: Production Ready (After Module 9)
- 70%+ test coverage
- Security hardened
- Documented and deployed
- Monitoring set up
- Performance optimized

---

## 📝 Assignments and Projects

### Weekly Assignments
1. **Week 1-2:** Build a simple Blog API (posts, comments)
2. **Week 3-4:** Add database to Blog API with MongoDB
3. **Week 5-6:** Refactor Blog API to Clean Architecture
4. **Week 7-8:** Add authentication to Blog API
5. **Week 9-10:** Add Redis caching and advanced features
6. **Week 11:** Document your API with Swagger
7. **Week 12-13:** Write comprehensive tests (70%+ coverage)
8. **Week 14:** Optimize and benchmark your API
9. **Week 15-16:** Deploy Blog API to production

### Final Capstone Project
**Task Manager API** (Main Project Throughout Course)

Build from scratch following all concepts:
- User management with roles
- Project management with teams
- Task management with Kanban board
- Dashboard with analytics
- Audit logging
- Complete test coverage (70%+)
- Full documentation
- Production deployment

---

## 📖 Required Tools & Technologies

### Core Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MongoDB 6.x
- **ODM:** Mongoose 8.x
- **Cache:** Redis 7.x
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Testing:** Jest, Supertest
- **Logging:** Winston
- **Documentation:** Swagger (OpenAPI 3.0)

### Development Tools
- **Editor:** VS Code
- **API Testing:** Postman or Thunder Client
- **Git:** Version control
- **Docker:** Containerization
- **MongoDB Compass:** Database GUI

### NPM Packages (Main Dependencies)
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "redis": "^4.6.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "joi": "^17.11.0",
  "winston": "^3.11.0",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "swagger-ui-express": "^5.0.0",
  "compression": "^1.7.4"
}
```

---

## 🎓 Assessment Methods

### Knowledge Checks (Weekly)
- Multiple choice quizzes
- Code review exercises
- Debugging challenges
- Architecture diagrams

### Practical Assessments
- Code assignments (weekly)
- Mini-projects (bi-weekly)
- Code reviews (peer and instructor)
- Final capstone presentation

### Grading Rubric
- **Assignments:** 30%
- **Tests/Quizzes:** 20%
- **Mid-term Project:** 20%
- **Final Capstone:** 30%

**Passing Grade:** 70%

---

## 📚 Additional Resources

### Books
- "Node.js Design Patterns" by Mario Casciaro
- "Clean Architecture" by Robert C. Martin
- "RESTful Web APIs" by Leonard Richardson
- "MongoDB: The Definitive Guide" by Shannon Bradshaw

### Online Resources
- Node.js Official Documentation
- Express.js Documentation
- MongoDB University (free courses)
- Jest Documentation
- Redis Documentation

### Community
- Stack Overflow
- Reddit r/node
- Node.js Discord
- MongoDB Community Forums

---

## 🚀 Career Path After Course

### Junior Backend Developer
- Build and maintain REST APIs
- Work with databases
- Write unit tests
- Fix bugs and implement features

### Mid-level Backend Developer (1-2 years)
- Design API architecture
- Optimize database queries
- Implement caching strategies
- Mentor junior developers

### Senior Backend Developer (3-5 years)
- Design system architecture
- Make technology decisions
- Lead development teams
- Handle scaling challenges

### Potential Specializations
- DevOps Engineer
- Database Administrator
- Solutions Architect
- Full-Stack Developer

---

## 💡 Course Philosophy

### Learning by Building
Every concept is taught through practical implementation in the Task Manager project. You don't just learn theory—you build a real, production-ready application.

### Industry Best Practices
All code follows industry standards:
- Clean Architecture
- SOLID principles
- Comprehensive testing
- Proper documentation
- Security best practices

### Real-World Skills
Focus on skills you'll use in actual jobs:
- Working with real databases
- Handling authentication/authorization
- Writing maintainable code
- Testing and debugging
- Deploying to production

---

## 🎯 Success Criteria

By the end of this bootcamp, you will have:

✅ **Built a production-ready API** with 5000+ lines of well-structured code  
✅ **Achieved 70%+ test coverage** with comprehensive unit and integration tests  
✅ **Documented every endpoint** with interactive Swagger documentation  
✅ **Deployed to production** with proper monitoring and logging  
✅ **Portfolio project** demonstrating professional-level backend skills  
✅ **Deep understanding** of backend architecture and best practices  
✅ **Job-ready skills** for junior to mid-level backend positions  

---

## 📞 Support and Mentorship

### Office Hours
- Live Q&A sessions (2x per week)
- Code review sessions (1x per week)
- One-on-one mentoring (as needed)

### Community Support
- Private Discord channel
- GitHub discussions
- Peer code reviews
- Study groups

### Career Support
- Resume review
- Portfolio building guidance
- Interview preparation
- Job search strategies

---

## 🏆 Certification

Upon successful completion:
- **Backend Engineering Certificate**
- **LinkedIn endorsement**
- **GitHub portfolio with verified projects**
- **Reference letter** (for outstanding students)

---

## 📊 Project Statistics (Reference Implementation)

This curriculum is based on our production-ready Task Manager implementation:

- **Total Lines of Code:** 5,000+
- **Test Coverage:** 78.85%
- **Passing Tests:** 305
- **API Endpoints:** 35+
- **Use Cases:** 35+
- **Domain Entities:** 5
- **Development Phases:** 8
- **Documentation Pages:** 900+

**Architecture Layers:**
- **Domain Layer:** Entities, Enums, Errors, Interfaces
- **Application Layer:** Use Cases, DTOs
- **Infrastructure Layer:** Repositories, Database, Cache, Security, Logging
- **Presentation Layer:** Controllers, Routes, Middleware, Validators

**Key Features:**
- JWT Authentication with Refresh Tokens
- Role-Based Access Control (RBAC)
- Redis Caching
- Winston Logging
- Swagger API Documentation
- Comprehensive Error Handling
- Input Validation with Joi
- Audit Trail System
- Dashboard Analytics

---

*This curriculum is designed to take you from programming basics to professional backend developer in 12-16 weeks of intensive, hands-on learning. Every module builds on the previous one, ensuring deep understanding and practical mastery.*

**Ready to become a Backend Engineer? Let's build something amazing! 🚀**
