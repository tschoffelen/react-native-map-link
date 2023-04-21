# Usage in Expo apps

In theory, since this library does not contain any native iOS or Android code, it should work out of the box with Expo
apps.

However, on iOS, Apple won't allow apps to open other apps or check if they are installed without first specifying
upfront which apps your app will interact with. You usually do this by adding a `LSApplicationQueriesSchemes` key to
your Info.plist. In an Expo app you won't be able to directly edit Info.plist, but you can do so in a different way:

## Editing app.json

Simply add the following to your Expo app's `app.json` file:

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


## Rebuild your app

**Don't forget to rebuild your app after making this change.**

You can usually do so by running `expo build:ios`.

Also note that this will only work when building your
own [standalone app](https://docs.expo.io/versions/latest/distribution/building-standalone-apps), not when starting your
app through the Expo app in the App Store.
