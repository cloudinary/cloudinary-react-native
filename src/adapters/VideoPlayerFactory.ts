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
    // Find the first available adapter and collect availability info
    const availabilityInfos: { name: string; info: { isAvailable: boolean; error?: string; installCommand?: string; packageName?: string } }[] = [];

    for (const adapter of this.adapters) {
      const info = typeof (adapter as any).getAvailabilityInfo === 'function'
        ? (adapter as any).getAvailabilityInfo()
        : { isAvailable: adapter.isAvailable() };

      availabilityInfos.push({ name: adapter.getAdapterName(), info });

      if (info.isAvailable) {
        return adapter;
      }
    }

    // Build a helpful, actionable error message listing why adapters are unavailable
    const details = availabilityInfos.map(ai => {
      if (ai.info.isAvailable) return `${ai.name}: available`;
      const parts: string[] = [];
      if (ai.info.error) parts.push(ai.info.error);
      if (ai.info.installCommand) parts.push(`To install: ${ai.info.installCommand}`);
      if (ai.info.packageName && !ai.info.installCommand) parts.push(`Package: ${ai.info.packageName}`);
      return `${ai.name}: ${parts.join(' ').trim()}`.trim();
    }).join('\n\n');

    const message = `No video player library found. Please install one of the supported players:\n\n${details}`;

    return new FallbackVideoAdapter(message);
  }

  /**
   * Get a specific adapter by type
   */
  static getAdapterByType(type: VideoPlayerType): VideoPlayerAdapter {
    this.initializeAdapters();
    const adapter = this.adapters.find(adapter => adapter.getAdapterName() === type);
    if (adapter) {
      const info = typeof (adapter as any).getAvailabilityInfo === 'function'
        ? (adapter as any).getAvailabilityInfo()
        : { isAvailable: adapter.isAvailable() };

      if (info.isAvailable) {
        return adapter;
      }

      const installHint = info.installCommand ? `\nTo fix: ${info.installCommand}` : '';
      const errorMsg = info.error ? `${info.error}${installHint}` : `Adapter for ${type} is not available.${installHint}`;
      throw new Error(errorMsg);
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
   * Return detailed availability info (including install commands) for each adapter.
   */
  static getAdaptersAvailabilityInfo(): { name: string; info: { isAvailable: boolean; error?: string; installCommand?: string; packageName?: string } }[] {
    this.initializeAdapters();

    return this.adapters.map(adapter => ({
      name: adapter.getAdapterName(),
      info: typeof (adapter as any).getAvailabilityInfo === 'function'
        ? (adapter as any).getAvailabilityInfo()
        : { isAvailable: adapter.isAvailable() }
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
