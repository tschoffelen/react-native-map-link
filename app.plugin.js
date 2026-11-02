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
  'outmap',
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
  'dashtagmaps',
  'quest',
];

const intents = ['geo', 'waze'].map((app) => {
  return {
    action: [{$: {'android:name': 'android.intent.action.VIEW'}}],
    data: [{$: {'android:scheme': app}}],
  };
});

/**
 * @type {import('@expo/config-plugins').ConfigPlugin}
 */
module.exports = function withReactNativeMapLink(config) {
  config = withAndroidManifest(config, async (modConfig) => {
    const queries = (modConfig.modResults.manifest.queries ??= []);
    const query = (queries[0] ??= {package: []});
    const packageName = 'org.rajman.neshan.traffic.tehran.navigator';
    if (
      !queries.some((item) =>
        item.package?.some(
          (entry) => entry.$?.['android:name'] === packageName,
        ),
      )
    ) {
      (query.package ??= []).push({$: {'android:name': packageName}});
    }

    let intent = query.intent ?? [];
    intents.forEach((newIntent) => {
      const newScheme = newIntent.data[0].$['android:scheme'];
      const existing = intent.some((intentItem) => {
        const data = Array.isArray(intentItem.data)
          ? intentItem.data
          : [intentItem.data];
        const existingScheme = data[0]?.$?.['android:scheme'];
        return existingScheme === newScheme;
      });
      if (!existing) {
        intent.push(newIntent);
      }
    });

    query.intent = intent;
    return modConfig;
  });

  config = withInfoPlist(config, (modConfig) => {
    const existing = modConfig.modResults.LSApplicationQueriesSchemes ?? [];
    schemes.forEach((scheme) => {
      if (!existing.includes(scheme)) {
        existing.push(scheme);
      }
    });

    modConfig.modResults.LSApplicationQueriesSchemes = existing;
    return modConfig;
  });

  return config;
};
