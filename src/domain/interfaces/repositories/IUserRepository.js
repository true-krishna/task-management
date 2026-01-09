/**
 * User Repository Interface
 */
class IUserRepository {
  async findById(_id) {
    throw new Error('Method not implemented');
  }

  async findByEmail(_email) {
    throw new Error('Method not implemented');
  }

  async create(_user) {
    throw new Error('Method not implemented');
  }

  async update(_id, _data) {
    throw new Error('Method not implemented');
  }

  async delete(_id) {
    throw new Error('Method not implemented');
  }

  async findAll(_page, _limit, _search) {
    throw new Error('Method not implemented');
  }

  async findByIds(_ids) {
    throw new Error('Method not implemented');
  }
}

module.exports = IUserRepository;
