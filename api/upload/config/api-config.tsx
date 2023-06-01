export const apiVersion = 'v1_1';
export const defaultResourceType = 'image';

export const defaultChunckSize = 20 * 1024 * 1024;
export const defaultTimeout = 60;
export const defaultUploadPrefix = 'https://api.cloudinary.com';

const uploadPrefixKey = 'upload_prefix';
const chunkSizeKey = 'chunk_size';
const readTimeoutKey = 'read_timeout';
const connectionTimeoutKey = 'connect_timeout';
const callbackUrlKey = 'callback_url';

class APIConfig {
    uploadPrefix:   string = defaultUploadPrefix;
    chunkSize:      number = 0;
    timeout:        number = 0;
    callbackUrl:    string = '';
}

export { APIConfig }