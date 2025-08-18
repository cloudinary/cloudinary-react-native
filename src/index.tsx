// Log package import (but not during tests)
if (process.env.NODE_ENV !== 'test' && typeof jest === 'undefined') {
  console.log('📦 [Cloudinary] cloudinary-react-native package imported!');
}

import AdvancedImage from "./AdvancedImage";
import AdvancedVideo from './AdvancedVideo';
export { upload, unsignedUpload, uploadBase64, rename, explicit } from "./api/upload";
export { UploadApiOptions } from './api/upload/model/params/upload-params';

export { AdvancedImage };
export { AdvancedVideo };
