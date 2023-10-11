import { APIConfig, apiVersion, defaultResourceType } from '../config/api-config';
import { process_request_params } from '../utils';
import { UploadRequest } from '../model/upload-request';
import { Cloudinary } from '@cloudinary/url-gen';
import { UploadApiErrorResponse, UploadApiOptions, UploadResponseCallback, UploadApiResponse } from '../model/params/upload-params';
import { callApi } from './network-delegate';

type UrlParameters = {prefix: string, apiVersion: string, cloudName: string, resourceType: string, action: string};
export async function buildRequest(cloudinary: Cloudinary, action: string, { file = undefined, headers = {}, options = {}, config = null }: { file?: any | undefined, headers?: HeadersInit_ | undefined, options?: UploadApiOptions, config?: APIConfig | null}) {
    const apiConfig = createConfiguration(cloudinary, config);
    const url = buildUrl({
      prefix: apiConfig.uploadPrefix,
      apiVersion,
      cloudName: apiConfig.cloudName,
      resourceType: defaultResourceType,
      action: action
    });
    const params = await process_request_params(apiConfig, options)
    const data = buildPayload(file, params);
    const request: UploadRequest = { url, headers, data };
    return request;
}


function createConfiguration(cloudinary: Cloudinary, config: APIConfig | null) {
  const apiConfig = config ?? new APIConfig();
  const cloudName = cloudinary.getConfig().cloud?.cloudName;
  if (cloudName == null) {
    throw new Error('Cloud name is missing in the Cloudinary configuration.');
  }
  apiConfig.cloudName = cloudName
  apiConfig.apiKey = cloudinary.getConfig().cloud?.apiKey ?? null;
  apiConfig.apiSecret = cloudinary.getConfig().cloud?.apiSecret ?? null;
  return apiConfig;
}

function buildUrl({prefix, apiVersion, cloudName, resourceType, action}: UrlParameters) {
  return [prefix, apiVersion, cloudName, resourceType, action].join('/');
}

function buildPayload(file: string | undefined, options: UploadApiOptions) {
  const data = new FormData();
  if(file != undefined) {
    data.append('file', {name: "file", uri: file});
  }
  for (const key in options) {
    data.append(key, options[key]);
  }
  return data;
}

function parseApiResponse(response: any): UploadApiResponse | UploadApiErrorResponse {
  // Check if the response has a "message" property to determine the error response

  if (response.error) {
    return response.error as UploadApiErrorResponse;
  }

  return response as UploadApiResponse;
}

export function makeRequest(request: UploadRequest, callback?: UploadResponseCallback) {
  return callApi(request).then((jsonResponse: any) => {
    const parsedResponse =  parseApiResponse(jsonResponse);
    if (callback !== undefined) {
      if ('message' in parsedResponse) {
        callback(parsedResponse as UploadApiErrorResponse, undefined);
      } else {
        callback(undefined, parsedResponse);
      }
    }
  });
}
