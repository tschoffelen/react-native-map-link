/**
 * React Native Map Link
 */

import { Platform, Alert, ActionSheetIOS, Linking } from 'react-native'

export const isIOS = Platform.OS === 'ios'

export const prefixes = {
  'apple-maps': isIOS ? 'http://maps.apple.com/' : 'applemaps://',
  'google-maps': isIOS ? 'comgooglemaps://' : 'https://www.google.com/maps/dir/',
  'citymapper': 'citymapper://',
  'uber': 'uber://',
  'lyft': 'lyft://',
  'transit': 'transit://',
  'waze': 'waze://',
  'yandex': 'yandexnavi://',
  'moovit': 'moovit://'
}

export const titles = {
  'apple-maps': 'Apple Maps',
  'google-maps': 'Google Maps',
  'citymapper': 'Citymapper',
  'uber': 'Uber',
  'lyft': 'Lyft',
  'transit': 'The Transit App',
  'waze': 'Waze',
  'yandex': 'Yandex.Navi',
  'moovit': 'Moovit'
}

export const icons = {
  'apple-maps': require('../assets/images/apple-maps.png'),
  'google-maps': require('../assets/images/google-maps.png'),
  'citymapper': require('../assets/images/citymapper.png'),
  'uber': require('../assets/images/uber.png'),
  'lyft': require('../assets/images/lyft.png'),
  'transit': require('../assets/images/transit.png'),
  'waze': require('../assets/images/waze.png'),
  'yandex': require('../assets/images/yandex.png'),
  'moovit': require('../assets/images/moovit.png')
}

export const colors = {
  black: '#464646',
  gray: '#BBC4CC',
  lightGray: '#ACBBCB',
  lightBlue: '#ECF2F8'
}
