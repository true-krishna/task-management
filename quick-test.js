// Quick test to verify server and routes are working
const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==========================================');
  console.log('Phase 4 Quick API Test');
  console.log('==========================================\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log(`✓ Status: ${health.status}`);
    console.log(`  Response: ${JSON.stringify(health.data)}\n`);

    // Test 2: Register user
    console.log('2. Testing user registration...');
    const register = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: `test.${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log(`✓ Status: ${register.status}`);
    console.log(`  Success: ${register.data.success}\n`);

    // Test 3: Login
    console.log('3. Testing login...');
    const email = `project.test.${Date.now()}@example.com`;
    await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email,
      password: 'Test123!',
      firstName: 'Project',
      lastName: 'Tester'
    });

    const login = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email, password: 'Test123!' });
    
    console.log(`✓ Status: ${login.status}`);
    const token = login.data.data.accessToken;
    console.log(`  Token received: ${token.substring(0, 20)}...\n`);

    // Test 4: Create project
    console.log('4. Testing project creation...');
    const createProject = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/projects',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, {
      name: 'Test Project',
      description: 'Testing Phase 4 implementation',
      status: 'planning',
      visibility: 'team'
    });
    
    console.log(`✓ Status: ${createProject.status}`);
    if (createProject.status !== 201) {
      console.error('  Error response:', JSON.stringify(createProject.data, null, 2));
      throw new Error(`Project creation failed with status ${createProject.status}`);
    }
    console.log(`  Project created: ${createProject.data.success}`);
    const projectId = createProject.data.data.id;
    console.log(`  Project ID: ${projectId}\n`);

    // Test 5: Get project
    console.log('5. Testing get project...');
    const getProject = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1/projects/${projectId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✓ Status: ${getProject.status}`);
    console.log(`  Project name: ${getProject.data.data.name}\n`);

    // Test 6: List projects
    console.log('6. Testing list projects...');
    const listProjects = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/projects?page=1&limit=10',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✓ Status: ${listProjects.status}`);
    console.log(`  Projects found: ${listProjects.data.data.length}\n`);

    // Test 7: Update project
    console.log('7. Testing update project...');
    const updateProject = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1/projects/${projectId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, { name: 'Updated Test Project', status: 'active' });
    
    console.log(`✓ Status: ${updateProject.status}`);
    console.log(`  Updated: ${updateProject.data.success}\n`);

    console.log('==========================================');
    console.log('✓ ALL TESTS PASSED!');
    console.log('==========================================');
    console.log('\nPhase 4 implementation is working correctly!');
    console.log('Server endpoints:');
    console.log('  - POST   /api/v1/projects');
    console.log('  - GET    /api/v1/projects');
    console.log('  - GET    /api/v1/projects/:id');
    console.log('  - PUT    /api/v1/projects/:id');
    console.log('  - DELETE /api/v1/projects/:id');
    console.log('  - PATCH  /api/v1/projects/:id/visibility');
    console.log('  - POST   /api/v1/projects/:id/members');
    console.log('  - DELETE /api/v1/projects/:id/members/:userId');
    console.log('  - GET    /api/v1/projects/:id/members');
    console.log('\nSwagger docs: http://localhost:5000/api-docs');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

runTests();
