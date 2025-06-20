const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  'cloudinary-react-native': path.resolve(workspaceRoot),
};

// Enhanced resolver configuration to handle @babel/runtime issues
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Fix for "./construct.js" error with proper path resolution
config.resolver.alias = {
  ...config.resolver.alias,
  './construct.js': path.resolve(__dirname, 'node_modules/@babel/runtime/helpers/construct.js'),
  './construct': path.resolve(__dirname, 'node_modules/@babel/runtime/helpers/construct.js'),
};

// Additional resolver options for better module resolution
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// 🚫 Exclude nested react-native versions
config.resolver.blockList = exclusionList([
  new RegExp(`${workspaceRoot}/node_modules/react-native/.*`),
]);

module.exports = config;
