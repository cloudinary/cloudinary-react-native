import { isHLSVideo, parseHLSManifest, parseHLSQualityLevels, getVideoUrl } from '../utils';
import { SubtitleOption, QualityOption, CLDVideoLayerProps } from '../types';

export async function parseHLSSubtitlesIfNeeded(
  props: Pick<CLDVideoLayerProps, 'videoUrl' | 'cldVideo'>,
  updateState: (updates: any) => void
) {
  const videoUrl = getVideoUrl(props.videoUrl, props.cldVideo);
  
  if (isHLSVideo(videoUrl)) {
    try {
      const subtitleTracks = await parseHLSManifest(videoUrl);
      
      const availableSubtitleTracks: SubtitleOption[] = [
        { code: 'off', label: 'Off' },
        ...subtitleTracks
      ];
      
      updateState({ availableSubtitleTracks });
    } catch (error) {
      console.warn('Failed to parse HLS subtitles:', error);
      updateState({ availableSubtitleTracks: [{ code: 'off', label: 'Off' }] });
    }
  }
}

export async function parseHLSQualityLevelsIfNeeded(
  props: Pick<CLDVideoLayerProps, 'videoUrl' | 'cldVideo'>,
  updateState: (updates: any) => void
) {
  const videoUrl = getVideoUrl(props.videoUrl, props.cldVideo);
  
  if (isHLSVideo(videoUrl)) {
    try {
      const qualityLevels = await parseHLSQualityLevels(videoUrl);
      
      const availableQualityLevels: QualityOption[] = [
        { value: 'auto', label: 'Auto' },
        ...qualityLevels
      ];
      
      updateState({ availableQualityLevels });
    } catch (error) {
      console.warn('Failed to parse HLS quality levels:', error);
      updateState({ availableQualityLevels: [{ value: 'auto', label: 'Auto' }] });
    }
  }
}
