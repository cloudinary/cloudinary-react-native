import AdvancedVideo from '../../../../AdvancedVideo';
import { getVideoUrl } from '../utils';

export class VideoQualityManager {
  async handleQualityChange(
    qualityValue: string,
    videoRef: React.RefObject<AdvancedVideo | null>,
    state: any,
    updateState: (updates: any) => void,
    props: any
  ) {
    updateState({ currentQuality: qualityValue });
    
    if (qualityValue === 'auto') {
      const originalUrl = getVideoUrl(props.videoUrl, props.cldVideo);
      if (videoRef.current) {
        try {
          await videoRef.current.setStatusAsync({
            uri: originalUrl,
            shouldPlay: state.status?.shouldPlay || false,
            positionMillis: state.status?.positionMillis || 0
          });
        } catch (error) {
          console.warn('Failed to switch to auto quality:', error);
        }
      }
      return;
    }
    
    const selectedQuality = state.availableQualityLevels.find(
      (level: any) => level.value === qualityValue
    );
    
    if (selectedQuality?.url && videoRef.current) {
      try {
        await videoRef.current.setStatusAsync({
          uri: selectedQuality.url,
          shouldPlay: state.status?.shouldPlay || false,
          positionMillis: state.status?.positionMillis || 0
        });
      } catch (error) {
        console.warn('Failed to switch to quality level:', qualityValue, error);
      }
    } else {
      console.warn('No URL found for quality level:', qualityValue);
    }
  }

  handleToggleQualityMenu(isVisible: boolean, updateState: (updates: any) => void) {
    updateState({ isQualityMenuVisible: !isVisible });
  }
}
