import RNFS from 'react-native-fs';
import { upload } from '../src/uploader';
import { UploadApiOptions } from '../model/params/upload-params';

describe("uploader", function () {
  it("should successfully upload file", async function() {
    // @ts-ignore
    global.FormData = require('react-native/Libraries/Network/FormData');
    const extraParams: UploadApiOptions = {
      upload_preset: 'ios_sample',
      unsigned: true
    }
    const callback = jest.fn((error, response) => {
      // expect(error).toBe(mockError); // Assert that the error matches the mock error
      console.log(response)
      console.log(error)
      expect(response).toBeDefined(); // Assert that the response matches the mock response
    });
    // const fileToSend = await RNFS.readFile('__tests__/.resources/logo.png')
    // console.log("file to send:" + fileToSend.length)
    // await upload({ file: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', headers: {'Content-Type': 'multipart/form-data'}, options: extraParams, callback });

    // expect(callback).toHaveBeenCalledTimes(1);
  });
});

const getFilePath = async () => {
  const localFilePath = '__tests__/.resources/logo.png';

  try {
    const fileContent = await RNFS.read(localFilePath);
    console.log('File content:', fileContent);
    // Perform assertions or further processing on the file content
  } catch (error) {
    console.error('Error reading file:', error);
  }
};
