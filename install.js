const fs = require('fs');
const path = require('path');

const packageRoot = path.resolve(__dirname, '..', 'dimz-routes-beta');

// Copy route-list.js
const sourceRouteList = path.join(packageRoot, 'publish', 'route-list.js');
const destinationRouteList = path.join(process.cwd(), 'src', 'commands', 'route-list.js');

// Copy config.js
const sourceConfig = path.join(packageRoot, 'publish', 'config.js');
const destinationConfig = path.join(process.cwd(), 'src', 'config', 'config.js');

try {
  // Ensure the destination directories exist
  const destinationRouteListDir = path.dirname(destinationRouteList);
  const destinationConfigDir = path.dirname(destinationConfig);

  if (!fs.existsSync(destinationRouteListDir)) {
    fs.mkdirSync(destinationRouteListDir, { recursive: true });
    console.log('Directory created:', destinationRouteListDir);
  }

  if (!fs.existsSync(destinationConfigDir)) {
    fs.mkdirSync(destinationConfigDir, { recursive: true });
    console.log('Directory created:', destinationConfigDir);
  }

  // Copy files
  fs.copyFileSync(sourceRouteList, destinationRouteList);
  console.log(`File copied successfully from ${sourceRouteList} to ${destinationRouteList}`);

  fs.copyFileSync(sourceConfig, destinationConfig);
  console.log(`File copied successfully from ${sourceConfig} to ${destinationConfig}`);

  // Add "route:list" script to package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts['route:list'] = 'node ./src/commands/route-list.js';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Added "route:list" script to package.json');
} catch (error) {
  console.error('Error:', error.message);
}
