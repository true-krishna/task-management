const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/taskmanager', {
  serverSelectionTimeoutMS: 5000
}).then(async () => {
  const UserSchema = require('./src/infrastructure/database/mongoose/schemas/UserSchema');
  const UserModel = mongoose.model('User', UserSchema);
  
  // Check if admin exists
  const admin = await UserModel.findOne({ email: 'admin@system.com' });
  
  if (admin) {
    console.log('Admin already exists:', admin.email, '- Role:', admin.role);
  } else {
    // Create initial admin
    const hashedPassword = await bcrypt.hash('SuperAdmin123!@#', 10);
    const newAdmin = new UserModel({
      email: 'admin@system.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      isActive: true,
    });
    await newAdmin.save();
    console.log('Initial admin created: admin@system.com / SuperAdmin123!@#');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
