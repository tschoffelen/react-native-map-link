import {Platform, type ImageRequireSource} from 'react-native';
import type {MapId} from './type';

export const isIOS: boolean = Platform.OS === 'ios';

export const generatePrefixes = ({
  alwaysIncludeGoogle,
  naverCallerName,
}: {
  alwaysIncludeGoogle?: boolean;
  naverCallerName?: string;
}): Record<MapId, string> => {
  return {
    'apple-maps': isIOS ? 'maps://' : 'applemaps://',
    'google-maps': prefixForGoogleMaps(alwaysIncludeGoogle),
    citymapper: 'citymapper://',
    uber: 'uber://',
    lyft: 'lyft://',
    transit: 'transit://',
    truckmap: 'truckmap://',
    waze: 'waze://',
    yandex: 'yandexnavi://',
    moovit: 'moovit://directions',
    'yandex-maps': 'yandexmaps://maps.yandex.ru/',
    'yandex-taxi': 'yandextaxi://',
    kakaomap: 'kakaomap://',
    tmap: 'tmap://',
    mapycz: isIOS ? 'szn-mapy://' : 'mapycz://',
    'maps-me': 'mapsme://',
    osmand: isIOS ? 'osmandmaps://' : 'osmand.geo://',
    gett: 'gett://',
    navermap: naverCallerName ? 'nmap://' : 'nmap-disabled://',
    dgis: 'dgis://2gis.ru/',
    liftago: 'lftgpas://',
    petalmaps: 'petalmaps://',
    sygic: 'com.sygic.aura://',
    here: 'here-route://',
  };
};

export const prefixForGoogleMaps = (alwaysIncludeGoogle?: boolean): string => {
  return isIOS && !alwaysIncludeGoogle
    ? 'comgooglemaps://'
    : 'https://www.google.com/maps/';
};

export const generateTitles = (
  titles?: Record<string, string>,
): Record<string, string> => {
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
    tmap: 'TMAP',
    mapycz: 'Mapy.cz',
    'maps-me': 'Maps Me',
    osmand: 'OsmAnd',
    gett: 'Gett',
    navermap: 'Naver Map',
    dgis: '2GIS',
    liftago: 'Liftago',
    petalmaps: 'Petal Maps',
    sygic: 'Sygic',
    here: 'Here We Go',
    ...(titles || {}),
  };
};

export const icons: Record<string, ImageRequireSource> = {
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
  tmap: require('./images/tmap.png'),
  mapycz: require('./images/mapycz.png'),
  'maps-me': require('./images/maps-me.png'),
  osmand: require('./images/osmand.png'),
  gett: require('./images/gett.png'),
  navermap: require('./images/naver-map.png'),
  dgis: require('./images/dgis.png'),
  liftago: require('./images/liftago.png'),
  petalmaps: require('./images/petalmaps.png'),
  sygic: require('./images/sygic.png'),
  here: require('./images/here.png'),
};

export const appKeys: string[] = Object.keys(icons);

export const colorsPopup = {
  black: '#464646',
  gray: '#BBC4CC',
  lightGray: '#ACBBCB',
  lightBlue: '#ECF2F8',
};
