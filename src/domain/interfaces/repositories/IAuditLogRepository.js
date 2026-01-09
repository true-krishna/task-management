/**
 * Audit Log Repository Interface
 */
class IAuditLogRepository {
  async create(_auditLog) {
    throw new Error('Method not implemented');
  }

  async findById(_id) {
    throw new Error('Method not implemented');
  }

  async findByEntityId(_entityId, _entityType) {
    throw new Error('Method not implemented');
  }

  async findByUserId(_userId, _page, _limit) {
    throw new Error('Method not implemented');
  }

  async findAll(_page, _limit, _filters) {
    throw new Error('Method not implemented');
  }
}

module.exports = IAuditLogRepository;
