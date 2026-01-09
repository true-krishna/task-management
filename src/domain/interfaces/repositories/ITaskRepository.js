/**
 * Task Repository Interface
 */
class ITaskRepository {
  async findById(_id) {
    throw new Error('Method not implemented');
  }

  async create(_task) {
    throw new Error('Method not implemented');
  }

  async update(_id, _data) {
    throw new Error('Method not implemented');
  }

  async delete(_id) {
    throw new Error('Method not implemented');
  }

  async findByProjectId(_projectId, _filters) {
    throw new Error('Method not implemented');
  }

  async findByAssigneeId(_assigneeId, _page, _limit) {
    throw new Error('Method not implemented');
  }

  async updateMany(_ids, _data) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITaskRepository;
