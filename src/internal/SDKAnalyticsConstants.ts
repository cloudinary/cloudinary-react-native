import { Platform } from 'react-native';

const getReactNativeVersion = () => {
  try{
    const version = Platform.Version;
    return version.toString();
  } catch {
    return "0.0.0"
  }
}

const getSDKVersion = () => {
  try{
    const SDKVersionPackageJson = require('../../package.json')
    if (SDKVersionPackageJson && SDKVersionPackageJson.version) {
      //return SDKVersionPackageJson.version
      return
    }
  } catch {
    return "0.0.0";
  }
  return "0.0.0";
}

export const SDKAnalyticsConstants = {
  sdkSemver: getSDKVersion(),
  techVersion: getReactNativeVersion(),
  sdkCode: 'P'
};
