const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://Adam:Adam123@autosparepartsplatform.rvlewlb.mongodb.net/?retryWrites=true&w=majority&appName=AutoSparePartsPlatform';

const superadminUser = {
  name: 'Super Admin',
  email: 'superadmin@test.com',
  password: 'password123',
  role: 'superadmin'
};

async function createSuperadmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperadmin = await User.findOne({ email: superadminUser.email });
    if (existingSuperadmin) {
      console.log('⚠️  Superadmin already exists with email:', superadminUser.email);
      console.log('   You can use these credentials to test:');
      console.log('   Email: superadmin@test.com');
      console.log('   Password: password123');
      return;
    }

    // Create superadmin user
    const superadmin = await User.create(superadminUser);
    
    console.log('✅ Superadmin created successfully:');
    console.log(`   - Name: ${superadmin.name}`);
    console.log(`   - Email: ${superadmin.email}`);
    console.log(`   - Role: ${superadmin.role}`);

    console.log('\n🎯 You can now test the superadmin dashboard with these credentials:');
    console.log('   Email: superadmin@test.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSuperadmin(); 