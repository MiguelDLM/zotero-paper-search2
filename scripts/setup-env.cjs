#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Auto-detect Zotero installation and create cross-platform start scripts
 * Works on Windows, Linux, and macOS
 */

console.log('🔍 Setting up cross-platform Zotero development environment...');

// Common Zotero paths for different operating systems
const commonPaths = {
  win32: [
    'C:\\Program Files\\Zotero\\zotero.exe',
    'C:\\Program Files (x86)\\Zotero\\zotero.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Zotero', 'zotero.exe'),
    path.join(process.env.APPDATA || '', 'Zotero', 'zotero.exe')
  ],
  darwin: [
    '/Applications/Zotero.app/Contents/MacOS/zotero',
    path.join(process.env.HOME || '', 'Applications', 'Zotero.app', 'Contents', 'MacOS', 'zotero')
  ],
  linux: [
    '/usr/bin/zotero',
    '/usr/local/bin/zotero',
    '/snap/bin/zotero',
    '/opt/zotero/zotero',
    path.join(process.env.HOME || '', '.local', 'bin', 'zotero'),
    path.join(process.env.HOME || '', 'bin', 'zotero')
  ]
};

function findZotero() {
  const platform = process.platform;
  const paths = commonPaths[platform] || commonPaths.linux;
  
  // Check environment variable first
  if (process.env.ZOTERO_PLUGIN_ZOTERO_BIN_PATH) {
    if (fs.existsSync(process.env.ZOTERO_PLUGIN_ZOTERO_BIN_PATH)) {
      return process.env.ZOTERO_PLUGIN_ZOTERO_BIN_PATH;
    }
  }
  
  // Check common paths
  for (const zoteroPath of paths) {
    if (fs.existsSync(zoteroPath)) {
      return zoteroPath;
    }
  }
  
  // Try to find using 'which' or 'where' command
  try {
    const command = platform === 'win32' ? 'where zotero' : 'which zotero';
    const result = execSync(command, { encoding: 'utf8' }).trim();
    if (result && fs.existsSync(result)) {
      return result;
    }
  } catch (error) {
    // Command failed, continue with manual search
  }
  
  return null;
}

function updatePackageJson(zoteroPath) {
  const packagePath = 'package.json';
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const platform = process.platform;
  
  // Update scripts based on platform and found path
  if (platform === 'win32') {
    pkg.scripts.start = `set ZOTERO_PLUGIN_ZOTERO_BIN_PATH="${zoteroPath}" && .\\node_modules\\.bin\\zotero-plugin serve`;
  } else {
    pkg.scripts.start = `ZOTERO_PLUGIN_ZOTERO_BIN_PATH="${zoteroPath}" ./node_modules/.bin/zotero-plugin serve`;
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  console.log(`✅ Updated package.json start script for ${platform}`);
}

function createStartScript() {
  const platform = process.platform;
  const zoteroPath = findZotero();
  
  if (!zoteroPath) {
    console.log(`❌ Zotero not found automatically.`);
    console.log(`Please install Zotero or manually set ZOTERO_PLUGIN_ZOTERO_BIN_PATH in .env file.`);
    console.log(`\nCommon installation locations:`);
    
    const paths = commonPaths[platform] || commonPaths.linux;
    paths.forEach(p => console.log(`  - ${p}`));
    
    console.log(`\nYou can also download Zotero from: https://www.zotero.org/download/`);
    return false;
  }
  
  console.log(`✅ Found Zotero at: ${zoteroPath}`);
  
  // Create platform-specific start script
  if (platform === 'win32') {
    const scriptContent = `@echo off
set ZOTERO_PLUGIN_ZOTERO_BIN_PATH="${zoteroPath}"
.\\node_modules\\.bin\\zotero-plugin serve
`;
    fs.writeFileSync('start.bat', scriptContent);
    console.log('✅ Created start.bat for Windows');
  } else {
    const scriptContent = `#!/bin/bash
export ZOTERO_PLUGIN_ZOTERO_BIN_PATH="${zoteroPath}"
./node_modules/.bin/zotero-plugin serve
`;
    fs.writeFileSync('start.sh', scriptContent);
    execSync('chmod +x start.sh');
    console.log('✅ Created start.sh for Unix/Linux');
  }
  
  return true;
}

function main() {
  const success = createStartScript();
  
  if (success) {
    const platform = process.platform;
    console.log('\n🚀 Setup complete! You can now start development with:');
    
    if (platform === 'win32') {
      console.log('   npm start    (or ./start.bat)');
    } else {
      console.log('   npm start    (or ./start.sh)');
    }
    
    console.log('\n📖 Open a PDF in Zotero, select some text, and you should see the search buttons!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { findZotero, createStartScript };
