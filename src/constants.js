/**
 * React Native Map Link
 */
import { Platform } from 'react-native'


export const isIOS = Platform.OS === 'ios'

export function generatePrefixes(options) {
  return {
    'apple-maps': isIOS ? 'http://maps.apple.com/' : 'applemaps://',
    'google-maps': prefixForGoogleMaps(options.alwaysIncludeGoogle),
    citymapper: 'citymapper://',
    uber: 'uber://',
    lyft: 'lyft://',
    transit: 'transit://',
    waze: 'waze://',
    yandex: 'yandexnavi://',
    moovit: 'moovit://',
    'yandex-maps': 'yandexmaps://maps.yandex.ru/'
  }
}

export function prefixForGoogleMaps(alwaysIncludeGoogle) {
  if (isIOS && !alwaysIncludeGoogle) {
    return 'comgooglemaps://'
  }
    
  return isIOS
    ? 'https://www.google.com/maps'
    : 'https://maps.google.com/'
}

export const titles = {
  'apple-maps': 'Apple Maps',
  'google-maps': 'Google Maps',
  citymapper: 'Citymapper',
  uber: 'Uber',
  lyft: 'Lyft',
  transit: 'The Transit App',
  waze: 'Waze',
  yandex: 'Yandex.Navi',
  moovit: 'Moovit',
  'yandex-maps': 'Yandex Maps'
}

export const icons = {
  'apple-maps': require('./images/apple-maps.png'),
  'google-maps': require('./images/google-maps.png'),
  citymapper: require('./images/citymapper.png'),
  uber: require('./images/uber.png'),
  lyft: require('./images/lyft.png'),
  transit: require('./images/transit.png'),
  waze: require('./images/waze.png'),
  yandex: require('./images/yandex.png'),
  moovit: require('./images/moovit.png'),
  'yandex-maps': require('./images/yandex-maps.png')
}
