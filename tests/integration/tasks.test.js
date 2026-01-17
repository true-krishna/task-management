/**
 * Integration Tests for Task Endpoints
 */
const request = require('supertest');
const mongoose = require('mongoose');
const TestHelper = require('../helpers/testHelper');

describe('Task API Integration Tests', () => {
  let testHelper;
  let app;
  let accessToken;
  let userId;
  let projectId;
  let secondUserToken;
  let secondUserId;

  beforeAll(async () => {
    testHelper = new TestHelper();
    app = await testHelper.setup();
  });

  afterAll(async () => {
    await testHelper.teardown();
  });

  beforeEach(async () => {
    // Register and login user
    const userData = await testHelper.registerAndLogin(request, {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    });

    accessToken = userData.accessToken;
    userId = userData.user.id;

    // Register and login second user
    const secondUserData = await testHelper.registerAndLogin(request, {
      email: 'user2@example.com',
      password: 'Password123!',
      firstName: 'User',
      lastName: 'Two',
    });

    secondUserToken = secondUserData.accessToken;
    secondUserId = secondUserData.user.id;

    // Create a project
    const projectResponse = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Project' });

    projectId = projectResponse.body.data.project.id;
  });

  afterEach(async () => {
    await testHelper.clearDatabase();
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        projectId: projectId,
        priority: 'high',
        status: 'not_started',
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task).toHaveProperty('id');
      expect(response.body.data.task.title).toBe(taskData.title);
      expect(response.body.data.task.projectId).toBe(projectId);
      expect(response.body.data.task.priority).toBe('high');
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ projectId: projectId })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'Test', projectId: projectId })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/tasks/project/:projectId', () => {
    beforeEach(async () => {
      // Create test tasks
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task 1', projectId: projectId, priority: 'high', status: 'not_started' });

      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task 2', projectId: projectId, priority: 'low', status: 'in_progress' });

      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task 3', projectId: projectId, priority: 'medium', status: 'done' });
    });

    it('should get all project tasks', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(3);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/project/${projectId}?status=in_progress`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].status).toBe('in_progress');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/project/${projectId}?priority=high`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].priority).toBe('high');
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Test Task', projectId: projectId });

      taskId = createResponse.body.data.task.id;
    });

    it('should get task by id', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.id).toBe(taskId);
      expect(response.body.data.task.title).toBe('Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Original Title', projectId: projectId });

      taskId = createResponse.body.data.task.id;
    });

    it('should update task', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'high',
      };

      const response = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe(updates.title);
      expect(response.body.data.task.priority).toBe(updates.priority);
    });
  });

  describe('PATCH /api/v1/tasks/:id/status', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Test Task', projectId: projectId, status: 'not_started' });

      taskId = createResponse.body.data.task.id;
    });

    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'in_progress' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.status).toBe('in_progress');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/tasks/:id/priority', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Test Task', projectId: projectId, priority: 'low' });

      taskId = createResponse.body.data.task.id;
    });

    it('should update task priority', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/priority`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ priority: 'high' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.priority).toBe('high');
    });
  });

  describe('PATCH /api/v1/tasks/:id/assign', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Test Task', projectId: projectId });

      taskId = createResponse.body.data.task.id;
    });

    it('should assign task to user', async () => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ assigneeId: userId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.assigneeId).toBe(userId);
    });

    it('should unassign task', async () => {
      // First assign
      await request(app)
        .patch(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ assigneeId: userId });

      // Then unassign
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ assigneeId: null })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.assigneeId).toBeNull();
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'To Delete', projectId: projectId });

      taskId = createResponse.body.data.task.id;
    });

    it('should delete task', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify task is deleted
      await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('POST /api/v1/tasks/reorder', () => {
    let task1Id, task2Id, task3Id;

    beforeEach(async () => {
      const t1 = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task 1', projectId: projectId });
      task1Id = t1.body.data.task.id;

      const t2 = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task 2', projectId: projectId });
      task2Id = t2.body.data.task.id;

      const t3 = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Task 3', projectId: projectId });
      task3Id = t3.body.data.task.id;
    });

    it('should reorder tasks', async () => {
      const response = await request(app)
        .post('/api/v1/tasks/reorder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          projectId: projectId,
          taskOrders: [
            { taskId: task3Id, order: 0 },
            { taskId: task1Id, order: 1 },
            { taskId: task2Id, order: 2 },
          ],
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(3);
    });
  });
});
