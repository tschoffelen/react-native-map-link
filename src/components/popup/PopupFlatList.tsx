import React from 'react';
import {FlatList} from 'react-native';

const PopupFlatList = ({
  separator,
  data,
  renderItem,
  keyExtractor,
}: {
  separator: JSX.Element;
  data: string[];
  renderItem: ({item}: {item: string}) => JSX.Element;
  keyExtractor: (item: string) => string;
}) => {
  return (
    <FlatList
      ItemSeparatorComponent={() => separator}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default PopupFlatList;
