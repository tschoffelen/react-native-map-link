import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import type {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import type {MapId} from '../../type';
import PopupItem from './PopupItem';
import PopupSeparator from './PopupSeparator';
import PopupFlatList from './PopupFlatList';

const PopupBody = ({
  isLoading,
  style: {
    activityIndicatorContainer: styleActivityIndicatorContainer,
    separatorStyle: styleSeparatorStyle,
    itemContainer: styleItemContainer,
    image: styleImage,
    itemText: styleItemText,
  },
  apps,
  onAppPressed,
  titles,
}: {
  isLoading: boolean;
  style: {
    activityIndicatorContainer?: ViewStyle;
    separatorStyle?: ViewStyle;
    itemContainer?: ViewStyle;
    image?: ImageStyle;
    itemText?: TextStyle;
  };
  apps: MapId[];
  onAppPressed: (app: MapId) => void;
  titles: Record<string, string>;
}) => {
  if (isLoading) {
    return (
      <ActivityIndicator
        style={[
          styles.activityIndicatorContainer,
          styleActivityIndicatorContainer,
        ]}
      />
    );
  }

  return (
    <PopupFlatList
      separator={
        <PopupSeparator style={{separatorStyle: styleSeparatorStyle}} />
      }
      data={apps}
      renderItem={({item}) => (
        <PopupItem
          style={{
            itemContainer: styleItemContainer,
            image: styleImage,
            itemText: styleItemText,
          }}
          item={item}
          onAppPressed={onAppPressed}
          titles={titles}
        />
      )}
      keyExtractor={(item) => item}
    />
  );
};

export default PopupBody;

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
