import * as React from 'react';
import {
  ViewStyle,
  StyleProp,
  ImageStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';

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
  | 'petalmaps';

export type DirectionMode = 'car' | 'walk' | 'public-transport' | 'bike';

/** options shared across different types */
export interface SharedOptions {
  /** optionally you can set which apps to show (default: will show all supported apps installed on device) */
  appsWhiteList?: MapId[];
  /** custom titles to display for each app instead of using default titles. */
  appTitles?: Partial<Record<MapId, string>>;
}

export interface MapLinkOptions extends SharedOptions {
  latitude: number | string;
  longitude: number | string;
  /** optionally specify starting location for directions */
  sourceLatitude?: number;
  /** not optional if `sourceLatitude` is specified */
  sourceLongitude?: number;
  /** optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false) */
  alwaysIncludeGoogle?: boolean;
  googleForceLatLon?: boolean;
  appleIgnoreLatLon?: boolean;
  googlePlaceId?: string;
  title?: string;
  /** optionally specify specific app to use */
  app?: MapId;
  /** optional (default: 'Open in Maps') */
  dialogTitle?: string;
  /** optional (default: 'What app would you like to use?') */
  dialogMessage?: string;
  cancelText?: string;
  /** to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android. */
  naverCallerName?: string;
  directionsMode?: DirectionMode;
}

export interface PopupStyleProp {
  container?: StyleProp<ViewStyle>;
  itemContainer?: StyleProp<ViewStyle>;
  image?: StyleProp<ImageStyle>;
  itemText?: StyleProp<TextStyle>;
  headerContainer?: StyleProp<ViewStyle>;
  titleText?: StyleProp<TextStyle>;
  subtitleText?: StyleProp<TextStyle>;
  cancelButtonContainer?: StyleProp<ViewStyle>;
  cancelButtonText?: StyleProp<TextStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
  activityIndicatorContainer?: StyleProp<ViewStyle>;
}

export interface PopupProps extends SharedOptions {
  isVisible: boolean;
  showHeader?: boolean;
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
  onCancelPressed: () => void;
  onBackButtonPressed: () => void;
  onAppPressed: (appName: MapId) => void;
  style?: PopupStyleProp;
  modalProps?: object;
  options: MapLinkOptions;
}

export type GetAppsResponse = {
  id: MapId;
  name: string;
  icon: ImageSourcePropType;
  /** function to link user to map app */
  open: () => Promise<void>;
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
  app?: string | null;
  dialogTitle?: string | null;
  dialogMessage?: string | null;
  cancelText?: string | null;
  appsWhiteList?: string[] | null;
  appTitles?: Record<string, string>;
  naverCallerName?: string;
  directionsMode?: 'car' | 'walk' | 'public-transport' | 'bike' | undefined;
}

export interface GetAppsProps extends ShowLocationProps {
  // Add any additional props specific to the getApps function
  alwaysIncludeGoogle?: boolean;
  appsWhiteList?: string[] | null;
  naverCallerName?: string;
}
