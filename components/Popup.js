import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

import { getAvailableApps } from '../index';
import { titles, icons, apps } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen'); 

class Popup extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
  };
  static defaultProps = {
    isVisible: true,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    // this.apps = await getAvailableApps();
    this.apps = apps;
  }

  _renderAppItem = (key) => {
    return (
      <View
        key={key}
        style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}
      >
        <View>
          <Image
            style={{ width: 52, height: 52 }}
            source={icons[key]}
          />
        </View>
        <Text style={{ marginLeft: 15 }}>{titles[key]}</Text>
      </View>
    );
  }

  _renderCancelButton = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>Annuler</Text>
    </View>
  );

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        backdropColor="#464646"
        animationIn="slideInUp"
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        onBackButtonPress={() => this.setState({ modalIsVisible: false })}
      >
        <View style={styles.container}>
          <ScrollView>
            {(this.apps || []).map(this._renderAppItem)}
          </ScrollView>
          {this._renderCancelButton()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: SCREEN_HEIGHT / 2,
  },
  text: {

  }
});

export { Popup };
