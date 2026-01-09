/**
 * Project Entity
 * Represents a project in the system
 */
class Project {
  constructor({
    id,
    name,
    description = '',
    status = 'active',
    visibility = 'team',
    ownerId,
    members = [],
    createdAt = new Date(),
    updatedAt = new Date(),
    createdBy,
    modifiedBy = null,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.visibility = visibility;
    this.ownerId = ownerId;
    this.members = members;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
  }

  /**
   * Check if user is project owner
   */
  isOwner(userId) {
    return this.ownerId.toString() === userId.toString();
  }

  /**
   * Check if user is project member
   */
  isMember(userId) {
    return this.members.some((memberId) => memberId.toString() === userId.toString());
  }

  /**
   * Check if project is active
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * Check if project is public
   */
  isPublic() {
    return this.visibility === 'public';
  }
}

module.exports = Project;
