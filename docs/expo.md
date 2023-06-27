# Usage in Expo Apps

These instructions are provided to help you configure your Expo app to work with this library. When using Expo there are two workflows: managed and bare. The instructions for each are slightly different.

# iOS

## Bare Workflow

See [iOS directions](https://github.com/includable/react-native-map-link#iOSPostInstall).

## Managed Workflow

Add the following to your Expo app's config file. This file is typically named `app.json`, `app.config.js`, or `app.config.ts`.

```js
"ios": {
   "infoPlist": {
      "LSApplicationQueriesSchemes": [
        "comgooglemaps",
        "citymapper",
        "uber",
        "lyft",
        "transit",
        "truckmap",
        "waze",
        "yandexnavi",
        "moovit",
        "yandextaxi",
        "yandexmaps",
        "kakaomap",
        "szn-mapy",
        "mapsme",
        "osmandmaps",
        "gett",
        "nmap",
        "dgis",
        "lftgpas"
      ]
   }
}
```

# Android

## Bare Workflow

See [Android directions](https://github.com/includable/react-native-map-link#androidPostInstall).

## Managed Workflow

Utilize the plugin system to add app `intent`s to Expo `prebuild` step.

### 1. Create a plugin under `src/plugins` named `android-manifest.plugin.js`.

### 2. Add the following code to the plugin file.

```js
const {withAndroidManifest} = require('@expo/config-plugins');

const supportedApps = ['geo', 'waze'];
const mapAppIntents = supportedApps.map((app) => {
  return {
    action: {
      $: {'android:name': 'android.intent.action.VIEW'},
    },
    data: {
      $: {'android:scheme': app},
    },
  };
});

module.exports = function androidManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    const existingIntent = androidManifest.queries[0].intent;

    androidManifest.queries[0].intent = existingIntent.concat(mapAppIntents);

    return config;
  });
};
```

### 3. Add the plugin to your app's config file to have it run during prebuild.

```json
{
  "plugins": ["./src/plugins/android-manifest.plugin.js"]
}
```

## Rebuild your app

**Don't forget to rebuild your app after making these changes.**

You can usually do so by running `expo build`.

Also note that this will only work when building your
own [standalone app](https://docs.expo.io/versions/latest/distribution/building-standalone-apps), not when starting your
app through the Expo app in the App Store.
