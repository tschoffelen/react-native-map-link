/**
 * React Native Map Link
 *
 * This file supports both iOS and Android.
 */

import { Platform, Alert, ActionSheetIOS, Linking } from 'react-native'

class MapsException {
  constructor(message) {
    this.message = message
    this.name = 'MapsException'
  }
}

const isIOS = Platform.OS === 'ios'

const apps = [
  'apple-maps',
  'google-maps',
  'citymapper',
  'uber',
  'lyft',
  'navigon',
  'transit',
  'waze',
  'yandex',
  'moovit'
]

const prefixes = {
  'apple-maps': isIOS ? 'http://maps.apple.com/' : 'applemaps://',
  'google-maps': isIOS ? 'comgooglemaps://' : 'https://maps.google.com/',
  'citymapper': 'citymapper://',
  'uber': 'uber://',
  'lyft': 'lyft://',
  'navigon': 'navigon://',
  'transit': 'transit://',
  'waze': 'waze://',
  'yandex': 'yandexnavi://',
  'moovit': 'moovit://'
}

const titles = {
  'apple-maps': 'Apple Maps',
  'google-maps': 'Google Maps',
  'citymapper': 'Citymapper',
  'uber': 'Uber',
  'lyft': 'Lyft',
  'navigon': 'Navigon',
  'transit': 'The Transit App',
  'waze': 'Waze',
  'yandex': 'Yandex.Navi',
  'moovit': 'Moovit'
}

/**
 * Check if a given map app is installed.
 *
 * @param {string} app
 * @returns {Promise<boolean>}
 */
export function isAppInstalled(app) {
  return new Promise((resolve) => {
    if (!(app in prefixes)) {
      return resolve(false)
    }

    Linking.canOpenURL(prefixes[app])
      .then((result) => {
        resolve(!!result)
      })
      .catch(() => resolve(false))
  })
}

/**
 * Ask the user to choose one of the available map apps.
 * @param title
 * @param message
 * @returns {Promise<any>}
 */
export function askAppChoice(title = 'Open in Maps', message = 'What app would you like to use?') {
  return new Promise(async (resolve) => {
    let availableApps = []
    for (let app in prefixes) {
      let avail = await isAppInstalled(app)
      if (avail) {
        availableApps.push(app)
      }
    }
    if (availableApps.length < 2) {
      return resolve(availableApps[0] || null)
    }

    if (isIOS) {
      let options = availableApps.map((app) => titles[app])
      options.push('Cancel')

      ActionSheetIOS.showActionSheetWithOptions({
        title: title,
        message: message,
        options: options,
        cancelButtonIndex: options.length - 1
      }, (buttonIndex) => {
        if (buttonIndex === options.length - 1) {
          return resolve(null)
        }
        return resolve(availableApps[buttonIndex])
      })

      return
    }

    let options = availableApps.map((app) => ({ text: titles[app], onPress: () => resolve(app) }))
    options.push({ text: 'Cancel', onPress: () => resolve(null), style: 'cancel' })
    Alert.alert(title, message, options, { onDismiss: () => resolve(null) })
  })
}

/**
 * Open a maps app, or let the user choose what app to open, with the given location.
 *
 * @param {{
 *     latitude: number | string,
 *     longitude: number | string,
 *     sourceLatitude: number | undefined | null,
 *     sourceLongitude: number | undefined | null,
 *     title: string | undefined | null,
 *     app: string | undefined | null
 * }} options
 */
export async function showLocation(options) {
  if (!options || typeof options !== 'object') {
    throw new MapsException('First parameter of `showLocation` should contain object with options.')
  }
  if (!('latitude' in options) || !('longitude' in options)) {
    throw new MapsException('First parameter of `showLocation` should contain object with at least keys `latitude` and `longitude`.')
  }
  if ('title' in options && options.title && typeof options.title !== 'string') {
    throw new MapsException('Option `title` should be of type `string`.')
  }
  if ('app' in options && options.app && apps.indexOf(options.app) < 0) {
    throw new MapsException('Option `app` should be undefined, null, or one of the following: "' + apps.join('", "') + '".')
  }

  let useSourceDestiny = false
  let sourceLat;
  let sourceLng;
  let sourceLatLng;

  if (('sourceLatitude' in options) && ('sourceLongitude' in options)) {
    useSourceDestiny = true
    sourceLat = parseFloat(options.sourceLatitude)
    sourceLng = parseFloat(options.sourceLongitude)
    sourceLatLng = encodeURIComponent(`${sourceLat},${sourceLng}`)
  }

  let lat = parseFloat(options.latitude)
  let lng = parseFloat(options.longitude)
  let latlng = encodeURIComponent(`${lat},${lng}`)
  let title = options.title && options.title.length ? options.title : null
  let encodedTitle = encodeURIComponent(title)
  let app = options.app && options.app.length ? options.app : null

  if (!app) {
    app = await askAppChoice()
  }

  let url = null

  switch (app) {
    case 'apple-maps':
      url = prefixes['apple-maps']

      // For apple maps, if you pass ?ll + saddr + daddr, no route will be rendered
      url = (useSourceDestiny) ? `${url}?saddr=${sourceLatLng}&daddr=${latlng}` : `${url}?ll=${latlng}`
      url += `&q=${encodeURIComponent(title || 'Location')}`
      break
    case 'google-maps':
      url = prefixes['google-maps'] +
        (isIOS ? `?api=1&ll=${latlng}&q=${encodeURIComponent(title || 'Location')}` : `?q=${latlng}`)

      if (useSourceDestiny) {
        url += `&saddr=${sourceLatLng}&daddr=${latlng}`
      }
      break
    case 'citymapper':
      url = `${prefixes['citymapper']}directions?endcoord=${latlng}`

      if (title) {
        url += `&endname=${encodedTitle}`
      }

      if (useSourceDestiny) {
        url += `&startcoord=${sourceLatLng}`
      }
      break
    case 'uber':
      url = `${prefixes['uber']}?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`

      if (title) {
        url += `&dropoff[nickname]=${encodedTitle}`
      }

      url += (useSourceDestiny) ? `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}` : `&pickup=my_location`

      break
    case 'lyft':
      url = `${prefixes['lyft']}ridetype?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`

      if (useSourceDestiny) {
        url += `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`
      }

      break
    case 'transit':
      url = `${prefixes['transit']}directions?to=${latlng}`

      if (useSourceDestiny) {
        url += `&from=${sourceLatLng}`
      }
      break
    case 'waze':
      url = `${prefixes['waze']}?ll=${latlng}&navigate=yes`
      break
    case 'yandex':
      url = `${prefixes['yandex']}build_route_on_map?lat_to=${lat}&lon_to=${lng}`

      if (useSourceDestiny) {
        url += `&lat_from=${sourceLat}&lon_from=${sourceLng}`
      }
      break
    case 'moovit':
      url = `${prefixes['moovit']}directions?dest_lat=${lat}&dest_lon=${lng}`

      if (title) {
        url += `&dest_name=${encodedTitle}`
      }

      if (useSourceDestiny) {
        url += `&orig_lat=${sourceLat}&orig_lon=${sourceLng}`
      }
      break
  }

  if (url) {
    return Linking.openURL(url)
  }
}
