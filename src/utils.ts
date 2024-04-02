import {Linking, ActionSheetIOS, Alert} from 'react-native';

import {appKeys, isIOS} from './constants';

export const getAvailableApps = async (
  prefixes: Record<string, string>,
): Promise<string[]> => {
  const availableApps: string[] = [];

  await Promise.all(
    Object.entries(prefixes).map(async ([app, _]) => {
      try {
        const isInstalled = await isAppInstalled(app, prefixes);
        if (isInstalled) {
          availableApps.push(app);
        }
      } catch (error) {
        console.error(`Error checking if ${app} is installed:`, error);
      }
    }),
  );

  return availableApps;
};

export const isAppInstalled = (
  app: string,
  prefixes: Record<string, string>,
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (!(app in prefixes)) {
      return resolve(false);
    }

    Linking.canOpenURL(prefixes[app])
      .then((result) => {
        resolve(!!result);
      })
      .catch(() => resolve(false));
  });
};

export const isSupportedApp = (app: string): boolean => {
  return appKeys.includes(app);
};

export const getNotSupportedApps = (apps: string[]): string[] => {
  return apps.filter((app) => !isSupportedApp(app));
};

export const checkNotSupportedApps = (apps: string[]): void => {
  const notSupportedApps = getNotSupportedApps(apps);
  if (notSupportedApps.length) {
    throw new MapsException(
      `appsWhiteList [${notSupportedApps}] are not supported apps, please provide some of the supported apps [${appKeys}]`,
    );
  }
};

export const askAppChoice = ({
  dialogTitle,
  dialogMessage,
  cancelText,
  appsWhiteList,
  prefixes,
  appTitles,
}: {
  dialogTitle: string | null | undefined;
  dialogMessage: string | null | undefined;
  cancelText: string | null | undefined;
  appsWhiteList: string[] | null | undefined;
  prefixes: Record<string, string>;
  appTitles: Record<string, string> | null | undefined;
}): Promise<string | null> => {
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
      const options = availableApps.map((app) => appTitles?.[app]) as string[];
      options?.push(cancelText || '');

      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: dialogTitle || '',
          message: dialogMessage || '',
          options: options || [],
          cancelButtonIndex: options ? options.length - 1 : 0,
        },
        (buttonIndex) => {
          if (buttonIndex === options!.length - 1) {
            return resolve(null);
          }
          return resolve(availableApps[buttonIndex]);
        },
      );

      return;
    }

    const options = availableApps.map((app) => ({
      text: appTitles?.[app] || '',
      onPress: () => resolve(app),
    }));
    options.unshift({
      text: cancelText || '',
      onPress: () => resolve(null),
    });

    return Alert.alert(dialogTitle || '', dialogMessage || '', options, {
      cancelable: true,
      onDismiss: () => resolve(null),
    });
  });
};

export const getDirectionsModeAppleMaps = (
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined,
): string | undefined => {
  const modeMap: Record<string, string> = {
    car: 'd',
    bike: 'b',
    walk: 'w',
    'public-transport': 'r',
  };

  return modeMap[directionsMode || ''] || undefined;
};

export const getDirectionsModeGoogleMaps = (
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined,
): string | undefined => {
  const modeMap: Record<string, string> = {
    car: 'driving',
    walk: 'walking',
    'public-transport': 'transit',
    bike: 'bicycling',
  };

  return modeMap[directionsMode || ''] || undefined;
};

export const getDirectionsModeSygic = (
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined,
): string | undefined => {
  const modeMap: Record<string, string> = {
    car: 'drive',
    walk: 'walk',
    'public-transport': 'show',
    bike: 'show',
  };

  return modeMap[directionsMode || ''] || undefined;
};

