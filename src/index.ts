import {Linking} from 'react-native';

import {generatePrefixes, generateTitles, icons} from './constants';
import {GetAppsProps, GetAppsResponse, MapId, ShowLocationProps} from './type';
import {
  askAppChoice,
  checkNotSupportedApps,
  checkOptions,
  generateMapUrl,
  getAvailableApps,
} from './utils';

export type {
  DirectionMode,
  GetAppsProps,
  GetAppsResponse,
  MapId,
  SharedOptions,
  ShowLocationProps,
} from './type';

export {Popup} from './components/popup/Popup';
export type {PopupProps} from './components/popup/Popup';

export const showLocation = async ({
  latitude,
  longitude,
  address,
  sourceLatitude,
  sourceLongitude,
  appleIgnoreLatLon,
  alwaysIncludeGoogle,
  googleForceLatLon,
  googlePlaceId,
  title: customTitle,
  app: customApp,
  dialogTitle: customDialogTitle,
  dialogMessage: customDialogMessage,
  cancelText: customCancelText,
  appsWhiteList: customAppsWhiteList,
  appTitles,
  naverCallerName,
  directionsMode,
}: ShowLocationProps) => {
  const prefixes = generatePrefixes({
    alwaysIncludeGoogle,
    naverCallerName,
  });

  checkOptions({
    latitude,
    longitude,
    address,
    googleForceLatLon,
    googlePlaceId,
    title: customTitle,
    app: customApp,
    prefixes,
    appTitles,
    appsWhiteList: customAppsWhiteList,
  });

  let useSourceDestiny = false;
  let sourceLat;
  let sourceLng;
  let sourceLatLng;
  let fullAddress;

  if (sourceLatitude != null && sourceLongitude != null) {
    useSourceDestiny = true;
    sourceLat =
      typeof sourceLatitude === 'string'
        ? parseFloat(sourceLatitude)
        : sourceLatitude;
    sourceLng =
      typeof sourceLongitude === 'string'
        ? parseFloat(sourceLongitude)
        : sourceLongitude;
    sourceLatLng = `${sourceLat},${sourceLng}`;
  }

  if (address) {
    fullAddress = encodeURIComponent(address)
  }

  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  const latlng = `${lat},${lng}`;
  const title = customTitle && customTitle.length ? customTitle : null;
  const encodedTitle = encodeURIComponent(title ?? '');
  let app = customApp && customApp.length ? customApp : null;
  const dialogTitle =
    customDialogTitle && customDialogTitle.length
      ? customDialogTitle
      : 'Open in Maps';
  const dialogMessage =
    customDialogMessage && customDialogMessage.length
      ? customDialogMessage
      : 'What app would you like to use?';
  const cancelText =
    customCancelText && customCancelText.length ? customCancelText : 'Cancel';
  const appsWhiteList =
    customAppsWhiteList && customAppsWhiteList.length
      ? customAppsWhiteList
      : null;

  if (!app) {
    app = await askAppChoice({
      dialogTitle,
      dialogMessage,
      cancelText,
      appsWhiteList,
      prefixes,
      appTitles: generateTitles(appTitles),
    });
  }

  const url = generateMapUrl({
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
    address : fullAddress,
    title,
    encodedTitle,
    prefixes,
    useSourceDestiny,
  });

  if (url !== '') {
    return Linking.openURL(url).then(() => Promise.resolve(app));
  }
};

export async function getApps({
  alwaysIncludeGoogle,
  appsWhiteList,
  appTitles,
  naverCallerName,
  ...rest
}: GetAppsProps): Promise<GetAppsResponse[]> {
  let apps = await getAvailableApps(
    generatePrefixes({alwaysIncludeGoogle, naverCallerName}),
  );

  if (appsWhiteList && appsWhiteList.length) {
    checkNotSupportedApps(appsWhiteList);
    apps = apps.filter((appName) => appsWhiteList!.includes(appName));
  }

  const titles = generateTitles({...appTitles});
  async function open(app: MapId) {
    return showLocation({
      ...rest,
      app,
      alwaysIncludeGoogle,
      appsWhiteList,
      appTitles,
      naverCallerName,
    });
  }

  const list: GetAppsResponse[] = [];
  for (const app of apps) {
    list.push({
      id: app,
      name: titles[app],
      icon: icons[app],
      open: () => open(app),
    });
  }

  return list;
}
