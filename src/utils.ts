/**
 * React Native Map Link
 */

import {Linking, ActionSheetIOS, Alert, AlertButton} from 'react-native';

import {appKeys, isIOS, KnownApp} from './constants';

/**
 * Get available navigation apps.
 */
export const getAvailableApps = async (
  prefixes: Record<KnownApp, string>,
): Promise<KnownApp[]> => {
  const availableApps: KnownApp[] = [];
  for (const app in prefixes) {
    if (prefixes.hasOwnProperty(app)) {
      const avail = await isAppInstalled(app, prefixes);
      if (avail) {
        availableApps.push(app as KnownApp);
      }
    }
  }

  return availableApps;
};

/**
 * Check if a given map app is installed.
 */
export function isAppInstalled(
  app: string,
  prefixes: Partial<Record<KnownApp, string>>,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!(app in prefixes)) {
      return resolve(false);
    }

    Linking.canOpenURL(prefixes[app as KnownApp] as string)
      .then((result) => {
        resolve(!!result);
      })
      .catch(() => resolve(false));
  });
}

/**
 * Check if a given app is supported by this library
 *
 * @param {string} app
 * @returns {boolean}
 */
function isSupportedApp(app: string): boolean {
  return appKeys.includes(app as KnownApp);
}

/**
 * Get a list of not supported apps from a given array of apps
 */
function getNotSupportedApps(apps: KnownApp[]): KnownApp[] {
  return apps.filter((app) => !isSupportedApp(app));
}

/**
 * Throws an exception if some of the given apps is not supported
 */
export function checkNotSupportedApps(apps: KnownApp[]) {
  const notSupportedApps = getNotSupportedApps(apps);
  if (notSupportedApps.length) {
    throw new MapsException(
      `appsWhiteList [${notSupportedApps}] are not supported apps, please provide some of the supported apps [${appKeys}]`,
    );
  }
}

/**
 * Ask the user to choose one of the available map apps.
 */
interface AskAppChoiceOptions {
  dialogTitle: string | undefined | null;
  dialogMessage: string | undefined | null;
  cancelText?: string | null;
  appsWhiteList: string[] | null;
  prefixes: Record<KnownApp, string>;
  appTitles?: Record<KnownApp, string>;
}

export function askAppChoice({
  dialogTitle,
  dialogMessage,
  cancelText,
  appsWhiteList,
  prefixes,
  appTitles,
}: AskAppChoiceOptions): Promise<KnownApp | null> {
  return new Promise(async (resolve) => {
    let availableApps = await getAvailableApps(prefixes);

    if (appsWhiteList && appsWhiteList.length) {
      availableApps = availableApps.filter((appName) =>
        appsWhiteList.includes(appName),
      );
    }

    if (availableApps.length < 2) {
      return resolve(availableApps[0] || null);
    }

    if (isIOS) {
      const options = availableApps.map((app) => appTitles?.[app] || app);
      options.push(cancelText || '');

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: dialogTitle || '',
          message: dialogMessage || '',
          options: options,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex) => {
          if (buttonIndex === options.length - 1) {
            return resolve(null);
          }
          return resolve(availableApps[buttonIndex]);
        },
      );

      return;
    }

    const options: AlertButton[] = availableApps.map((app) => ({
      text: appTitles?.[app] || '',
      onPress: () => resolve(app),
    }));
    options.unshift({
      text: cancelText || '',
      onPress: () => resolve(null),
      style: 'cancel',
    });

    return Alert.alert(dialogTitle || '', dialogMessage || '', options, {
      cancelable: true,
      onDismiss: () => resolve(null),
    });
  });
}

/**
 * Check if options are valid and well passed
 */
interface CheckOptions {
  app?: string | null;
  appsWhiteList?: KnownApp[];
  appTitles?: Record<KnownApp, string>;
  cancelText?: string | null;
  dialogMessage?: string | null;
  dialogTitle?: string | null;
  googleForceLatLon?: boolean | null;
  googlePlaceId?: string | null;
  latitude: number | string;
  longitude: number | string;
  naverCallerName?: string;
  sourceLatitude?: number | null;
  sourceLongitude?: number | null;
  title?: string | null;
}

export function checkOptions(
  options: CheckOptions | undefined,
  prefixes: Record<KnownApp, string>,
) {
  if (!options || typeof options !== 'object') {
    throw new MapsException(
      'First parameter of `showLocation` should contain object with options.',
    );
  }
  if (!('latitude' in options) || !('longitude' in options)) {
    throw new MapsException(
      'First parameter of `showLocation` should contain object with at least keys `latitude` and `longitude`.',
    );
  }
  if (
    'title' in options &&
    options.title &&
    typeof options.title !== 'string'
  ) {
    throw new MapsException('Option `title` should be of type `string`.');
  }
  if (
    'googleForceLatLon' in options &&
    options.googleForceLatLon &&
    typeof options.googleForceLatLon !== 'boolean'
  ) {
    throw new MapsException(
      'Option `googleForceLatLon` should be of type `boolean`.',
    );
  }
  if (
    'googlePlaceId' in options &&
    options.googlePlaceId &&
    typeof options.googlePlaceId !== 'string'
  ) {
    throw new MapsException(
      'Option `googlePlaceId` should be of type `string`.',
    );
  }
  if ('app' in options && options.app && !(options.app in prefixes)) {
    throw new MapsException(
      'Option `app` should be undefined, null, or one of the following: "' +
        Object.keys(prefixes).join('", "') +
        '".',
    );
  }
  if ('appsWhiteList' in options && options.appsWhiteList) {
    checkNotSupportedApps(options.appsWhiteList);
  }
  if (
    'appTitles' in options &&
    options.appTitles &&
    typeof options.appTitles !== 'object'
  ) {
    throw new MapsException('Option `appTitles` should be of type `object`.');
  }
}

class MapsException {
  public name = 'MapsException';
  constructor(public message: string) {}
}
