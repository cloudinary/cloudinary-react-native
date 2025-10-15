import { Animated, Easing } from 'react-native';

export class VideoControlsManager {
  private fadeAnim: Animated.Value;
  private autoHideTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.fadeAnim = new Animated.Value(1);
  }

  getFadeAnim() {
    return this.fadeAnim;
  }

  clearAutoHideTimer = () => {
    if (this.autoHideTimeoutId) {
      clearTimeout(this.autoHideTimeoutId);
      this.autoHideTimeoutId = null;
    }
  };

  startAutoHideTimer = (onHide: () => void) => {
    this.clearAutoHideTimer();
    this.autoHideTimeoutId = setTimeout(() => {
      onHide();
      Animated.timing(this.fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }, 3000);
  };

  toggleControls = (
    isControlsVisible: boolean,
    onToggle: (visible: boolean) => void
  ) => {
    const newVisibility = !isControlsVisible;
    onToggle(newVisibility);
    
    Animated.timing(this.fadeAnim, {
      toValue: newVisibility ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (newVisibility) {
      this.startAutoHideTimer(() => onToggle(false));
    } else {
      this.clearAutoHideTimer();
    }
  };

  cleanup = () => {
    this.clearAutoHideTimer();
  };
}
