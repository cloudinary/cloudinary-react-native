import "isomorphic-fetch";
import { UploadRequest } from "../model/upload-request";

async function callApi(request: UploadRequest) {
  try {
    const response = await fetch(request.url, {
      method: 'POST',
      headers: request.headers,
      body: request.data,
    },);
    const jsonResponse = await response.json();
    return Promise.resolve(jsonResponse)
  } catch (error) {
    return Promise.resolve(error)
}
}
export { callApi }
