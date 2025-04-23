jest.mock('cloudinary-video-analytics');

import VideoAnalyticsAdapter from '../widgets/video/analytics/VideoAnalyticsAdapter';
import {
  CloudinaryVideoAnalytics,
  videoStarted,
  videoPlayed,
  videoPaused,
  videoCompleted,
  updateVideoDuration,
} from 'cloudinary-video-analytics';

describe('VideoAnalyticsAdapter', () => {
  const cloudName = 'demo';
  const publicId = 'sample';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send videoStarted and videoPlayed only once on first play', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });

    adapter.onPlay(1);
    expect(videoStarted).toHaveBeenCalledWith(1);
    expect(videoPlayed).toHaveBeenCalledWith(1);

    adapter.onPlay(2);
    expect(videoStarted).toHaveBeenCalledTimes(1);
    expect(videoPlayed).toHaveBeenCalledWith(2);
  });

  it('should call videoPaused', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });
    adapter.onPause(3);
    expect(videoPaused).toHaveBeenCalledWith(3);
  });

  it('should call videoCompleted', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });
    adapter.onComplete(5);
    expect(videoCompleted).toHaveBeenCalledWith(5);
  });

  it('should only call updateVideoDuration once', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });
    adapter.setVideoDuration(10);
    adapter.setVideoDuration(20); // Should be ignored

    expect(updateVideoDuration).toHaveBeenCalledTimes(1);
    expect(updateVideoDuration).toHaveBeenCalledWith(10);
  });

  it('should not send videoStarted again after the first time', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });

    adapter.onPlay(0);
    adapter.onPlay(5); // second call

    expect(videoStarted).toHaveBeenCalledTimes(1);
  });

  it('should ignore invalid duration values', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });

    adapter.setVideoDuration(0);
    adapter.setVideoDuration(-5);

    expect(updateVideoDuration).not.toHaveBeenCalled();
  });

  it('should allow pause before play', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });

    adapter.onPause(0);

    expect(videoPaused).toHaveBeenCalledWith(0);
  });

  it('should call all analytics events correctly in a full flow', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });

    adapter.setVideoDuration(12);
    adapter.onPlay(0);
    adapter.onPause(5);
    adapter.onPlay(6);
    adapter.onComplete(12);

    expect(updateVideoDuration).toHaveBeenCalledWith(12);
    expect(videoStarted).toHaveBeenCalledTimes(1);
    expect(videoPlayed).toHaveBeenCalledTimes(2);
    expect(videoPaused).toHaveBeenCalledWith(5);
    expect(videoCompleted).toHaveBeenCalledWith(12);
  });

  it('should not call any analytics methods by default', () => {
    const adapter = new VideoAnalyticsAdapter({ cloudName, publicId });
    expect(videoStarted).not.toHaveBeenCalled();
    expect(videoPlayed).not.toHaveBeenCalled();
    expect(videoPaused).not.toHaveBeenCalled();
    expect(videoCompleted).not.toHaveBeenCalled();
    expect(updateVideoDuration).not.toHaveBeenCalled();
  });
});
