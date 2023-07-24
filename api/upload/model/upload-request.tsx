export class UploadRequest {
  url: string
  headers: HeadersInit_ | undefined

  data: FormData | undefined

  constructor(url: string, headers: HeadersInit_ | undefined, data: FormData | undefined) {
    this.url = url;
    this.headers = headers;
    this.data = data;
  }
}
