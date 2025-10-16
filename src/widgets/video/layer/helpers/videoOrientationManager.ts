import { Dimensions } from 'react-native';

export class VideoOrientationManager {
  private orientationSubscription: any = null;
  private orientationCheckInterval: NodeJS.Timeout | null = null;

  initialize(updateState: (updates: any) => void) {
    // Subscribe to orientation changes
    this.orientationSubscription = Dimensions.addEventListener('change', ({ window }: any) => {
      const { width, height } = window;
      const isLandscape = width > height;
      updateState({ isLandscape });
    });
    
    // Also check orientation periodically as fallback
    this.orientationCheckInterval = setInterval(() => {
      const { width, height } = Dimensions.get('window');
      const isLandscape = width > height;
      // Note: We'd need the current state to compare, but this is handled in the component
      updateState({ isLandscape });
    }, 500);
  }

  cleanup() {
    if (this.orientationSubscription && this.orientationSubscription.remove) {
      this.orientationSubscription.remove();
    }
    
    if (this.orientationCheckInterval) {
      clearInterval(this.orientationCheckInterval);
      this.orientationCheckInterval = null;
    }
  }

  async handleToggleFullScreen(
    isFullScreen: boolean,
    isLandscape: boolean,
    fullScreen: any,
    updateState: (updates: any) => void
  ) {
    if (fullScreen?.enabled !== true) {
      return;
    }

    try {
      if (!isFullScreen) {
        const currentOrientation = isLandscape ? 'landscape' : 'portrait';
        updateState({ 
          previousOrientation: currentOrientation,
          isFullScreen: true 
        });

        if (fullScreen?.onEnterFullScreen) {
          fullScreen.onEnterFullScreen();
        }
      } else {
        updateState({ 
          isFullScreen: false,
          previousOrientation: null 
        });

        if (fullScreen?.onExitFullScreen) {
          fullScreen.onExitFullScreen();
        }
      }
    } catch (error) {
      console.warn('Failed to toggle full screen:', error);
    }
  }
}
