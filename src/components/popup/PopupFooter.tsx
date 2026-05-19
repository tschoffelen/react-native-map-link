import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import type {TextStyle, ViewStyle} from 'react-native';

const PopupFooter = ({
  customFooter,
  onCancelPressed,
  style: {
    cancelButtonContainer: styleCancelButtonContainer,
    cancelButtonText: styleCancelButtonText,
  },
  options,
}: {
  customFooter?: React.ReactNode;
  onCancelPressed: () => void;
  style: {
    cancelButtonContainer?: ViewStyle;
    cancelButtonText?: TextStyle;
  };
  options: {
    cancelText?: string | null;
  };
}) => {
  if (customFooter) {
    return customFooter;
  }
  return (
    <TouchableOpacity
      style={styleCancelButtonContainer}
      onPress={onCancelPressed}>
      <Text style={styleCancelButtonText}>
        {options.cancelText ? options.cancelText : 'Cancel'}
      </Text>
    </TouchableOpacity>
  );
};

export default PopupFooter;
