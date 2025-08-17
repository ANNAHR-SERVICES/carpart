const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://Adam:Adam123@autosparepartsplatform.rvlewlb.mongodb.net/?retryWrites=true&w=majority&appName=AutoSparePartsPlatform';

const testUsers = [
  {
    name: 'John Client',
    email: 'client@test.com',
    password: 'password123',
    role: 'client'
  },
  {
    name: 'Sarah Vendeur',
    email: 'vendeur@test.com',
    password: 'password123',
    role: 'vendeur'
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Mike Moderateur',
    email: 'moderateur@test.com',
    password: 'password123',
    role: 'moderateur'
  }
];

async function createTestUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });

    // Create new test users
    const createdUsers = await User.create(testUsers);
    
    console.log('✅ Test users created successfully:');
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n🎯 You can now test the sign-in with these credentials:');
    console.log('   Email: client@test.com, vendeur@test.com, admin@test.com, moderateur@test.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestUsers(); 