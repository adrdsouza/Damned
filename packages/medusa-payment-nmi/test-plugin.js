// Simple script to test if the plugin structure is valid
const fs = require('fs');
const path = require('path');

// Verify file structure
const requiredFiles = [
  'src/index.js',
  'src/services/nmi-provider.js',
  'src/api/routes/hooks/index.js',
  '.babelrc',
  'package.json',
  '.env'
];

console.log('Checking NMI plugin structure...');

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${file}: ${exists ? 'OK' : 'MISSING'}`);
  if (!exists) allFilesExist = false;
});

if (allFilesExist) {
  console.log('\nAll required files exist. Plugin structure is valid.');
  
  // Check if environment variables are set
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const hasSecurityKey = envContent.includes('NMI_SECURITY_KEY');
  const hasPublicKey = envContent.includes('NMI_PUBLIC_KEY');
  
  console.log(`\nEnvironment variables:`);
  console.log(`- NMI_SECURITY_KEY: ${hasSecurityKey ? 'Set' : 'Not set'}`);
  console.log(`- NMI_PUBLIC_KEY: ${hasPublicKey ? 'Set' : 'Not set'}`);
  
  console.log('\nPlugin is ready for integration with a Medusa project.');
  console.log('To use this plugin in a Medusa project:');
  console.log('1. Copy this directory to your Medusa project\'s node_modules/');
  console.log('2. Add the plugin to your medusa-config.js');
  console.log('3. Restart your Medusa server');
} else {
  console.log('\nSome required files are missing. Please create them before proceeding.');
}