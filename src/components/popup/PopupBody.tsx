import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import PopupItem from './PopupItem';
import PopupSeparator from './PopupSeparator';

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
  style: any;
  apps: any;
  onAppPressed: (app: string) => void;
  titles: any;
}) => {
  console.log('step 1')
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
  console.log('step 2')
  console.log({apps})
  return (
    <FlatList
      ItemSeparatorComponent={() => (
        <PopupSeparator style={{separatorStyle: styleSeparatorStyle}} />
      )}
      data={apps}
      renderItem={({item}) => (
        <PopupItem
          style={{
            style: {
              itemContainer: styleItemContainer,
              image: styleImage,
              itemText: styleItemText,
            },
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
