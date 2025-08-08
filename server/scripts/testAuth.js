const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUsers = {
  client: {
    name: 'Test Client',
    email: 'testclient@example.com',
    password: 'password123'
  },
  admin: {
    name: 'Test Admin',
    email: 'testadmin@example.com',
    password: 'password123'
  },
  superadmin: {
    email: 'superadmin@test.com',
    password: 'password123'
  }
};

let tokens = {};

async function testAuthSystem() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Public signup (should create client)
    console.log('1️⃣ Testing public signup...');
    try {
      const signupResponse = await axios.post(`${API_BASE_URL}/signup`, testUsers.client);
      console.log('✅ Public signup successful:', signupResponse.data.message);
      tokens.client = signupResponse.data.token;
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        console.log('⚠️  Client already exists, trying signin...');
        const signinResponse = await axios.post(`${API_BASE_URL}/signin`, {
          email: testUsers.client.email,
          password: testUsers.client.password
        });
        tokens.client = signinResponse.data.token;
        console.log('✅ Client signin successful');
      } else {
        console.log('❌ Public signup failed:', error.response?.data?.message);
      }
    }

    // Test 2: Superadmin signin
    console.log('\n2️⃣ Testing superadmin signin...');
    try {
      const superadminResponse = await axios.post(`${API_BASE_URL}/signin`, {
        email: testUsers.superadmin.email,
        password: testUsers.superadmin.password
      });
      tokens.superadmin = superadminResponse.data.token;
      console.log('✅ Superadmin signin successful');
    } catch (error) {
      console.log('❌ Superadmin signin failed:', error.response?.data?.message);
      return;
    }

    // Test 3: Test authentication middleware
    console.log('\n3️⃣ Testing authentication middleware...');
    try {
      const authResponse = await axios.get(`${API_BASE_URL}/test-auth`, {
        headers: { Authorization: `Bearer ${tokens.client}` }
      });
      console.log('✅ Authentication middleware working:', authResponse.data.message);
    } catch (error) {
      console.log('❌ Authentication middleware failed:', error.response?.data?.message);
    }

    // Test 4: Test superadmin-only route
    console.log('\n4️⃣ Testing superadmin-only route...');
    try {
      const superadminRouteResponse = await axios.get(`${API_BASE_URL}/test-superadmin`, {
        headers: { Authorization: `Bearer ${tokens.superadmin}` }
      });
      console.log('✅ Superadmin route accessible:', superadminRouteResponse.data.message);
    } catch (error) {
      console.log('❌ Superadmin route failed:', error.response?.data?.message);
    }

    // Test 5: Test client trying to access superadmin route (should fail)
    console.log('\n5️⃣ Testing client accessing superadmin route (should fail)...');
    try {
      await axios.get(`${API_BASE_URL}/test-superadmin`, {
        headers: { Authorization: `Bearer ${tokens.client}` }
      });
      console.log('❌ Client should not access superadmin route');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Client correctly blocked from superadmin route:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message);
      }
    }

    // Test 6: Test superadmin creating admin user
    console.log('\n6️⃣ Testing superadmin creating admin user...');
    try {
      const createUserResponse = await axios.post(`${API_BASE_URL}/create-user`, {
        name: testUsers.admin.name,
        email: testUsers.admin.email,
        password: testUsers.admin.password,
        role: 'admin'
      }, {
        headers: { Authorization: `Bearer ${tokens.superadmin}` }
      });
      console.log('✅ Admin user created successfully:', createUserResponse.data.message);
      
      // Sign in as admin
      const adminSigninResponse = await axios.post(`${API_BASE_URL}/signin`, {
        email: testUsers.admin.email,
        password: testUsers.admin.password
      });
      tokens.admin = adminSigninResponse.data.token;
      console.log('✅ Admin signin successful');
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        console.log('⚠️  Admin already exists, trying signin...');
        const adminSigninResponse = await axios.post(`${API_BASE_URL}/signin`, {
          email: testUsers.admin.email,
          password: testUsers.admin.password
        });
        tokens.admin = adminSigninResponse.data.token;
        console.log('✅ Admin signin successful');
      } else {
        console.log('❌ Admin creation failed:', error.response?.data?.message);
      }
    }

    // Test 7: Test admin trying to create user (should fail)
    console.log('\n7️⃣ Testing admin trying to create user (should fail)...');
    try {
      await axios.post(`${API_BASE_URL}/create-user`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'vendeur'
      }, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      });
      console.log('❌ Admin should not create users');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Admin correctly blocked from creating users:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message);
      }
    }

    // Test 8: Test public signup with role (should ignore role)
    console.log('\n8️⃣ Testing public signup with role (should ignore role)...');
    try {
      const signupWithRoleResponse = await axios.post(`${API_BASE_URL}/signup`, {
        name: 'Test Role Ignore',
        email: 'testrole@example.com',
        password: 'password123',
        role: 'admin' // This should be ignored
      });
      console.log('✅ Public signup with role successful (role ignored):', signupWithRoleResponse.data.user.role);
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        console.log('⚠️  User already exists');
      } else {
        console.log('❌ Public signup with role failed:', error.response?.data?.message);
      }
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAuthSystem();
}

module.exports = { testAuthSystem }; 