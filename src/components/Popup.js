/**
 * React Native Map Link
 */

import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'

import { getAvailableApps, checkNotSupportedApps } from '../utils'
import { showLocation } from '../index'
import { generateTitles, icons, generatePrefixes } from '../constants'

const SCREEN_HEIGHT = Dimensions.get('screen').height

const colors = {
  black: '#464646',
  gray: '#BBC4CC',
  lightGray: '#ACBBCB',
  lightBlue: '#ECF2F8'
}

export default class Popup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      apps: [],
      loading: true,
      titles: generateTitles(props.appTitles),
    }

    this._renderAppItem = this._renderAppItem.bind(this)
  }

  async componentDidMount () {
    const { appsWhiteList, options } = this.props
    let apps = await getAvailableApps(generatePrefixes(options))
    if (appsWhiteList && appsWhiteList.length) {
      checkNotSupportedApps(appsWhiteList)
      apps = apps.filter(appName => this.props.appsWhiteList.includes(appName))
    }

    this.setState({ apps, loading: false })
  }

  _renderHeader () {
    const { showHeader, options } = this.props
    if (!showHeader) {
      return null
    }

    const dialogTitle = options.dialogTitle && options.dialogTitle.length
      ? options.dialogTitle
      : 'Open in Maps'
    const dialogMessage = options.dialogMessage && options.dialogMessage.length
      ? options.dialogMessage
      : 'What app would you like to use?'

    return (
      <View style={[styles.headerContainer, this.props.style.headerContainer]}>
        <Text style={[styles.titleText, this.props.style.titleText]}>{dialogTitle}</Text>
        {dialogMessage && dialogMessage.length
          ? <Text style={[styles.subtitleText, this.props.style.subtitleText]}>{dialogMessage}</Text> : null}
      </View>
    )
  }

  _renderApps () {
    return (
      <FlatList
        ItemSeparatorComponent={() => (
          <View style={[styles.separatorStyle, this.props.style.separatorStyle]}/>
        )}
        data={this.state.apps}
        renderItem={this._renderAppItem}
        keyExtractor={(item) => item}
      />
    )
  }

  _renderAppItem ({ item }) {
    return (
      <TouchableOpacity
        key={item}
        style={[styles.itemContainer, this.props.style.itemContainer]}
        onPress={() => this._onAppPressed({ app: item })}
      >
        <View>
          <Image
            style={[styles.image, this.props.style.image]}
            source={icons[item]}
          />
        </View>
        <Text style={[styles.itemText, this.props.style.itemText]}>{this.state.titles[item]}</Text>
      </TouchableOpacity>
    )
  }

  _renderCancelButton () {
    const { options } = this.props
    const cancelText = options.cancelText && options.cancelText.length ? options.cancelText : 'Cancel'
    return (
      <TouchableOpacity
        style={[styles.cancelButtonContainer, this.props.style.cancelButtonContainer]}
        onPress={this.props.onCancelPressed}
      >
        <Text style={[styles.cancelButtonText, this.props.style.cancelButtonText]}>{cancelText}</Text>
      </TouchableOpacity>
    )
  }

  _onAppPressed ({ app }) {
    showLocation({ ...this.props.options, app })
    this.props.onAppPressed(app)
  }

  render () {
    const { loading } = this.state
    return (
      <Modal
        isVisible={this.props.isVisible}
        backdropColor={colors.black}
        animationIn='slideInUp'
        hideModalContentWhileAnimating
        useNativeDriver
        onBackButtonPress={this.props.onBackButtonPressed}
        {...this.props.modalProps}>
        <View style={[styles.container, this.props.style.container]}>
          {this._renderHeader()}
          {loading ? (
            <ActivityIndicator style={[styles.activityIndicatorContainer, this.props.style.activityIndicatorContainer]}/>
          ) : this._renderApps()}
          {this._renderCancelButton()}
        </View>
      </Modal>
    )
  }
}

Popup.propTypes = {
  isVisible: PropTypes.bool,
  showHeader: PropTypes.bool,
  onBackButtonPressed: PropTypes.func,
  onAppPressed: PropTypes.func,
  onCancelPressed: PropTypes.func,
  style: PropTypes.object,
  modalProps: PropTypes.object,
  options: PropTypes.object.isRequired,
  appsWhiteList: PropTypes.array
}

Popup.defaultProps = {
  isVisible: false,
  showHeader: true,
  style: {
    container: {},
    itemContainer: {},
    image: {},
    itemText: {},
    headerContainer: {},
    titleText: {},
    subtitleText: {},
    cancelButtonContainer: {},
    cancelButtonText: {},
    separatorStyle: {},
    activityIndicatorContainer: {}
  },
  modalProps: {},
  options: {},
  appsWhiteList: null,
  onBackButtonPressed: () => { },
  onCancelPressed: () => {},
  onAppPressed: () => {}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: SCREEN_HEIGHT * 0.6
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 15
  },
  headerContainer: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: colors.lightBlue,
    padding: 15
  },
  titleText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.black
  },
  subtitleText: {
    fontSize: 12,
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: 10
  },
  cancelButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: colors.lightBlue
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray
  },
  separatorStyle: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightBlue
  },
  activityIndicatorContainer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
