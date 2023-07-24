class NetworkRequest {
    url: string;
    filename: string;
    headers: [string: any];
    params: [string: any];
    //payload:
    //progressCallback:
    //completionCallback: 
    timeout: number;

    constructor(url: string, filename: string, headers: [string: any], params: [string: any], timeout: number) {
        this.url = url;
        this.filename = filename;
        this.headers = headers;
        this.params = params;
        this.timeout = timeout;
    }
}