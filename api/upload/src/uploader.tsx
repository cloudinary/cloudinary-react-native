import { APIConfig, apiVersion, defaultResourceType } from "../config/api-config";
import { FormData } from "node-fetch";
import "isomorphic-fetch";

const makeRequest = async (url: string,
  method = 'POST',
  headers: HeadersInit_ | undefined,
  // data: FormData,
  params: Record<string, any>,
  callback: (error: any | null, response: any) => void
) => {
  var config = new APIConfig();
  var url2 = buildUrl(config.uploadPrefix, apiVersion, 'adimizrahi2', defaultResourceType, 'upload');

  // Build payload
  const file = require("../__tests__/.resources/logo.png");
  const data = new FormData();
  data.append('file', file);
  for (const [key, value] of Object.entries(params)) {
    data.append(key, value);
  }


  try {
    const response = await fetch(url2, {
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