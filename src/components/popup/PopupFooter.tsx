import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

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
  style: any;
  options: any;
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
