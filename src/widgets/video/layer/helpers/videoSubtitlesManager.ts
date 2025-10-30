import { fetchSubtitleFile, findActiveSubtitle } from '../utils/subtitleUtils';

export class VideoSubtitlesManager {
  async handleSubtitleChange(
    languageCode: string,
    state: any,
    updateState: (updates: any) => void
  ) {
    updateState({ currentSubtitle: languageCode, activeSubtitleText: null });
    
    if (languageCode === 'off') {
      updateState({ subtitleCues: [], activeSubtitleText: null });
      return;
    }
    
    const selectedTrack = state.availableSubtitleTracks.find(
      (track: any) => track.code === languageCode
    );
    
    if (selectedTrack?.url) {
      try {
        const subtitleCues = await fetchSubtitleFile(selectedTrack.url);
        updateState({ subtitleCues });
      } catch (error) {
        console.warn('Failed to load subtitle file:', error);
        updateState({ subtitleCues: [] });
      }
    } else {
      console.warn('No URL found for subtitle track:', languageCode);
      updateState({ subtitleCues: [] });
    }
  }

  handleToggleSubtitlesMenu(isVisible: boolean, updateState: (updates: any) => void) {
    updateState({ isSubtitlesMenuVisible: !isVisible });
  }

  updateActiveSubtitle(status: any, state: any, updateState: (updates: any) => void) {
    const { subtitleCues, currentSubtitle } = state;
    
    if (currentSubtitle === 'off' || subtitleCues.length === 0 || !status?.isLoaded) {
      if (state.activeSubtitleText !== null) {
        updateState({ activeSubtitleText: null });
      }
      return;
    }
    
    const currentTimeSeconds = (status.positionMillis || 0) / 1000;
    const activeSubtitle = findActiveSubtitle(subtitleCues, currentTimeSeconds);
    const newSubtitleText = activeSubtitle?.text || null;
    
    if (state.activeSubtitleText !== newSubtitleText) {
      updateState({ activeSubtitleText: newSubtitleText });
    }
  }
}
