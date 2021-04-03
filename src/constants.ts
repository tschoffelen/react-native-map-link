/**
 * React Native Map Link
 */

import {ImageSourcePropType, Platform} from 'react-native';

export const isIOS = Platform.OS === 'ios';

interface GeneratePrefixesOptions {
  alwaysIncludeGoogle?: boolean;
  naverCallerName?: boolean | string;
}

export function generatePrefixes(options: GeneratePrefixesOptions) {
  return {
    'apple-maps': isIOS ? 'maps://' : 'applemaps://',
    'google-maps': prefixForGoogleMaps(options.alwaysIncludeGoogle),
    citymapper: 'citymapper://',
    uber: 'uber://',
    lyft: 'lyft://',
    transit: 'transit://',
    truckmap: 'truckmap://',
    waze: 'waze://',
    yandex: 'yandexnavi://',
    moovit: 'moovit://',
    'yandex-maps': 'yandexmaps://maps.yandex.ru/',
    'yandex-taxi': 'yandextaxi://',
    kakaomap: 'kakaomap://',
    mapycz: isIOS ? 'szn-mapy://' : 'mapycz://',
    'maps-me': 'mapsme://',
    osmand: isIOS ? 'osmandmaps://' : 'osmand.geo://',
    gett: 'gett://',
    navermap: options.naverCallerName ? 'nmap://' : 'nmap-disabled://',
    dgis: 'dgis://2gis.ru/',
  };
}

export type KnownApp = keyof ReturnType<typeof generatePrefixes>;

export function prefixForGoogleMaps(alwaysIncludeGoogle?: boolean): string {
  return isIOS && !alwaysIncludeGoogle
    ? 'comgooglemaps://'
    : 'https://www.google.com/maps/';
}

export type AppTitles = Record<KnownApp, string>;
export function generateTitles(titles?: Partial<AppTitles>): AppTitles {
  return {
    'apple-maps': 'Apple Maps',
    'google-maps': 'Google Maps',
    citymapper: 'Citymapper',
    uber: 'Uber',
    lyft: 'Lyft',
    transit: 'The Transit App',
    truckmap: 'TruckMap',
    waze: 'Waze',
    yandex: 'Yandex.Navi',
    moovit: 'Moovit',
    'yandex-taxi': 'Yandex Taxi',
    'yandex-maps': 'Yandex Maps',
    kakaomap: 'Kakao Maps',
    mapycz: 'Mapy.cz',
    'maps-me': 'Maps Me',
    osmand: 'OsmAnd',
    gett: 'Gett',
    navermap: 'Naver Map',
    dgis: '2GIS',
    ...(titles || {}),
  };
}

export const icons: Record<KnownApp, ImageSourcePropType> = {
  'apple-maps': require('./images/apple-maps.png'),
  'google-maps': require('./images/google-maps.png'),
  citymapper: require('./images/citymapper.png'),
  uber: require('./images/uber.png'),
  lyft: require('./images/lyft.png'),
  transit: require('./images/transit.png'),
  truckmap: require('./images/truckmap.png'),
  waze: require('./images/waze.png'),
  yandex: require('./images/yandex.png'),
  moovit: require('./images/moovit.png'),
  'yandex-taxi': require('./images/yandex-taxi.png'),
  'yandex-maps': require('./images/yandex-maps.png'),
  kakaomap: require('./images/kakao-map.png'),
  mapycz: require('./images/mapycz.png'),
  'maps-me': require('./images/maps-me.png'),
  osmand: require('./images/osmand.png'),
  gett: require('./images/gett.png'),
  navermap: require('./images/naver-map.png'),
  dgis: require('./images/dgis.png'),
};

export const appKeys = Object.keys(icons) as KnownApp[];
