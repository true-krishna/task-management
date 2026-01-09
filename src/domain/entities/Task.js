/**
 * Task Entity
 * Represents a task in the system
 */
class Task {
  constructor({
    id,
    title,
    description = '',
    projectId,
    assignedTo = null,
    status = 'not_started',
    priority = 'none',
    order = 0,
    dueDate = null,
    createdAt = new Date(),
    updatedAt = new Date(),
    createdBy,
    modifiedBy = null,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.projectId = projectId;
    this.assignedTo = assignedTo;
    this.status = status;
    this.priority = priority;
    this.order = order;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
  }

  /**
   * Check if task is assigned
   */
  isAssigned() {
    return this.assignedTo !== null && this.assignedTo !== undefined;
  }

  /**
   * Check if task is completed
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Check if task is in progress
   */
  isInProgress() {
    return this.status === 'in_progress';
  }

  /**
   * Check if task is high priority
   */
  isHighPriority() {
    return this.priority === 'high';
  }
}

module.exports = Task;
