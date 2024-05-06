import { Platform } from 'react-native';

const getReactNativeVersion = () => {
  try{
    const version = Platform.Version;
    return version.toString();
  } catch {
    return '0.0.0';
  }
};

const getSDKVersion = () => {
  try{
    const SDKVersionPackageJson = require('../../package.json');
    if (SDKVersionPackageJson && SDKVersionPackageJson.version) {
      return SDKVersionPackageJson.version;
    }
  } catch {
    return '0.0.0';
  }
  return '0.0.0';
};

const getOSType = () => {
  switch (Platform.OS) {
    case 'android':
      return 'A';
    case 'ios':
      return 'B';
    default:
      return 'Z';
  }
};

const getOSVersion = () => {
  switch (Platform.OS) {
    case 'android':
      return Platform.Version ? Platform.Version.toString() : 'AA';
    case 'ios':
      return Platform.Version ? Platform.Version.toString() : 'AA';
    default:
      return 'AA';
  }
};

export const SDKAnalyticsConstants = {
  sdkSemver: getSDKVersion(),
  techVersion: getReactNativeVersion(),
  sdkCode: 'P',
  osType: getOSType(),
  osVersion: getOSVersion(),
};
