import React from 'react';
import {Text, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';

const PopupFooter = ({
  customFooter,
  onCancelPressed,
  style: {
    cancelButtonContainer: styleCancelButtonContainer,
    cancelButtonText: styleCancelButtonText,
  },
  options,
}: {
  customFooter?: JSX.Element;
  onCancelPressed: () => void;
  style: {
    cancelButtonContainer?: ViewStyle;
    cancelButtonText?: TextStyle;
  };
  options: {
    cancelText?: string;
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
