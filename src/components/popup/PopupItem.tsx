import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import {colorsPopup, icons} from '../../constants';
import type {MapId} from '../../type';

const PopupItem = ({
  item,
  style: {
    itemContainer: styleItemContainer,
    image: styleImage,
    itemText: styleItemText,
  },
  onAppPressed,
  titles,
}: {
  item: MapId;
  style: {
    itemContainer?: ViewStyle;
    image?: ImageStyle;
    itemText?: TextStyle;
  };
  onAppPressed: (app: MapId) => void;
  titles: Record<MapId, string>;
}) => {
  return (
    <TouchableOpacity
      key={item}
      style={[styles.itemContainer, styleItemContainer]}
      onPress={() => onAppPressed(item)}>
      <View>
        <Image style={[styles.image, styleImage]} source={icons[item]} />
      </View>
      <Text style={[styles.itemText, styleItemText]}>{titles[item]}</Text>
    </TouchableOpacity>
  );
};

export default PopupItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorsPopup.black,
    marginLeft: 15,
  },
});
