/**
 * Integration Tests for User Management Endpoints
 */
const request = require('supertest');
const mongoose = require('mongoose');
const TestHelper = require('../helpers/testHelper');

describe('User Management API Integration Tests', () => {
  let testHelper;
  let app;
  let userToken;
  let userId;
  let adminToken;
  let adminId;

  beforeAll(async () => {
    testHelper = new TestHelper();
    app = await testHelper.setup();
  });

  afterAll(async () => {
    await testHelper.teardown();
  });

  beforeEach(async () => {
    // Register and login regular user
    const userData = await testHelper.registerAndLogin(request, {
      email: 'user@example.com',
      password: 'Password123!',
      firstName: 'Regular',
      lastName: 'User',
    });

    userToken = userData.accessToken;
    userId = userData.user.id;

    // Register admin user
    const adminRegisterResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'admin@example.com',
        password: 'Password123!',
        firstName: 'Admin',
        lastName: 'User',
      });

    adminId = adminRegisterResponse.body.data.id;

    // Update admin role manually in database
    const UserModel = require('../../src/infrastructure/database/mongoose/models/UserModel');
    await UserModel.findByIdAndUpdate(adminId, { role: 'admin' });

    // Login as admin to get token
    const adminLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Password123!',
      });

    adminToken = adminLoginResponse.body.data.accessToken;
  });

  afterEach(async () => {
    await testHelper.clearDatabase();
  });

  describe('GET /api/v1/users/profile', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(userId);
      expect(response.body.data.user.email).toBe('user@example.com');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/profile', () => {
    it('should update user profile', async () => {
      const updates = {
        firstName: 'UpdatedFirst',
        lastName: 'UpdatedLast',
        avatar: 'https://example.com/avatar.jpg',
      };

      const response = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.firstName).toBe(updates.firstName);
      expect(response.body.data.user.lastName).toBe(updates.lastName);
      expect(response.body.data.user.avatar).toBe(updates.avatar);
    });

    it('should not allow email update', async () => {
      const response = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'newemail@example.com' })
        .expect(200);

      // Email should remain unchanged
      expect(response.body.data.user.email).toBe('user@example.com');
    });
  });

  describe('GET /api/v1/users (Admin Only)', () => {
    beforeEach(async () => {
      // Create additional users
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'user2@example.com',
          username: 'user2',
          password: 'Password123!',
        });

      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'user3@example.com',
          username: 'user3',
          password: 'Password123!',
        });
    });

    it('should get all users as admin', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThanOrEqual(4);
      expect(response.body.data.pagination).toHaveProperty('total');
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should filter users by role', async () => {
      const response = await request(app)
        .get('/api/v1/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.users.every(u => u.role === 'admin')).toBe(true);
    });

    it('should search users', async () => {
      const response = await request(app)
        .get('/api/v1/users?search=user2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.users.length).toBeGreaterThan(0);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/v1/users?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.users.length).toBeLessThanOrEqual(2);
      expect(response.body.data.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/v1/users/:id (Admin Only)', () => {
    it('should get user by id as admin', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(userId);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/users/:id/role (Admin Only)', () => {
    it('should update user role as admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${userId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'admin' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminId}/role`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ role: 'admin' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid role', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${userId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'invalid_role' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/users/:id/deactivate (Admin Only)', () => {
    it('should deactivate user as admin', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${userId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.isActive).toBe(false);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminId}/deactivate`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should prevent self-deactivation', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${adminId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
