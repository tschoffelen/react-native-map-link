/**
 * React Native Map Link
 */

import { Linking, ActionSheetIOS, Alert } from 'react-native'

import { prefixes, titles, isIOS } from './constants'

/**
 * Get available navigation apps.
 */
export const getAvailableApps = async () => {
  let availableApps = []
  for (let app in prefixes) {
    if (!prefixes.hasOwnProperty(app)) {
      continue
    }
    let avail = await isAppInstalled(app)
    if (avail) {
      availableApps.push(app)
    }
  }

  return availableApps
}

/**
 * Check if a given map app is installed.
 *
 * @param {string} app
 * @returns {Promise<boolean>}
 */
function isAppInstalled (app) {
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
 * Check if a given app is supported by this library
 *
 * @param {string} app
 * @returns {boolean}
 */
function isSupportedApp(app) {
  return Object.keys(titles).includes(app)
}

/**
 * Get a list of not supported apps from a given array of apps
 *
 * @param {array} apps
 * @returns {array} 
 */
function getNotSupportedApps(apps) {
  return apps.filter(app => !isSupportedApp(app))
}

/**
 * Throws an exception if some of the given apps is not supported
 *
 * @param {array} apps
 */
export function checkNotSupportedApps(apps) {
  let notSupportedApps = getNotSupportedApps(apps)
  if (notSupportedApps.length) {
    throw new MapsException(
      `appsWhiteList [${notSupportedApps}] are not supported apps, please provide some of the supported apps [${Object.keys(titles)}]`
    )
  }
}

/**
 * Ask the user to choose one of the available map apps.
 * @param {{
 *     title: string | undefined | null
 *     message: string | undefined | null
 *     cancelText: string | undefined | null
 *     appsWhiteList: array | undefined | null
 * }} options
 * @returns {Promise}
 */
export function askAppChoice ({dialogTitle, dialogMessage, cancelText, appsWhiteList}) {
  return new Promise(async (resolve) => {
    let availableApps = await getAvailableApps()

    if (appsWhiteList && appsWhiteList.length) {
      availableApps = availableApps
        .filter(appName => appsWhiteList.includes(appName))
    }

    if (availableApps.length < 2) {
      return resolve(availableApps[0] || null)
    }

    if (isIOS) {
      let options = availableApps.map((app) => titles[app])
      options.push(cancelText)

      ActionSheetIOS.showActionSheetWithOptions({
        title: dialogTitle,
        message: dialogMessage,
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

    let options = availableApps.map((app) => ({text: titles[app], onPress: () => resolve(app)}))
    options.push({text: cancelText, onPress: () => resolve(null), style: 'cancel'})
    return Alert.alert(dialogTitle, dialogMessage, options, {onDismiss: () => resolve(null)})
  })
}

/**
 * Check if options are valid and well passed
 *
 * @param {{
 *     latitude: number | string,
 *     longitude: number | string,
 *     sourceLatitude: number | undefined | null,
 *     sourceLongitude: number | undefined | null,
 *     googleForceLatLon: boolean | undefined | null,
 *     googlePlaceId: number | undefined | null,
 *     title: string | undefined | null,
 *     app: string | undefined | null
 *     dialogTitle: string | undefined | null
 *     dialogMessage: string | undefined | null
 *     cancelText: string | undefined | null
 * }} options
 */
export function checkOptions (options) {
  if (!options || typeof options !== 'object') {
    throw new MapsException('First parameter of `showLocation` should contain object with options.')
  }
  if (!('latitude' in options) || !('longitude' in options)) {
    throw new MapsException('First parameter of `showLocation` should contain object with at least keys `latitude` and `longitude`.')
  }
  if ('title' in options && options.title && typeof options.title !== 'string') {
    throw new MapsException('Option `title` should be of type `string`.')
  }
  if ('googleForceLatLon' in options && options.googleForceLatLon && typeof options.googleForceLatLon !== 'boolean') {
    throw new MapsException('Option `googleForceLatLon` should be of type `boolean`.')
  }
  if ('googlePlaceId' in options && options.googlePlaceId && typeof options.googlePlaceId !== 'string') {
    throw new MapsException('Option `googlePlaceId` should be of type `string`.')
  }
  if ('app' in options && options.app && !(options.app in prefixes)) {
    throw new MapsException('Option `app` should be undefined, null, or one of the following: "' + Object.keys(prefixes).join('", "') + '".')
  }
  if ('appsWhiteList' in options && options.appsWhiteList) {
    checkNotSupportedApps(options.appsWhiteList)
  }
}

class MapsException {
  constructor (message) {
    this.message = message
    this.name = 'MapsException'
  }
}
