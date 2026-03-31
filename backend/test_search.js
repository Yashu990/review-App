async function testSearch() {
  const query = 'Newavatara';
  const url = 'http://localhost:7500/api/business/search-places';
  
  console.log(`Sending test request to: ${url}`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    });
    
    console.log(`HTTP Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response first 100 chars: ${text.substring(0, 100)}`);
    try {
      const json = JSON.parse(text);
      console.log(`Results Found: ${json.length || 0}`);
    } catch (je) {
      console.error(`ERROR parsing response as JSON: ${je.message}`);
    }
  } catch (e) {
    console.error(`FETCH ERROR: ${e.message}`);
  }
}

testSearch();
