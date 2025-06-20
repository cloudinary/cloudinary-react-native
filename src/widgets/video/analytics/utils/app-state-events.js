import { AppState } from 'react-native';

export const createAppStateTracker = ({ onAppForeground, onAppBackground }) => {
  let appStateSubscription = null;

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      onAppForeground?.();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      onAppBackground?.();
    }
  };

  // Start tracking immediately if app is active
  if (AppState.currentState === 'active') {
    onAppForeground?.();
  }

  // Subscribe to app state changes
  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  // Return cleanup function
  return () => {
    if (appStateSubscription) {
      appStateSubscription.remove();
    }
  };
}; 