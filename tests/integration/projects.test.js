/**
 * Integration Tests for Project Endpoints
 */
const request = require('supertest');
const mongoose = require('mongoose');
const TestHelper = require('../helpers/testHelper');

describe('Project API Integration Tests', () => {
  let testHelper;
  let app;
  let accessToken;
  let userId;
  let secondUserId;
  let secondUserToken;

  beforeAll(async () => {
    testHelper = new TestHelper();
    app = await testHelper.setup();
  });

  afterAll(async () => {
    await testHelper.teardown();
  });

  beforeEach(async () => {
    // Register and login a user before each test
    const userData = await testHelper.registerAndLogin(request, {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    });

    accessToken = userData.accessToken;
    userId = userData.user.id;

    // Register and login second user for member tests
    const secondUserData = await testHelper.registerAndLogin(request, {
      email: 'user2@example.com',
      password: 'Password123!',
      firstName: 'Second',
      lastName: 'User',
    });

    secondUserToken = secondUserData.accessToken;
    secondUserId = secondUserData.user.id;
  });

  afterEach(async () => {
    await testHelper.clearDatabase();
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        visibility: 'private',
      };

      const response = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.project).toHaveProperty('id');
      expect(response.body.data.project.name).toBe(projectData.name);
      expect(response.body.data.project.ownerId).toBe(userId);
      expect(response.body.data.project.visibility).toBe('private');
      expect(response.body.data.project.status).toBe('active');
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'Test' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .send({ name: 'Test Project' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/projects', () => {
    beforeEach(async () => {
      // Create some test projects
      await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project 1', visibility: 'private' });

      await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project 2', visibility: 'team' });

      await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project 3', visibility: 'public', status: 'completed' });
    });

    it('should get all user projects', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.projects).toHaveLength(3);
      expect(response.body.data.pagination).toHaveProperty('total', 3);
    });

    it('should filter projects by status', async () => {
      const response = await request(app)
        .get('/api/v1/projects?status=completed')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.projects).toHaveLength(1);
      expect(response.body.data.projects[0].status).toBe('completed');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/v1/projects?page=1&limit=2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.projects.length).toBeLessThanOrEqual(2);
      expect(response.body.data.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Project', description: 'Description' });

      projectId = createResponse.body.data.project.id;
    });

    it('should get project by id', async () => {
      const response = await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.project.id).toBe(projectId);
      expect(response.body.data.project.name).toBe('Test Project');
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/projects/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 403 for unauthorized access', async () => {
      const response = await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Original Name' });

      projectId = createResponse.body.data.project.id;
    });

    it('should update project', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const response = await request(app)
        .put(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.project.name).toBe(updates.name);
      expect(response.body.data.project.description).toBe(updates.description);
    });

    it('should return 403 if not project owner', async () => {
      const response = await request(app)
        .put(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ name: 'Hacked Name' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    let projectId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'To Delete' });

      projectId = createResponse.body.data.project.id;
    });

    it('should delete project', async () => {
      const response = await request(app)
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify project is deleted
      await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 403 if not project owner', async () => {
      const response = await request(app)
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/projects/:id/members', () => {
    let projectId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Team Project', visibility: 'team' });

      projectId = createResponse.body.data.project.id;
    });

    it('should add member to project', async () => {
      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ userId: secondUserId, role: 'member' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.project.members).toHaveLength(1);
      expect(response.body.data.project.members[0].userId).toBe(secondUserId);
    });

    it('should return 403 if not project owner', async () => {
      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ userId: userId, role: 'member' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/projects/:id/members/:userId', () => {
    let projectId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Team Project' });

      projectId = createResponse.body.data.project.id;

      // Add second user as member
      await request(app)
        .post(`/api/v1/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ userId: secondUserId, role: 'member' });
    });

    it('should remove member from project', async () => {
      const response = await request(app)
        .delete(`/api/v1/projects/${projectId}/members/${secondUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.project.members).toHaveLength(0);
    });

    it('should return 403 if not project owner', async () => {
      const response = await request(app)
        .delete(`/api/v1/projects/${projectId}/members/${secondUserId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
