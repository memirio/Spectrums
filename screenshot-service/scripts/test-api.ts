#!/usr/bin/env tsx
/**
 * Simple API test script
 * Tests the screenshot API endpoints without needing Docker
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

async function testHealth() {
  console.log('Testing /healthz...');
  try {
    const res = await fetch(`${API_URL}/healthz`);
    const data = await res.json();
    console.log('✅ Health check:', data);
    return true;
  } catch (err: any) {
    console.error('❌ Health check failed:', err.message);
    return false;
  }
}

async function testScreenshot(url: string) {
  console.log(`\nTesting screenshot API for: ${url}`);
  
  try {
    const res = await fetch(`${API_URL}/api/screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `test-${Date.now()}`,
      },
      body: JSON.stringify({
        url,
        fullPage: true,
        viewport: { width: 1920, height: 1080 },
      }),
    });

    if (res.status === 202) {
      const data = await res.json();
      console.log('✅ Job queued:', data);
      
      // Poll for status
      let attempts = 0;
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(`${API_URL}${data.statusUrl}`);
        const status = await statusRes.json();
        
        console.log(`Status (attempt ${attempts + 1}):`, status.status);
        
        if (status.status === 'done') {
          console.log('✅ Screenshot ready!', status);
          return true;
        }
        if (status.status === 'error') {
          console.error('❌ Screenshot failed:', status.error);
          return false;
        }
        attempts++;
      }
      console.log('⏳ Timeout waiting for screenshot');
      return false;
    } else {
      const error = await res.text();
      console.error('❌ API error:', res.status, error);
      return false;
    }
  } catch (err: any) {
    console.error('❌ Request failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Screenshot Service API\n');
  console.log(`API URL: ${API_URL}\n`);

  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('\n⚠️  Make sure the API server is running:');
    console.log('   docker-compose up api');
    console.log('   OR');
    console.log('   npm run dev');
    process.exit(1);
  }

  // Test with a simple public website
  const testUrl = process.argv[2] || 'https://example.com';
  await testScreenshot(testUrl);
}

main().catch(console.error);

