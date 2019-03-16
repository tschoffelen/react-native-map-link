/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

import { Popup } from 'react-native-map-link'

export default class App extends Component {
  state = {
    isVisible: false
  }

  render () {
    return (
      <View style={styles.container}>
        <Popup
          isVisible={this.state.isVisible}
          onCancelPressed={() => this.setState({ isVisible: false })}
          onAppPressed={() => this.setState({ isVisible: false })}
          onBackButtonPressed={() => this.setState({ isVisible: false })}
          options={{
            latitude: 38.8976763,
            longitude: -77.0387185,
            title: 'The White House',
            dialogTitle: 'This is the dialog Title',
            dialogMessage: 'This is the amazing dialog Message',
            cancelText: 'This is the cancel button text'
          }}
        />
        <TouchableOpacity style={{ padding: 20 }} onPress={() => { this.setState({ isVisible: true }) }}>
          <Text style={styles.welcome}>
            Show in Maps
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#4682BC',
    margin: 10
  }
})
