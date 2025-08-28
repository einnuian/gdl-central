#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Spreadsheet to Print...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
  console.log('✅ Client dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

// Check for credentials file
console.log('\n🔐 Checking Google Sheets API setup...');
if (!fs.existsSync('credentials.json')) {
  console.log('⚠️  credentials.json not found');
  console.log('\n📋 To complete setup, you need to:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing one');
  console.log('3. Enable Google Sheets API');
  console.log('4. Create a service account and download credentials');
  console.log('5. Save the credentials as "credentials.json" in this directory');
} else {
  console.log('✅ credentials.json found');
}

// Check for .env file
console.log('\n⚙️  Checking environment configuration...');
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ .env file created');
  } catch (error) {
    console.log('⚠️  Could not create .env file. Please copy env.example to .env manually');
  }
} else {
  console.log('✅ .env file found');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📖 Next steps:');
console.log('1. Make sure you have credentials.json in the root directory');
console.log('2. Start the server: npm run dev');
console.log('3. Start the client: cd client && npm start');
console.log('4. Open http://localhost:5000 in your browser');
console.log('\n📚 For detailed instructions, see README.md'); 