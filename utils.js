import { Linking, ActionSheetIOS } from 'react-native';

import { prefixes, titles, isIOS, apps } from './constants';

/**
 * Get available navigation apps.
 */
export const getAvailableApps = async () => {
  let availableApps = []
  for (let app in prefixes) {
    let avail = await isAppInstalled(app)
    if (avail) {
      availableApps.push(app)
    }
  }

  return availableApps;
};

/**
 * Check if a given map app is installed.
 *
 * @param {string} app
 * @returns {Promise<boolean>}
 */
function isAppInstalled(app) {
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
 * @param {{
 *     title: string | undefined | null
 *     message: string | undefined | null
 *     cancelText: string | undefined | null
 * }} options
 * @returns {Promise<any>}
 */
export function askAppChoice({ dialogTitle, dialogMessage, cancelText }) {
  return new Promise(async (resolve) => {
    let availableApps = await getAvailableApps()
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

    let options = availableApps.map((app) => ({ text: titles[app], onPress: () => resolve(app) }))
    options.push({ text: 'Cancel', onPress: () => resolve(null), style: 'cancel' })
    Alert.alert(dialogTitle, dialogMessage, options, { onDismiss: () => resolve(null) })
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
export function checkOptions(options) {
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
  if ('googlePlaceId' in options && options.googlePlaceId && typeof options.googlePlaceId !== 'number') {
    throw new MapsException('Option `googlePlaceId` should be of type `number`.')
  }
  if ('app' in options && options.app && apps.indexOf(options.app) < 0) {
    throw new MapsException('Option `app` should be undefined, null, or one of the following: "' + apps.join('", "') + '".')
  }
}

class MapsException {
  constructor(message) {
    this.message = message
    this.name = 'MapsException'
  }
}
