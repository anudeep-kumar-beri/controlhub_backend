// Simple API tests for ControlHub backend
// To run: node api.test.js
const axios = require('axios');

const BASE = 'https://controlhub-backend.onrender.com/api';

async function testEndpoint(path, method = 'get', data = undefined) {
  try {
    const res = await axios({
      url: BASE + path,
      method,
      data,
      validateStatus: () => true,
    });
    console.log(`${method.toUpperCase()} ${path}:`, res.status, res.data);
  } catch (err) {
    console.error(`${method.toUpperCase()} ${path} failed:`, err.message);
  }
}

(async () => {
  await testEndpoint('/skills');
  await testEndpoint('/jobs');
  await testEndpoint('/bookmarks');
  await testEndpoint('/journal');
  await testEndpoint('/weeklylogs');
  await testEndpoint('/fileshare');

  // Test POST (example for skills)
  await testEndpoint('/skills', 'post', { name: 'TestSkill', progress: 10, category: 'General' });
  // Test POST (example for jobs)
  await testEndpoint('/jobs', 'post', { role: 'TestRole', status: 'Testing' });
})();
