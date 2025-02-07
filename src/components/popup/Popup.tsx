import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Modal, Dimensions} from 'react-native';
import type {ImageStyle, ModalProps, ViewStyle, TextStyle} from 'react-native';
import {getAvailableApps, checkNotSupportedApps} from '../../utils';
import {generatePrefixes, generateTitles} from '../../constants';
import type {MapId, ShowLocationProps} from '../../type';
import PopupFooter from './PopupFooter';
import PopupHeader from './PopupHeader';
import PopupBody from './PopupBody';
import {showLocation} from '../..';

export interface PopupProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  showHeader?: boolean;
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
  onAppPressed: (app: MapId) => void;
  onCancelPressed: () => void;
  style?: {
    container?: ViewStyle;
    modalView?: ViewStyle;
    itemContainer?: ViewStyle;
    image?: ImageStyle;
    itemText?: TextStyle;
    headerContainer?: ViewStyle;
    titleText?: TextStyle;
    subtitleText?: TextStyle;
    cancelButtonContainer?: ViewStyle;
    cancelButtonText?: TextStyle;
    separatorStyle?: ViewStyle;
    activityIndicatorContainer?: ViewStyle;
  };
  modalProps?: ModalProps;
  options: ShowLocationProps;
}

const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const Popup: React.FC<PopupProps> = ({
  isVisible,
  showHeader = true,
  customHeader,
  customFooter,
  onAppPressed,
  onCancelPressed,
  style = {},
  modalProps,
  options,
  setIsVisible,
}) => {
  const [apps, setApps] = useState<MapId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [titles, setTitles] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadApps = async () => {
      let appsData = await getAvailableApps(
        generatePrefixes({
          alwaysIncludeGoogle: options.alwaysIncludeGoogle,
          naverCallerName: options.naverCallerName,
        }),
      );
      if (options.appsWhiteList && options.appsWhiteList.length) {
        checkNotSupportedApps(options.appsWhiteList);
        appsData = appsData.filter((appName) =>
          options.appsWhiteList?.includes(appName),
        );
      }
      if (options.appsBlackList && options.appsBlackList.length) {
        appsData = appsData.filter(
          (appName) => !options.appsBlackList?.includes(appName),
        );
      }
      setApps(appsData);
      setIsLoading(false);
    };
    loadApps();
    setTitles(generateTitles(options.appTitles));
  }, [
    options.alwaysIncludeGoogle,
    options.appTitles,
    options.appsWhiteList,
    options.appsBlackList,
    options.naverCallerName,
  ]);

  const _onAppPressed = (app: MapId) => {
    showLocation({
      ...options,
      app,
    });
    onAppPressed(app);
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => {
        setIsVisible(false);
      }}
      transparent={true}
      visible={isVisible}
      {...modalProps}>
      <View style={[styles.container, style.container]}>
        <View style={[styles.modalView, style.modalView]}>
          <PopupHeader
            showHeader={showHeader}
            customHeader={customHeader}
            style={style}
            options={options}
          />
          <PopupBody
            apps={apps}
            isLoading={isLoading}
            style={style}
            titles={titles}
            onAppPressed={_onAppPressed}
          />
          <PopupFooter
            customFooter={customFooter}
            onCancelPressed={onCancelPressed}
            style={style}
            options={options}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    maxHeight: SCREEN_HEIGHT * 0.6,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
