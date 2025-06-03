export const metadataValidator = (metadata) => {
  if (typeof metadata !== 'object') {
    return {
      isValid: false,
      errorMessage: 'Metadata param needs to be an object',
    };
  }

  if (typeof metadata.cloudName !== 'string') {
    return {
      isValid: false,
      errorMessage: 'You need to provide proper cloud name of your Cloudinary account [cloudName: string]',
    };
  }

  if (typeof metadata.type === 'string' && metadata.type !== 'live') {
    return {
      isValid: false,
      errorMessage: 'Property "type" can be either undefined or "live" value [type: "live"]',
    };
  }

  if (typeof metadata.publicId !== 'string') {
    if (metadata.type === 'live') {
      return {
        isValid: false,
        errorMessage: 'You need to provide proper public ID of your Live Stream output [publicId: string]',
      };
    }

    return {
      isValid: false,
      errorMessage: 'You need to provide proper video public ID of your video on your Cloudinary cloud [publicId: string]',
    };
  }

  return {
    isValid: true,
  };
};
