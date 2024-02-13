import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

const ItemSeparator = ({separatorStyle}) => (
  <View style={separatorStyle} />
);

ItemSeparator.propTypes = {
  separatorStyle: PropTypes.object.isRequired,
};

export default ItemSeparator;
