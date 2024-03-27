import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { upload, explicit, rename } from '../src/uploader';
import { buildRequest, makeRequest } from '../src/uploader_utils';
import { UploadApiOptions } from 'cloudinary-react-native';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'test'
  },
  url: {
    secure: true
  }
});
jest.mock('../src/uploader_utils', () => ({
  buildRequest: jest.fn(),
  makeRequest: jest.fn()
}));

describe('upload function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uploads a file with file path', async () => {
    const filePath = '/path/to/file';

    const options: UploadApiOptions = {
      upload_preset: 'ios_sample',
      unsigned: true,
    }
    await upload(cloudinary, { file: filePath });

    expect(buildRequest).toHaveBeenCalledWith(cloudinary, 'upload', {
      file: filePath,
      headers: {},
      options: {},
      config: null
    });
    expect(makeRequest).toHaveBeenCalled();
  });

  it('uploads a file with Base64 payload', async () => {
    const base64Payload = 'yourBase64StringHere';

    await upload(cloudinary, { file: base64Payload });

    expect(buildRequest).toHaveBeenCalledWith(cloudinary, 'upload', {
      file: base64Payload,
      headers: {},
      options: {},
      config: null
    });
    expect(makeRequest).toHaveBeenCalled();
  });
  it('uploads a file with Base64 payload and custom options', async () => {
    const base64Payload = 'SomeBase64StringMock';
    const customOptions = { folder: 'uploads', tags: ['react', 'native'] };

    await upload(cloudinary, { file: base64Payload, options: customOptions });

    expect(buildRequest).toHaveBeenCalledWith(cloudinary, 'upload', {
      file: base64Payload,
      headers: {},
      options: customOptions,
      config: null
    });
    expect(makeRequest).toHaveBeenCalled();
  });
  it('uploads a file with file path, custom headers, and options', async () => {
    const filePath = '/path/to/file';
    const customHeaders = { Authorization: 'Bearer token' };
    const customOptions = { folder: 'uploads', tags: ['react', 'native'] };

    await upload(cloudinary, { file: filePath, headers: customHeaders, options: customOptions });

    expect(buildRequest).toHaveBeenCalledWith(cloudinary, 'upload', {
      file: filePath,
      headers: expect.objectContaining(customHeaders),
      options: expect.objectContaining(customOptions),
      config: null
    });
    expect(makeRequest).toHaveBeenCalled();
  });
});
describe('rename function', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('renames a file', async () => {
    const from_public_id = 'old_public_id';
    const to_public_id = 'new_public_id';
    const customOptions = { someOption: 'value' };

    await rename(cloudinary, { from_public_id: from_public_id, to_public_id: to_public_id, options: customOptions });

    expect(buildRequest).toHaveBeenCalledWith(cloudinary, 'rename', {
      file: undefined,
      headers: undefined,
      options: expect.objectContaining({
        from_public_id,
        to_public_id,
        someOption: 'value'
      }),
      config: null
    });
    expect(makeRequest).toHaveBeenCalled();
  });
});

describe('explicit function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('requests explicit transformation for a file', async () => {
    const publicId = 'image_public_id';
    const customOptions = { type: 'upload', eager: [{ width: 300, height: 300, crop: 'pad' }] };

    await explicit(cloudinary, { publicId, options: customOptions });

    expect(buildRequest).toHaveBeenCalledWith(cloudinary, 'explicit', {
      headers: undefined,
      options: expect.objectContaining({
        public_id: publicId,
        type: 'upload',
        eager: [{ width: 300, height: 300, crop: 'pad' }]
      }),
      config: null
    });
    expect(makeRequest).toHaveBeenCalled();
  });
});
