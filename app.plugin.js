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
  // eslint-disable-next-line no-shadow
  config = withAndroidManifest(config, async (config) => {
    let intent = config.modResults.manifest.queries[0].intent ?? [];
    // @ts-expect-error unnecessary type gymnastics
    config.modResults.manifest.queries[0].intent = intent.concat(intents);
    return config;
  });

  // eslint-disable-next-line no-shadow
  return withInfoPlist(config, (config) => {
    config.modResults.LSApplicationQueriesSchemes =
      config.modResults.LSApplicationQueriesSchemes?.concat(schemes) ?? schemes;
    return config;
  });
};
