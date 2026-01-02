#!/usr/bin/env tsx
/**
 * Diagnostic script to check embedding service configuration and connectivity
 */

async function checkEmbeddingService() {
  console.log('🔍 Embedding Service Diagnostic Tool\n');
  console.log('='.repeat(60));
  
  const embeddingServiceUrl = process.env.EMBEDDING_SERVICE_URL;
  const embeddingServiceApiKey = process.env.EMBEDDING_SERVICE_API_KEY;
  
  // Check configuration
  console.log('\n📋 Configuration Check:');
  console.log(`  EMBEDDING_SERVICE_URL: ${embeddingServiceUrl || '❌ NOT SET'}`);
  console.log(`  EMBEDDING_SERVICE_API_KEY: ${embeddingServiceApiKey ? '✅ SET' : '⚠️  NOT SET (service may be open)'}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!embeddingServiceUrl) {
    console.log('\n❌ ERROR: EMBEDDING_SERVICE_URL is not set!');
    console.log('\nTo fix this:');
    console.log('1. Deploy the embedding service to Railway (see embedding-service/DEPLOY.md)');
    console.log('2. Set EMBEDDING_SERVICE_URL in your Vercel environment variables');
    console.log('3. Set EMBEDDING_SERVICE_API_KEY if your service requires authentication');
    process.exit(1);
  }
  
  // Test connectivity
  console.log('\n🌐 Connectivity Test:');
  const baseUrl = embeddingServiceUrl.replace(/\/+$/, '');
  
  // Health check
  try {
    console.log(`  Testing health endpoint: ${baseUrl}/health`);
    const healthResponse = await fetch(`${baseUrl}/health`, {
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`  ✅ Health check passed:`, healthData);
    } else {
      console.log(`  ❌ Health check failed: ${healthResponse.status} ${healthResponse.statusText}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.log(`  ❌ Health check failed: ${error.message}`);
    if (error.name === 'AbortError') {
      console.log('  ⚠️  Request timed out - service may be cold-starting or unreachable');
    }
    process.exit(1);
  }
  
  // Test embedding endpoint
  console.log('\n🧪 Embedding Test:');
  try {
    const testTexts = ['test query'];
    console.log(`  Testing embedding endpoint with: "${testTexts[0]}"`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (embeddingServiceApiKey) {
      headers['Authorization'] = `Bearer ${embeddingServiceApiKey}`;
    }
    
    const embedResponse = await fetch(`${baseUrl}/embed/text`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ texts: testTexts }),
      signal: AbortSignal.timeout(30000), // 30s timeout for first request (cold start)
    });
    
    if (!embedResponse.ok) {
      const errorText = await embedResponse.text();
      console.log(`  ❌ Embedding test failed: ${embedResponse.status} ${embedResponse.statusText}`);
      console.log(`  Response: ${errorText.substring(0, 200)}`);
      
      if (embedResponse.status === 401) {
        console.log('\n  ⚠️  Authentication failed - check EMBEDDING_SERVICE_API_KEY');
      }
      process.exit(1);
    }
    
    const embedData = await embedResponse.json();
    const dimension = embedData.embeddings?.[0]?.length;
    
    if (dimension !== 768) {
      console.log(`  ❌ Wrong dimension: ${dimension} (expected 768)`);
      process.exit(1);
    }
    
    console.log(`  ✅ Embedding test passed:`);
    console.log(`     - Generated ${embedData.count} embedding(s)`);
    console.log(`     - Dimension: ${dimension}D (correct)`);
  } catch (error: any) {
    console.log(`  ❌ Embedding test failed: ${error.message}`);
    if (error.name === 'AbortError') {
      console.log('  ⚠️  Request timed out - service may be cold-starting');
      console.log('  💡 Try again in a few seconds');
    }
    process.exit(1);
  }
  
  console.log('\n✅ All checks passed! Embedding service is configured correctly.');
  console.log('='.repeat(60));
}

checkEmbeddingService().catch((error) => {
  console.error('\n❌ Diagnostic failed:', error);
  process.exit(1);
});

