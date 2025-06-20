const REGEX_SEMANTIC_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const NATIVE_VIDEO_PLAYER = 'native';
const ALLOWED_VIDEO_PLAYER_TYPES = [NATIVE_VIDEO_PLAYER, 'cloudinary video player'];

export const getVideoPlayerType = (videoPlayerType) => {
  if (ALLOWED_VIDEO_PLAYER_TYPES.includes(videoPlayerType)) {
    return videoPlayerType;
  }

  return NATIVE_VIDEO_PLAYER;
};

export const getVideoPlayerVersion = (videoPlayerVersion) => {
  if (typeof videoPlayerVersion === 'string' && REGEX_SEMANTIC_VERSION.test(videoPlayerVersion)) {
    return videoPlayerVersion;
  }

  return null;
};
