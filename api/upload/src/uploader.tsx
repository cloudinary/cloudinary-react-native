import { UploadApiOptions } from '../model/params/upload-params';
import { UploadResponseCallback } from '../model/params/upload-response';
import { Cloudinary } from '@cloudinary/url-gen';
import { APIConfig } from '../config/api-config';
import { buildRequest, makeRequest } from './uploader_utils';
export async function upload(cloudinary: Cloudinary, { file, headers = {}, options = {}, config = null, callback }: { file: any, headers?: HeadersInit_, options?: UploadApiOptions, config?: APIConfig | null, callback?: UploadResponseCallback }) {
  const request = await buildRequest(cloudinary, 'upload',{file, headers, options, config})
  return makeRequest(request, callback);

};
export function unsignedUpload(cloudinary: Cloudinary, { file,  upload_preset, headers = {}, options = {}, config = null, callback }: { file: any, upload_preset: string, headers?: HeadersInit_, options?: UploadApiOptions, config?: APIConfig | null, callback?: UploadResponseCallback }) {
  options.upload_preset = upload_preset;
  options.unsigned = true;
  return upload(cloudinary, {file, headers, options, config: config, callback});
}

export function uploadBase64(cloudinary: Cloudinary, { file, headers = {}, options = {}, config = null, callback }: { file: any, headers?: HeadersInit_, options?: UploadApiOptions, config?: APIConfig | null, callback?: UploadResponseCallback }) {
  file = 'data:image/jpeg;base64,' + file;
  return upload(cloudinary, {file, headers, options, config: config, callback});
};

export async function rename(cloudinary: Cloudinary, {from_public_id, to_public_id, options = {}, config = null, callback}: {from_public_id: string, to_public_id:string, options?: UploadApiOptions, config?: APIConfig | null, callback?: UploadResponseCallback}) {
  options.from_public_id = from_public_id;
  options.to_public_id = to_public_id;
  const request = await buildRequest(cloudinary, 'rename',{file: undefined, headers: undefined, options, config})
  return makeRequest(request, callback);
};


