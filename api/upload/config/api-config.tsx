export const apiVersion = 'v1_1';
export const defaultResourceType = 'image';

export const defaultChunckSize = 20 * 1024 * 1024;
export const defaultTimeout = 60;
export const defaultUploadPrefix = 'https://api.cloudinary.com';

export

const uploadPrefixKey = 'upload_prefix';
const chunkSizeKey = 'chunk_size';
const readTimeoutKey = 'read_timeout';
const connectionTimeoutKey = 'connect_timeout';
const callbackUrlKey = 'callback_url';

var signature_algorithm = "sha1"



class APIConfig {
    uploadPrefix:   string = defaultUploadPrefix;
    chunkSize:      number = 0;
    timeout:        number = 0;
    callbackUrl:    string = '';
    cloudName:      string  = '';
    apiKey:         string | null = '';
    apiSecret:      string | null = '';
}

export { APIConfig }
