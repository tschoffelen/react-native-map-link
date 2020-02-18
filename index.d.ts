import * as React from 'react';
import { ViewStyle, StyleProp, ImageStyle, TextStyle } from 'react-native';

interface Options {
    latitude: number | string
    longitude: number | string
    sourceLatitude?: number
    sourceLongitude?: number
    alwaysIncludeGoogle?: boolean
    googleForceLatLon?: boolean
    googlePlaceId?: string
    title?: string
    app?: string
    dialogTitle?: string
    dialogMessage?: string
    cancelText?: string
    appsWhiteList?: string[]
    appTitles?: { [key: string]: string }
}

interface PopupStyleProp {
    container?: StyleProp<ViewStyle>,
    itemContainer?: StyleProp<ViewStyle>,
    image?: StyleProp<ImageStyle>,
    itemText?: StyleProp<TextStyle>,
    headerContainer?: StyleProp<ViewStyle>,
    titleText?: StyleProp<TextStyle>,
    subtitleText?: StyleProp<TextStyle>,
    cancelButtonContainer?: StyleProp<ViewStyle>,
    cancelButtonText?: StyleProp<TextStyle>,
    separatorStyle?: StyleProp<ViewStyle>,
    activityIndicatorContainer?: StyleProp<ViewStyle>
}

interface PopupProps {
    isVisible: boolean,
    showHeader?: boolean,
    onCancelPressed: () => void,
    onBackButtonPressed: () => void,
    onAppPressed: () => void,
    style?: PopupStyleProp,
    modalProps?: object,
    options: Options,
    appsWhiteList: string[],
    appTitles?: { [key: string]: string }
}

export function showLocation(options: Options): Promise<string | undefined | null>;
export class Popup extends React.Component<PopupProps>{ }
