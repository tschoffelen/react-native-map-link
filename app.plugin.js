// eslint-disable-next-line @typescript-eslint/no-var-requires
const {withAndroidManifest, withInfoPlist} = require('@expo/config-plugins');

const schemes = [
  'comgooglemaps',
  'citymapper',
  'uber',
  'lyft',
  'transit',
  'truckmap',
  'waze',
  'tomtomgo',
  'yandexnavi',
  'moovit',
  'yandextaxi',
  'yandexmaps',
  'kakaomap',
  'tmap',
  'szn-mapy',
  'mapsme',
  'osmandmaps',
  'gett',
  'nmap',
  'dgis',
  'lftgpas',
  'petalmaps',
  'sygic',
  'here-route',
];

const intents = ['geo', 'waze'].map((app) => {
  return {
    action: {$: {'android:name': 'android.intent.action.VIEW'}},
    data: {$: {'android:scheme': app}},
  };
});

/**
 * @type {import('@expo/config-plugins').ConfigPlugin}
 */
module.exports = function withReactNativeMapLink(config) {
  config = withAndroidManifest(config, async (config) => {
    let intent = config.modResults.manifest.queries[0].intent ?? [];
    intents.forEach((newIntent) => {
      const newScheme = newIntent.data.$['android:scheme'];
      const existing = intent.some((intentItem) => {
        const existingScheme =
          intentItem.data?.[0]?.$?.['android:scheme'] ||
          intentItem.data?.$?.['android:scheme'];
        return existingScheme === newScheme;
      });
      if (!existing) {
        intent.push(newIntent);
      }
    });

    config.modResults.manifest.queries[0].intent = intent;
    return config;
  });

  config = withInfoPlist(config, (config) => {
    const existing = config.modResults.LSApplicationQueriesSchemes ?? [];
    schemes.forEach((scheme) => {
      if (!existing.includes(scheme)) {
        existing.push(scheme);
      }
    });

    config.modResults.LSApplicationQueriesSchemes = existing;
    return config;
  });

  return config;
};
