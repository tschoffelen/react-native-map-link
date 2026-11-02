# Usage in Expo Apps

These instructions are provided to help you configure your Expo app to work with this library. When using Expo there are two workflows: managed and bare. The instructions for each are slightly different.

## Managed Workflow

Add the plugin to your app's config file (`app.json`, `app.config.js`, or `app.config.ts`) to have it run during prebuild.

```json
{
  "plugins": ["react-native-map-link"]
}
```

## Bare Workflow

### IOS

- See [iOS directions](https://github.com/includable/react-native-map-link#iOSPostInstall).

### Android

- See [Android directions](https://github.com/includable/react-native-map-link#androidPostInstall).

## Rebuild your app

**Don't forget to rebuild your app after making these changes.**

You can usually do so by running `expo build`.

Confirm AndroidManifest.xml has been updated.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.app">
  <queries>
    <intent>
      <action android:name="android.intent.action.VIEW" />
      <data android:scheme="geo" />
    </intent>
    <intent>
      <action android:name="android.intent.action.VIEW" />
      <data android:scheme="waze" />
    </intent>
  </queries>
  <!-- Rest of Manifest -->
</manifest>
```

Also note that this will only work when building your
own [standalone app](https://docs.expo.io/versions/latest/distribution/building-standalone-apps), not when starting your
app through the Expo app in the App Store.
