const CUSTOMER_DATA_CHARS_LIMIT = 1000;

const filterOutNonStrings = (data) => {
  return Array.from({ length: 5 }).reduce((obj, cv, currentIndex) => {
    const key = `customData${currentIndex + 1}`;

    if (typeof data[key] === 'string') {
      obj[key] = data[key];
    }

    return obj;
  }, {})
};

export const parseCustomData = (customData) => {
  const data = typeof customData === 'function' ? customData() : customData;

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const filteredData = filterOutNonStrings(data);
    return Object.keys(filteredData).length > 0 ? filteredData : null;
  }

  return null;
}

export const isCustomDataValid = (customData) => {
  if (customData === null) {
    return false;
  }

  const stringifiedValue = JSON.stringify(customData);
  return stringifiedValue.length <= CUSTOMER_DATA_CHARS_LIMIT;
};

export const useCustomerVideoDataFallback = (videoUrl, fallback) => {
  try {
    const result = fallback(videoUrl);
    return {
      cloudName: result.cloudName,
      publicId: result.publicId,
    };
  } catch (e) {
    return null;
  }
};

export const parseCustomerVideoData = (data) => {
  if (
    data !== null &&
    typeof data === 'object' &&
    typeof data.cloudName === 'string' &&
    data.cloudName &&
    typeof data.publicId === 'string' &&
    data.publicId
  ) {
    return {
      cloudName: data.cloudName,
      publicId: data.publicId,
    };
  }

  return null;
};
