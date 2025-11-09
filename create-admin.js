/**
 * Script to create an admin user for initial setup
 */
require('dotenv').config();
const container = require('./src/container');
const adminService = container.get('adminService');

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const adminUser = await adminService.createAdminUser({
      email: 'admin@accelerator.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      credits: 1000,
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@accelerator.com');
    console.log('Password: admin123');
    console.log('User ID:', adminUser.id);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
