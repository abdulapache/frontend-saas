#!/usr/bin/env node

/**
 * Quick verification script to check API configuration
 * Run with: npm run verify-api
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 API Configuration Verification\n');

// Check environment files
console.log('📋 Environment Files:');

const envFiles = ['.env.local', '.env.development', '.env.production'];
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const apiUrl = content.match(/NEXT_PUBLIC_API_URL=(.+)/);
    console.log(`✓ ${file} exists`);
    if (apiUrl) {
      console.log(`  → API URL: ${apiUrl[1]}`);
    }
  } else {
    console.log(`✗ ${file} missing`);
  }
});

console.log('\n📝 Environment Variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}`);
console.log(`NEXT_PUBLIC_SIGNALR_URL: ${process.env.NEXT_PUBLIC_SIGNALR_URL || 'not set'}`);

console.log('\n✅ Quick Checklist:');
console.log('1. For local development:');
console.log('   → Use: npm run dev');
console.log('   → API URL will be from .env.development');
console.log('');
console.log('2. For Vercel production:');
console.log('   → Set environment variables in Vercel dashboard');
console.log('   → Redeploy after setting variables');
console.log('');
console.log('3. To test current config:');
console.log('   → Open browser DevTools Console');
console.log('   → Run: console.log(process.env.NEXT_PUBLIC_API_URL)');
console.log('');
console.log('📚 See ENV_SETUP.md for complete instructions\n');
