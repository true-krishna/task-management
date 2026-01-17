const AuditLog = require('../../../../../src/domain/entities/AuditLog');

describe('AuditLog Entity', () => {
  it('should create audit log with all properties', () => {
    const auditLog = new AuditLog({
      id: 'log123',
      entityType: 'project',
      entityId: 'project123',
      action: 'create',
      userId: 'user123',
      changes: { name: 'New Project' },
      createdAt: new Date(),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });

    expect(auditLog.id).toBe('log123');
    expect(auditLog.entityType).toBe('project');
    expect(auditLog.action).toBe('create');
    expect(auditLog.userId).toBe('user123');
  });

  it('should have default values', () => {
    const auditLog = new AuditLog({
      id: 'log123',
      entityType: 'task',
      entityId: 'task123',
      action: 'update',
      userId: 'user123',
    });

    expect(auditLog.changes).toEqual({});
    expect(auditLog.createdAt).toBeInstanceOf(Date);
    expect(auditLog.ipAddress).toBeNull();
    expect(auditLog.userAgent).toBeNull();
  });

  describe('getDescription', () => {
    it('should return human-readable description', () => {
      const auditLog = new AuditLog({
        id: 'log123',
        entityType: 'project',
        entityId: 'project123',
        action: 'create',
        userId: 'user123',
      });

      expect(auditLog.getDescription()).toBe('CREATE project by user');
    });

    it('should uppercase action in description', () => {
      const auditLog = new AuditLog({
        id: 'log123',
        entityType: 'task',
        entityId: 'task123',
        action: 'delete',
        userId: 'user123',
      });

      expect(auditLog.getDescription()).toContain('DELETE');
    });
  });
});
