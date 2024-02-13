import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { colorsPopup } from '../../constants';

const PopupHeader = ({
  showHeader = true,
  customHeader,
  style: {
    headerContainer: styleHeaderContainer,
    titleText: styleTitleText,
    subtitleText: styleSubtitleText,
  },
  options,
}: {
  showHeader: boolean;
  customHeader?: JSX.Element;
  style: any;
  options: any;
}) => {
  if (!showHeader) {
    return null;
  }
  if (customHeader) {
    return customHeader;
  }

  const dialogTitle = options.dialogTitle
    ? options.dialogTitle
    : 'Open in Maps';
  const dialogMessage = options.dialogMessage
    ? options.dialogMessage
    : 'What app would you like to use?';

  return (
    <View style={[styles.headerContainer, styleHeaderContainer]}>
      <Text style={[styles.titleText, styleTitleText]}>{dialogTitle}</Text>
      {dialogMessage ? (
        <Text style={[styles.subtitleText, styleSubtitleText]}>
          {dialogMessage}
        </Text>
      ) : null}
    </View>
  );
}

export default PopupHeader;

const styles = StyleSheet.create({
  headerContainer: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: colorsPopup.lightBlue,
    padding: 15,
  },
  titleText: {
    fontSize: 16,
    textAlign: 'center',
    color: colorsPopup.black,
  },
  subtitleText: {
    fontSize: 12,
    color: colorsPopup.lightGray,
    textAlign: 'center',
    marginTop: 10,
  }
});