export const checkOptions = ({
  latitude,
  longitude,
  googleForceLatLon,
  googlePlaceId,
  title,
  app,
  prefixes,
  appTitles,
  appsWhiteList,
}: {
  latitude: number | string;
  longitude: number | string;
  googleForceLatLon?: boolean | null | undefined;
  googlePlaceId?: number | string | null | undefined;
  title?: string | null | undefined;
  app?: string | null | undefined;
  appTitles: Record<string, string> | null | undefined;
  prefixes: Record<string, string>;
  appsWhiteList: string[] | null | undefined;
}): void => {
  if (!latitude || !longitude) {
    throw new MapsException(
      '`showLocation` should contain keys `latitude` and `longitude`.',
    );
  }
  if (title && typeof title !== 'string') {
    throw new MapsException('`title` should be of type `string`.');
  }
  if (googleForceLatLon && typeof googleForceLatLon !== 'boolean') {
    throw new MapsException(
      'Option `googleForceLatLon` should be of type `boolean`.',
    );
  }
  if (googlePlaceId && typeof googlePlaceId !== 'string') {
    throw new MapsException(
      'Option `googlePlaceId` should be of type `string`.',
    );
  }
  if (app && !(app in prefixes)) {
    throw new MapsException(
      'Option `app` should be undefined, null, or one of the following: "' +
        Object.keys(prefixes).join('", "') +
        '".',
    );
  }
  if (appsWhiteList && appsWhiteList.length) {
    checkNotSupportedApps(appsWhiteList);
  }
  if (appTitles && typeof appTitles !== 'object') {
    throw new MapsException('Option `appTitles` should be of type `object`.');
  }
};

