// Node.js script to check health and response time of all backend endpoints
// To run: node api-health-check.js
const axios = require('axios');

const BASE = 'https://controlhub-backend.onrender.com/api';
const endpoints = [
  '/skills',
  '/jobs',
  '/bookmarks',
  '/journal',
  '/weeklylogs',
  '/fileshare',
];

(async () => {
  for (const ep of endpoints) {
    const url = BASE + ep;
    const start = Date.now();
    try {
      const res = await axios.get(url, { timeout: 15000 });
      const ms = Date.now() - start;
      console.log(`${ep}: ${res.status} (${ms}ms)`);
    } catch (err) {
      const ms = Date.now() - start;
      if (err.response) {
        console.log(`${ep}: ${err.response.status} (${ms}ms)`);
      } else {
        console.log(`${ep}: ERROR (${ms}ms) - ${err.message}`);
      }
    }
  }
})();
