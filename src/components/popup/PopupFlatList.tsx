import React from 'react';
import {FlatList} from 'react-native';
import type {ListRenderItem} from 'react-native';
import type {MapId} from '../../type';

const PopupFlatList = ({
  separator,
  data,
  renderItem,
  keyExtractor,
}: {
  separator: React.ReactNode;
  data: MapId[];
  renderItem: ListRenderItem<MapId>;
  keyExtractor: (item: MapId) => string;
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
