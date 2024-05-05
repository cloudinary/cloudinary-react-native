// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const packagePath = "../";

config.resolver.nodeModulesPaths.push(packagePath);

config.watchFolders.push(packagePath);

module.exports = config;
