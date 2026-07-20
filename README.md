# Cloudinary React Native SDK

[![npm version](https://img.shields.io/npm/v/cloudinary-react-native.svg)](https://www.npmjs.com/package/cloudinary-react-native)
[![license](https://img.shields.io/npm/l/cloudinary-react-native.svg)](https://www.npmjs.com/package/cloudinary-react-native)
[![CI](https://github.com/cloudinary/cloudinary-react-native/actions/workflows/ci.yml/badge.svg)](https://github.com/cloudinary/cloudinary-react-native/actions/workflows/ci.yml)

The `cloudinary-react-native` package is the Cloudinary SDK for React Native and Expo apps. Use it to upload assets from a device and render transformed, optimized images and video in-app through the `AdvancedImage`, `AdvancedVideo`, and `CLDVideoLayer` components. It bundles [`@cloudinary/url-gen`](https://github.com/cloudinary/js-url-gen) as a direct dependency for URL building. The current release (1.3.0) requires React 18 or 19, React Native 0.79 or later, and Expo SDK 50 through 53.

## Installation

```bash
npm install cloudinary-react-native
```

Video playback needs one video backend, auto-detected at runtime: install `expo-video` (recommended, Expo SDK 52+) or `expo-av` (Expo SDK 50-54; deprecated). The `CLDVideoLayer` component also needs `@expo/vector-icons` and `expo-font`:

```bash
npm install expo-video
npm install @expo/vector-icons expo-font
```

## Configuration

This SDK runs on a device and never holds the API secret. Rendering and URL building need only your cloud name, which is safe to ship in the app. Initialize a `Cloudinary` instance from `@cloudinary/url-gen`, using the nested `cloud` config shape:

```ts
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: { cloudName: 'my_cloud_name' },
  url: { secure: true },
});
```

Your cloud name is on the Dashboard of the [Console](https://console.cloudinary.com/console). Uploads from a device use an unsigned upload preset or a signature generated on a server. Keep the API secret out of the app bundle and out of version control — generate signatures server-side with a backend SDK.

## Quick examples

### Render an optimized image

`AdvancedImage` takes a `CloudinaryImage` through the `cldImg` prop and forwards other React Native `Image` props such as `style`. Applying `f_auto` and `q_auto` lets Cloudinary pick the format and quality for the device:

```tsx
import { View } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as qAuto } from '@cloudinary/url-gen/qualifiers/quality';

const cld = new Cloudinary({ cloud: { cloudName: 'demo' } });

const img = cld
  .image('sample')
  .delivery(format(auto()))
  .delivery(quality(qAuto()));
// Delivers https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample

export default function Screen() {
  return (
    <View>
      <AdvancedImage cldImg={img} style={{ width: 300, height: 200 }} />
    </View>
  );
}
```

### Upload a file from the device

`upload(cloudinary, { file, options, callback })` sends a local file URI to Cloudinary. Since the device holds no secret, pass an unsigned upload preset in `options`. The `callback` receives `(error, response)`, where `response` includes `public_id` and `secure_url`:

```ts
import { upload, UploadApiOptions } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({ cloud: { cloudName: 'demo' }, url: { secure: true } });

const options: UploadApiOptions = {
  upload_preset: 'sample_preset',
  unsigned: true,
};

await upload(cld, {
  file: '<LOCAL_FILE_URI>',
  options,
  callback: (error: any, response: any) => {
    if (error) return console.warn(error);
    console.log(response.public_id, response.secure_url);
  },
});
```

### Render a video

`AdvancedVideo` takes a `CloudinaryVideo` through `cldVideo` and styles with `videoStyle`. It needs `expo-video` or `expo-av` installed (auto-detected):

```tsx
import { View } from 'react-native';
import { AdvancedVideo } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({ cloud: { cloudName: 'demo' } });
const video = cld.video('sea_turtle');
// Delivers https://res.cloudinary.com/demo/video/upload/sea_turtle

export default function Screen() {
  return (
    <View>
      <AdvancedVideo cldVideo={video} videoStyle={{ width: 400, height: 220 }} />
    </View>
  );
}
```

## For AI agents

`cloudinary-react-native` is the React Native and Expo SDK: device uploads (`upload`, `unsignedUpload`, `uploadBase64`) and in-app rendering through `AdvancedImage`, `AdvancedVideo`, and `CLDVideoLayer`. Import URL-building symbols (`Cloudinary`, `cld.image()`, `cld.video()`) from `@cloudinary/url-gen`; import components and upload functions from `cloudinary-react-native`. Never embed the API secret — uploads use an unsigned preset or a server-generated signature. For tasks this package doesn't cover, choose a different package:

| Task | Package |
|---|---|
| Fully native iOS app (Swift/Obj-C, no React Native) | [`cloudinary_ios`](https://github.com/cloudinary/cloudinary_ios) |
| Fully native Android app (Kotlin/Java, no React Native) | [`cloudinary_android`](https://github.com/cloudinary/cloudinary_android) |
| Render components in a web React app (not React Native) | [`@cloudinary/react`](https://github.com/cloudinary/frontend-frameworks) |
| Build delivery URLs only, no native components | [`@cloudinary/url-gen`](https://github.com/cloudinary/js-url-gen) |
| Server-side upload, asset administration, signing (holds the API secret) | [`cloudinary_npm`](https://github.com/cloudinary/cloudinary_npm) |
| Run Cloudinary operations as agent tools | [Cloudinary MCP servers](https://github.com/cloudinary/mcp-servers) |

## Links

- [React Native SDK guide](https://cloudinary.com/documentation/react_native_integration)
- [Image transformations in React Native](https://cloudinary.com/documentation/react_native_image_transformations)
- [Upload presets](https://cloudinary.com/documentation/upload_presets)
- [Generating authentication signatures](https://cloudinary.com/documentation/authentication_signatures)
- [Transformation and API references](https://cloudinary.com/documentation/cloudinary_references)
- [Documentation llms.txt index](https://cloudinary.com/documentation/llms.txt)
- [Package on npm](https://www.npmjs.com/package/cloudinary-react-native)

Released under the MIT license.
