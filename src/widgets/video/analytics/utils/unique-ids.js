// React Native compatible UUID generator
const generateUUID = () => {
  // Simple UUID v4 implementation for React Native
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const CLD_ANALYTICS_USER_ID_KEY = 'cld-analytics-user-id';

// Simple in-memory storage for React Native (for now)
let userIdCache = null;

export const getUserId = () => {
  // Check cache first
  if (userIdCache) {
    return userIdCache;
  }

  // Generate new user ID and cache it
  const userId = generateUUID().replace(/-/g, '');
  userIdCache = userId;
  return userId;
};

export const getVideoViewId = () => {
  return generateUUID().replace(/-/g, '');
};
