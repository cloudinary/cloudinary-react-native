import { VideoPlayerAdapter, VideoPlayerType } from './types';
import { ExpoVideoAdapter } from './ExpoVideoAdapter';
import { ExpoAVVideoAdapter } from './ExpoAVVideoAdapter';
import { FallbackVideoAdapter } from './FallbackVideoAdapter';

// Re-export types for external use
export { VideoPlayerType } from './types';

export class VideoPlayerFactory {
  private static adapters: VideoPlayerAdapter[] = [];
  private static initialized = false;

  private static initializeAdapters(): void {
    if (this.initialized) return;

    this.adapters = [
      new ExpoVideoAdapter(),     // Try expo-video first (modern, recommended)
      new ExpoAVVideoAdapter(),   // Fallback to expo-av for compatibility
    ];

    this.initialized = true;
  }

  /**
   * Get the first available video player adapter
   */
  static getAvailableAdapter(): VideoPlayerAdapter {
    this.initializeAdapters();

    // Find the first available adapter
    for (const adapter of this.adapters) {
      const isAvailable = adapter.isAvailable();
      
      if (isAvailable) {
        return adapter;
      }
    }

    // If no adapter is available, return fallback
    return new FallbackVideoAdapter('No video player library found. Install expo-video or expo-av.');
  }

  /**
   * Get a specific adapter by type
   */
  static getAdapterByType(type: VideoPlayerType): VideoPlayerAdapter {
    this.initializeAdapters();

    const adapter = this.adapters.find(adapter => adapter.getAdapterName() === type);
    if (adapter && adapter.isAvailable()) {
      return adapter;
    }

    throw new Error(`Adapter for ${type} is not available`);
  }

  /**
   * Get information about all available adapters
   */
  static getAvailableAdapters(): { name: string; available: boolean }[] {
    this.initializeAdapters();

    return this.adapters.map(adapter => ({
      name: adapter.getAdapterName(),
      available: adapter.isAvailable()
    }));
  }

  /**
   * Check if a specific video player type is available
   */
  static isAdapterAvailable(type: VideoPlayerType): boolean {
    this.initializeAdapters();

    const adapter = this.adapters.find(adapter => adapter.getAdapterName() === type);
    return adapter ? adapter.isAvailable() : false;
  }
}
