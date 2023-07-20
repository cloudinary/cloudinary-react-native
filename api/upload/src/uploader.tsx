import { UploadApiOptions } from "../model/params/upload-params";
import { UploadResponseCallback } from "../model/params/upload-response";
import { callApi, uploadFileInChunks } from "./network-delegate";

export function upload({ file, headers = {}, options = {}, callback }: { file: any, headers?: HeadersInit_, options?: UploadApiOptions, callback?: UploadResponseCallback }) {
  return callApi("upload", file, headers, options, callback);
};

export function unsignedUpload({file, upload_preset, headers = {}, options = {}, callback}: {file: string, upload_preset: string, headers?: HeadersInit_, options?: UploadApiOptions, callback?: UploadResponseCallback }) {
  options.upload_preset = upload_preset;
  options.unsigned = true;
  return upload({file, headers, options, callback});
}

export function uploadBase64({ file, headers = {}, options = {}, callback }: { file: string, headers?: HeadersInit_, options?: UploadApiOptions, callback?: UploadResponseCallback }) {
  file = 'data:image/jpeg;base64,' + file;
  return callApi("upload", file, headers, options, callback);
};

export function rename({from_public_id, to_public_id, options = {}, callback}: {from_public_id: string, to_public_id:string, options?: UploadApiOptions, callback?: UploadResponseCallback}) {
  options.from_public_id = from_public_id;
  options.to_public_id = to_public_id;
  return callApi("rename", undefined, undefined, options, callback);
};

export function explicit({public_id , options = {}, callback}: {public_id: string, options?: UploadApiOptions, callback?: UploadResponseCallback}) {
  options.public_id = public_id;
  return callApi("explicit", undefined, undefined, options, callback);
}




export function uploadLarge({ path, headers = {}, options = {}, callback }: { path: string; headers?: HeadersInit_; options?: UploadApiOptions; callback?: UploadResponseCallback}) {
  // if ((path != null) && isRemoteUrl(path)) {
  //   // upload a remote file
  //   upload({file: path, headers, options, callback});
  // }
  // if (path != null && !options.filename) {
  //   options.filename = (path.split(/(\\|\/)/g).pop() || "").replace(/\.[^/.]+$/, "");
  // }

  uploadFileInChunks('upload', path, headers, options, callback);
}
