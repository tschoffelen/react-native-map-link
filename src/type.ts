import type {ImageSourcePropType} from 'react-native';

/** id for map application. this is the id that is passed to the `app` option */
export type MapId =
  | 'apple-maps'
  | 'google-maps'
  | 'citymapper'
  | 'uber'
  | 'lyft'
  | 'transit'
  | 'truckmap'
  | 'waze'
  | 'yandex'
  | 'moovit'
  | 'yandex-maps'
  | 'yandex-taxi'
  | 'kakaomap'
  | 'tmap'
  | 'mapycz'
  | 'maps-me'
  | 'osmand'
  | 'gett'
  | 'navermap'
  | 'dgis'
  | 'liftago'
  | 'petalmaps'
  | 'sygic';

export type DirectionMode = 'car' | 'walk' | 'public-transport' | 'bike';

/** options shared across different types */
export interface SharedOptions {
  /** optionally you can set which apps to show (default: will show all supported apps installed on device) */
  appsWhiteList?: MapId[];
  /** custom titles to display for each app instead of using default titles. */
  appTitles?: Partial<Record<MapId, string>>;
}

export type GetAppsResponse = {
  id: MapId;
  name: string;
  icon: ImageSourcePropType;
  /** function to link user to map app */
  open: () => Promise<string | null | undefined>;
};

export interface ShowLocationProps {
  latitude: number | string;
  longitude: number | string;
  sourceLatitude?: number | null;
  sourceLongitude?: number | null;
  appleIgnoreLatLon?: boolean;
  alwaysIncludeGoogle?: boolean;
  googleForceLatLon?: boolean;
  googlePlaceId?: number | string;
  title?: string | null;
  app?: MapId | null;
  dialogTitle?: string | null;
  dialogMessage?: string | null;
  cancelText?: string | null;
  appsWhiteList?: string[] | null;
  appTitles?: Partial<Record<MapId, string>>;
  naverCallerName?: string;
  directionsMode?: DirectionMode;
}

export type GetAppsProps = ShowLocationProps;
