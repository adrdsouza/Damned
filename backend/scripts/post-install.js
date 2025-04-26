/**
 * Post-install script to replace vulnerable axios packages
 * This replaces nested axios 0.21.4 installations with 1.9.0
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Running security post-install script...');

// Paths to check for vulnerable axios
const pathsToCheck = [
  'node_modules/@medusajs/telemetry/node_modules/axios',
  'node_modules/@medusajs/cli/node_modules/axios',
  'node_modules/@medusajs/framework/node_modules/axios',
  'node_modules/@medusajs/test-utils/node_modules/axios'
];

let patchCount = 0;

// Check and patch vulnerable axios installations
pathsToCheck.forEach(axiosPath => {
  const fullPath = path.resolve(__dirname, '..', axiosPath);
  const packageJsonPath = path.join(fullPath, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    // Check the version
    try {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      
      if (packageJson.version !== '1.9.0') {
        console.log(`🔍 Found axios v${packageJson.version} in ${axiosPath}`);
        
        // Replace the package.json
        packageJson.version = '1.9.0';
        fs.writeFileSync(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2)
        );
        
        console.log(`✅ Patched ${axiosPath} to version 1.9.0`);
        patchCount++;
      }
    } catch (error) {
      console.error(`❌ Error patching ${axiosPath}:`, error.message);
    }
  }
});

console.log(`🔒 Security post-install completed. Patched ${patchCount} vulnerable dependencies.`);