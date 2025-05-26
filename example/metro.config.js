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

// 🚫 Exclude nested react-native versions
config.resolver.blockList = exclusionList([
  new RegExp(`${workspaceRoot}/node_modules/react-native/.*`),
]);

module.exports = config;
