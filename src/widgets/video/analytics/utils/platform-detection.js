import { Platform } from 'react-native';

export const isMobile = () => {
  // In React Native, we're always on mobile
  return true;
};

export const getPlatform = () => {
  return Platform.OS;
};

export const isIOS = () => {
  return Platform.OS === 'ios';
};

export const isAndroid = () => {
  return Platform.OS === 'android';
}; 