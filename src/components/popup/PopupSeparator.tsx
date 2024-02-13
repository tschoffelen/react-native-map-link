import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colorsPopup} from '../../constants';

const PopupSeparator = ({
  style: {separatorStyle: styleSeparator},
}: {
  style: any;
}) => {
  return <View style={[styles.separatorStyle, styleSeparator]} />;
};

export default PopupSeparator;

const styles = StyleSheet.create({
  separatorStyle: {
    flex: 1,
    height: 1,
    backgroundColor: colorsPopup.lightBlue,
  },
});
