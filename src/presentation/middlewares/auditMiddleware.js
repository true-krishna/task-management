/**
 * Audit Log Middleware
 * Automatically creates audit logs for specific actions
 */

/**
 * Middleware to capture audit information and make it available to controllers
 */
function auditMiddleware(req, res, next) {
  // Capture IP address
  req.auditInfo = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent') || null,
  };

  // Capture original send function
  const originalSend = res.send;

  // Override send to capture response data for audit logging
  res.send = function(data) {
    res.locals.responseData = data;
    originalSend.call(this, data);
  };

  next();
}

/**
 * Helper function to log activity
 * Call this from controllers after successful operations
 */
async function logActivity(logActivityUseCase, entityType, entityId, action, userId, changes, auditInfo) {
  try {
    await logActivityUseCase.execute({
      entityType,
      entityId,
      action,
      userId,
      changes,
      ipAddress: auditInfo?.ipAddress || null,
      userAgent: auditInfo?.userAgent || null,
    });
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('Failed to create audit log:', error.message);
  }
}

module.exports = {
  auditMiddleware,
  logActivity,
};
