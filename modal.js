import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

class Modal extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  text: {

  }
});

export { Modal };
