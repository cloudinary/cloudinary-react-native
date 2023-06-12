import { APIConfig, apiVersion, defaultResourceType } from "../config/api-config";
import { UploadApiOptions } from "../model/params/upload-params"
import "isomorphic-fetch";

const makeRequest = async (
  file: any,
  method = 'POST',
  headers: HeadersInit_ | undefined,
  options: UploadApiOptions,
  callback: (error: any | null, response: any) => void
) => {
  var config = new APIConfig();
  var url = buildUrl(config.uploadPrefix, apiVersion, 'adimizrahi2', defaultResourceType, 'upload');
console.log(file)
  const data = new FormData();
  data.append('file', file);
  for (const key in options) {
    data.append(key, options[key]);
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: data
    });

    const json = await response.json();
    console.log(json)
    callback(null, json);
  } catch (error) {
    console.error(error);
    callback(error, null);
  }
};

function buildUrl(prefix: string, apiVersion: string, cloudName: string, resourceType: string, action: string) {
  return [prefix, apiVersion, cloudName, resourceType, action].join('/');
}

export { makeRequest }