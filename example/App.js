import React, {Component} from 'react';
import {Button, StyleSheet, View, Image, Text} from 'react-native';

import {Popup, showLocation, getApps} from 'react-native-map-link';

const options = {
  latitude: 38.8976763,
  longitude: -77.0387185,
  title: 'The White House',
  dialogTitle: 'This is the dialog Title',
  dialogMessage: 'This is the amazing dialog Message',
  cancelText: 'This is the cancel button text',
};

const onFootOptions = {
  ...options,
  sourceLatitude: 38.8991792,
  sourceLongitude: -77.0452072,
  directionsMode: 'walk',
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      apps:[],
    };
  }

  async componentDidMount(){
    const apps = await getApps(options)
    this.setState(prevState, () => ({...prevState, apps}))
  }

  render() {
    const {apps} = this.state
    return (
      <View style={styles.container}>

        <View>
          {apps.map(({icon, name, id, open}) => (
            <Pressable key={id} onPress={open}>
              <Image source={icon} />
              <Text>{name}</Text>
            </Pressable>
          ))}
        </View>
        <Popup
          isVisible={this.state.isVisible}
          onCancelPressed={() => this.setState({isVisible: false})}
          onAppPressed={() => this.setState({isVisible: false})}
          onBackButtonPressed={() => this.setState({isVisible: false})}
          options={options}
        />

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => showLocation(options)}
            title="Show in Maps using action sheet"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => showLocation(onFootOptions)}
            title="Show direction (on foot) in Maps using action sheet"
          />
        </View>

        <Button
          onPress={() => {
            this.setState({isVisible: true});
          }}
          title="Show in Maps using Popup"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
