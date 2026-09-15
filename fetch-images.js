const https = require('https');

function fetchIds(query, count) {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/s/photos/${query}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract IDs using regex looking for <a itemprop="contentUrl" href="/photos/..."> or similar
        const regex = /"id":"([a-zA-Z0-9]{11})"/g;
        let match;
        const ids = new Set();
        while ((match = regex.exec(data)) !== null) {
          if (match[1].length === 11) ids.add(match[1]); // Unsplash IDs are typically 11 chars
          if (ids.size >= count) break;
        }
        resolve(Array.from(ids));
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = {
    'wedding-reception': 4,
    'engagement': 2,
    'event-reception': 2,
    'birthday-party': 3,
    'anniversary-party': 2,
    'corporate-event': 3,
    'private-dinner': 3,
    'celebration': 2
  };
  
  const results = {};
  for (const [q, count] of Object.entries(queries)) {
    results[q] = await fetchIds(q, count);
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
