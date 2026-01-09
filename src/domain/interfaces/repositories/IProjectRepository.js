/**
 * Project Repository Interface
 */
class IProjectRepository {
  async findById(_id) {
    throw new Error('Method not implemented');
  }

  async create(_project) {
    throw new Error('Method not implemented');
  }

  async update(_id, _data) {
    throw new Error('Method not implemented');
  }

  async delete(_id) {
    throw new Error('Method not implemented');
  }

  async findByOwnerId(_ownerId, _page, _limit) {
    throw new Error('Method not implemented');
  }

  async findByMemberId(_memberId, _page, _limit) {
    throw new Error('Method not implemented');
  }

  async findAll(_page, _limit) {
    throw new Error('Method not implemented');
  }

  async addMember(_projectId, _userId) {
    throw new Error('Method not implemented');
  }

  async removeMember(_projectId, _userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = IProjectRepository;