export const generateMapUrl = ({
  app,
  directionsMode,
  appleIgnoreLatLon,
  googleForceLatLon,
  googlePlaceId,
  naverCallerName,
  lat,
  lng,
  latlng,
  sourceLat,
  sourceLng,
  sourceLatLng,
  title,
  encodedTitle,
  prefixes,
  useSourceDestiny,
}: {
  app: string | null;
  directionsMode: 'car' | 'walk' | 'public-transport' | 'bike' | undefined;
  appleIgnoreLatLon?: boolean;
  googleForceLatLon?: boolean;
  googlePlaceId: string | number | null | undefined;
  naverCallerName: string | null | undefined;
  lat: number;
  lng: number;
  latlng: string;
  sourceLat?: number;
  sourceLng?: number;
  sourceLatLng?: string;
  title?: string | null;
  encodedTitle?: string;
  prefixes: Record<string, string>;
  useSourceDestiny: boolean;
}): string => {
  let url = '';

  switch (app) {
    case 'apple-maps':
      const appleDirectionMode = getDirectionsModeAppleMaps(directionsMode);
      url = prefixes['apple-maps'];
      if (useSourceDestiny || directionsMode) {
        url = `${url}?daddr=${latlng}`;
        url += sourceLatLng ? `&saddr=${sourceLatLng}` : '';
      } else if (!appleIgnoreLatLon) {
        url = `${url}?ll=${latlng}`;
      }
      url +=
        useSourceDestiny || directionsMode || !appleIgnoreLatLon ? '&' : '?';
      url += `q=${title ? encodedTitle : 'Location'}`;
      url += appleDirectionMode ? `&dirflg=${appleDirectionMode}` : '';
      break;
    case 'google-maps':
      const googleDirectionMode = getDirectionsModeGoogleMaps(directionsMode);
      // Always using universal URL instead of URI scheme since the latter doesn't support all parameters (#155)
      if (useSourceDestiny || directionsMode) {
        // Use "dir" as this will open up directions
        url = 'https://www.google.com/maps/dir/?api=1';
        url += sourceLatLng ? `&origin=${sourceLatLng}` : '';
        if (!googleForceLatLon && title) {
          url += `&destination=${encodedTitle}`;
        } else {
          url += `&destination=${latlng}`;
        }

        url += googlePlaceId ? `&destination_place_id=${googlePlaceId}` : '';

        url += googleDirectionMode ? `&travelmode=${googleDirectionMode}` : '';
      } else {
        // Use "search" as this will open up a single marker
        url = 'https://www.google.com/maps/search/?api=1';

        if (!googleForceLatLon && title) {
          url += `&query=${encodedTitle}`;
        } else {
          url += `&query=${latlng}`;
        }

        url += googlePlaceId ? `&query_place_id=${googlePlaceId}` : '';
      }
      break;
    case 'citymapper':
      url = `${prefixes.citymapper}directions?endcoord=${latlng}`;

      if (title) {
        url += `&endname=${encodedTitle}`;
      }

      if (useSourceDestiny) {
        url += `&startcoord=${sourceLatLng}`;
      }
      break;
    case 'uber':
      url = `${prefixes.uber}?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;

      if (title) {
        url += `&dropoff[nickname]=${encodedTitle}`;
      }

      url += useSourceDestiny
        ? `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`
        : '&pickup=my_location';

      break;
    case 'lyft':
      url = `${prefixes.lyft}ridetype?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`;

      if (useSourceDestiny) {
        url += `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`;
      }

      break;
    case 'transit':
      url = `${prefixes.transit}directions?to=${latlng}`;

      if (useSourceDestiny) {
        url += `&from=${sourceLatLng}`;
      }
      break;
    case 'truckmap':
      url = `https://truckmap.com/place/${lat},${lng}`;

      if (useSourceDestiny) {
        url = `https://truckmap.com/route/${sourceLat},${sourceLng}/${lat},${lng}`;
      }
      break;
    case 'waze':
      url = `${prefixes.waze}?ll=${latlng}&navigate=yes`;
      if (title) {
        url += `&q=${encodedTitle}`;
      }
      break;
    case 'yandex':
      url = `${prefixes.yandex}build_route_on_map?lat_to=${lat}&lon_to=${lng}`;

      if (useSourceDestiny) {
        url += `&lat_from=${sourceLat}&lon_from=${sourceLng}`;
      }
      break;
    case 'moovit':
      url = `${prefixes.moovit}?dest_lat=${lat}&dest_lon=${lng}`;

      if (title) {
        url += `&dest_name=${encodedTitle}`;
      }

      if (useSourceDestiny) {
        url += `&orig_lat=${sourceLat}&orig_lon=${sourceLng}`;
      }
      break;
    case 'yandex-taxi':
      url = `${prefixes['yandex-taxi']}route?end-lat=${lat}&end-lon=${lng}&appmetrica_tracking_id=1178268795219780156`;

      break;
    case 'yandex-maps':
      url = `${prefixes['yandex-maps']}?pt=${lng},${lat}`;

      break;
    case 'kakaomap':
      url = `${prefixes.kakaomap}look?p=${latlng}`;

      if (useSourceDestiny) {
        url = `${prefixes.kakaomap}route?sp=${sourceLat},${sourceLng}&ep=${latlng}&by=CAR`;
      }
      break;
    case 'tmap':
      url = `${prefixes.tmap}viewmap?x=${lng}&y=${lat}`;

      if (useSourceDestiny) {
        url = `${prefixes.tmap}route?startx=${sourceLng}&starty=${sourceLat}&goalx=${lng}&goaly=${lat}`;
      }
      break;
    case 'mapycz':
      url = `${prefixes.mapycz}www.mapy.cz/zakladni?x=${lng}&y=${lat}&source=coor&id=${lng},${lat}`;

      break;
    case 'maps-me':
      url = `${prefixes['maps-me']}route?sll=${sourceLat},${sourceLng}&saddr= &dll=${lat},${lng}&daddr=${title}&type=vehicle`;

      break;
    case 'osmand':
      url = isIOS
        ? `${prefixes.osmand}?lat=${lat}&lon=${lng}`
        : `${prefixes.osmand}?q=${lat},${lng}`;

      break;
    case 'gett':
      url = `${prefixes.gett}order?pickup=my_location&dropoff_latitude=${lat}&dropoff_longitude=${lng}`;

      break;
    case 'navermap':
      url = `${prefixes.navermap}map?lat=${lat}&lng=${lng}&appname=${naverCallerName}`;

      if (useSourceDestiny) {
        url = `${prefixes.navermap}route?slat=${sourceLat}&slng=${sourceLng}&dlat=${lat}&dlng=${lng}&appname=${naverCallerName}`;
      }
      break;
    case 'dgis':
      url = `${prefixes.dgis}routeSearch/to/${lng},${lat}/go`;

      if (useSourceDestiny) {
        url = `${prefixes.dgis}routeSearch/to/${lng},${lat}/from/${sourceLng},${sourceLat}/go`;
      }
      break;
    case 'liftago':
      url = `${prefixes.liftago}order?destinationLat=${lat}&destinationLon=${lng}`;

      if (title) {
        url += `&destinationName=${encodedTitle}`;
      }

      if (useSourceDestiny) {
        url += `&pickupLat=${sourceLat}&pickupLon=${sourceLng}`;
      }
      break;
    case 'petalmaps':
      url = `${prefixes.petalmaps}navigation?daddr=${lat},${lng}`;

      if (useSourceDestiny) {
        url += `&saddr=${sourceLat},${sourceLng}`;
      }
      break;
    case 'sygic':
      const sygicDirectionsMode = getDirectionsModeSygic(directionsMode);
      url = `${prefixes.sygic}coordinate|${lng}|${lat}|`;
      url += sygicDirectionsMode ? `${sygicDirectionsMode}` : '';
      break;
  }

  return url;
};

class MapsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MapsException';
  }
}
