Cloudinary React Native SDK
=========================
[![Build Status](https://api.travis-ci.com/cloudinary/cloudinary-react-native.svg?branch=master)](https://app.travis-ci.com/github/cloudinary/cloudinary-react-native)
## About
The Cloudinary React Native SDK allows you to quickly and easily integrate your application with Cloudinary.
Effortlessly optimize and transform your cloud's assets.

### Note
This Readme provides basic installation and usage information.

## Table of Contents
- [Key Features](#key-features)
- [Version Support](#Version-Support)
- [Installation](#installation)
- [Usage](#usage)
  - [Setup](#Setup)
  - [Transform and Optimize Assets](#Transform-and-Optimize-Assets)
  - [Uploading Assets](#Uploading-Assets)

## Key Features
Transform and optimize assets. Visit our documentation to learn more about [media optimization](https://cloudinary.com/documentation/media_optimization) and [transformations](https://cloudinary.com/documentation/image_transformations).

## Version Support
| SDK Version | React Native Version |
|-------------|----------------------|
| 0.1.0       | > 0.6                |

## Installation
### Install using your favorite package manager (yarn, npm)
```bash
npm install cloudinary-react-native

```
Or
```bash
yarn add cloudinary-react-native --save
```

## Usage
### Setup
The `Cloudinary` class is the main entry point for using the library. Your `cloud_name` is required to create an instance of this class. Your `api_key` and `api_secret` are also needed to perform secure API calls to Cloudinary (e.g., image and video uploads). Setting the configuration parameters can be done either programmatically using an appropriate constructor of the Cloudinary class or globally using an environment variable. You can find your account-specific configuration parameters in the **Dashboard** page of your [account console](https://cloudinary.com/console).

Here's an example of setting configuration parameters in your React Native application:

```js
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
```

### Transform and Optimize Assets
- [See full documentation](https://cloudinary.com/documentation/)

```tsx
import { AdvancedImage } from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';

const myCld = new Cloudinary({
  cloud: {
    cloudName: "demo",
  },
});

let img = myCld.image('sample');

export default function App() {
  return (
    <View style={styles.container}>
      <AdvancedImage cldImg={createMyImage()} style={{width:300, height:200}}/>
    </View>
  );
};
```

### Uploading Assets
The following example performs an unsigned upload of a `string` using the default settings, a request upload callback, and an upload preset (required for unsigned uploads):

```javascript
  const cld = new Cloudinary({
    cloud: {
      cloudName: '<your_cloud_name>'
    },
    url: {
      secure: true
    }
  });

  const options: UploadApiOptions = {
    upload_preset: 'sample_preset',
    unsigned: true,
  }

    await upload(cld, {file: filePath , options: options, callback: (error: any, response: any) => {
        //.. handle response
    }})
```

The uploaded image is assigned a randomly generated public ID, which is returned as part of the response object.
The image is immediately available for download through a CDN:

    cloudinary.image().generate("generatedPublicId")

    http://res.cloudinary.com/<your cloud>/image/upload/generatedPublicId.jpg

You can also specify your own public ID:

```javascript
const options: UploadApiOptions = {
  upload_preset: 'sample_preset',
  publicId: "sample_remote",
}

await upload(cld, {file: filePath , options: options, callback: (error: any, response: any) => {
    //.. handle response
  }})
```

For security reasons, mobile applications cannot contain the full account credentials, and so they cannot freely upload resources to the cloud.
Cloudinary provides two different mechanisms to enable end-users to upload resources without providing full credentials.

##### 1. Unsigned uploads using [Upload Presets.](https://cloudinary.com/documentation/upload_presets)
You can create an upload preset in your Cloudinary account console, defining rules that limit the formats, transformations, dimensions and more.
Once the preset is defined, it's name is supplied when calling upload. An upload call will only succeed if the preset name is used and the resource is within the preset's pre-defined limits.

The following example uploads a local resource, available as a Uri, assuming a preset named 'sample_preset' already exists in the account:

```javascript
  const options: UploadApiOptions = {
  upload_preset: 'sample_preset',
  unsigned: true,
}

await upload(cld, {file: uri , options: options, callback: (error: any, response: any) => {
    //.. handle response
  }})
```

##### 2. Signed uploads with server-generated signature
Another way to upload without including credentials is using signed uploads.
You should generate the upload authentication signature on the server side, where it's safe to store the `api_secret`.
For more information on how to sign upload you can visit our [documentation.](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures)

The Cloudinary React Native SDK allows you to provide a server-generated signature and any additional parameters that were generated on the server side (instead of signing using `api_secret` locally).

Your server can use any Cloudinary libraries (Ruby on Rails, PHP, Python & Django, Java, Perl, .Net, etc.) for generating the signature. The following JSON in an example of a response of an upload authorization request to your server, For more information you can visit our [documentation](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures):
```json
	{
	  "signature": "sgjfdoigfjdgfdogidf9g87df98gfdb8f7d6gfdg7gfd8",
	  "public_id": "abdbasdasda76asd7sa789",
	  "timestamp": 1346925631,
	  "api_key": "123456789012345"
	}
```

Use the signature field to put the signature you got from your server, when using signature api key is required as well as part of the Cloudinary initialization.

```javascript
  const options: UploadApiOptions = {
    upload_preset: 'ios_sample',
    signature: "<your_signature>",
  }
  await upload(cld, {file: filePath , options: options, callback: (error: any, response: any) => {
    //.. handle response
  }})
```

## Contributions
See [contributing guidelines](CONTRIBUTING.md).

## Get Help
If you run into an issue or have a question, you can either:
- [Open a GitHub issue](https://github.com/cloudinary/cloudinary-react-native/issues) (for issues related to the SDK)
- [Open a support ticket](https://cloudinary.com/contact) (for issues related to your account)

## About Cloudinary
Cloudinary is a powerful media API for websites and mobile apps alike, Cloudinary enables developers to efficiently manage, transform, optimize, and deliver images and videos through multiple CDNs. Ultimately, viewers enjoy responsive and personalized visual-media experiences—irrespective of the viewing device.

## Additional Resources
- [Cloudinary Transformation and REST API References](https://cloudinary.com/documentation/cloudinary_references): Comprehensive references, including syntax and examples for all SDKs.
- [MediaJams.dev](https://mediajams.dev/): Bite-size use-case tutorials written by and for Cloudinary Developers.
- [DevJams](https://www.youtube.com/playlist?list=PL8dVGjLA2oMr09amgERARsZyrOz_sPvqw): Cloudinary developer podcasts on YouTube.
- [Cloudinary Academy](https://training.cloudinary.com/): Free self-paced courses, instructor-led virtual courses, and on-site courses.
- [Code Explorers and Feature Demos](https://cloudinary.com/documentation/code_explorers_demos_index): A one-stop shop for all code explorers, Postman collections, and feature demos found in the docs.
- [Cloudinary Roadmap](https://cloudinary.com/roadmap): Your chance to follow, vote, or suggest what Cloudinary should develop next.
- [Cloudinary Facebook Community](https://www.facebook.com/groups/CloudinaryCommunity): Learn from and offer help to other Cloudinary developers.
- [Cloudinary Account Registration](https://cloudinary.com/users/register/free): Free Cloudinary account registration.
- [Cloudinary Website](https://cloudinary.com): Learn about Cloudinary's products, partners, customers, pricing, and more.

## Licence
Released under the MIT license.
