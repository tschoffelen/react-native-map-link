import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  ModalProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {getAvailableApps, checkNotSupportedApps} from '../../utils';
import {generatePrefixes, generateTitles} from '../../constants';
import PopupFooter from './PopupFooter';
import PopupHeader from './PopupHeader';
import PopupBody from './PopupBody';
import {showLocation} from '../..';

interface PopupProps {
  isVisible: boolean;
  showHeader?: boolean;
  customHeader?: JSX.Element;
  customFooter?: JSX.Element;
  onAppPressed: (app: string) => void;
  onCancelPressed: () => void;
  style?: {
    container?: ViewStyle;
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
  options: {
    dialogTitle?: string;
    dialogMessage?: string;
    cancelText?: string;
    appTitles?: Record<string, string>;
    alwaysIncludeGoogle?: boolean;
    naverCallerName?: string;
    latitude: number;
    longitude: number;
    title?: string;
  };
  appsWhiteList?: string[];
  setIsVisible: (isVisible: boolean) => void;
}

const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Popup: React.FC<PopupProps> = ({
  isVisible,
  showHeader = true,
  customHeader,
  customFooter,
  onAppPressed,
  onCancelPressed,
  style = {},
  modalProps,
  options,
  appsWhiteList,
  setIsVisible,
}) => {
  const [apps, setApps] = useState<string[]>([]);
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
      if (appsWhiteList && appsWhiteList.length) {
        checkNotSupportedApps(appsWhiteList);
        appsData = appsData.filter((appName) =>
          appsWhiteList.includes(appName),
        );
      }
      setApps(appsData);
      setIsLoading(false);
    };
    loadApps();
    setTitles(generateTitles(options.appTitles));
  }, [
    appsWhiteList,
    options.alwaysIncludeGoogle,
    options.appTitles,
    options.naverCallerName,
  ]);

  const _onAppPressed = (app: string) => {
    showLocation({
      ...options,
      app,
    });
    onAppPressed(app);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={() => {
        setIsVisible(false);
      }}
      {...modalProps}>
      <View style={[styles.container, style.container]}>
        <View style={styles.modalView}>
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
            style={{
              cancelButtonContainer: style.cancelButtonContainer,
              cancelButtonText: style.cancelButtonText,
            }}
            options={options}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: SCREEN_HEIGHT * 0.6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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

export default Popup;
