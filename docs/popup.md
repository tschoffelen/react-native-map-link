# Alternative usage: styled popup

Alternatively, it is possible to use a styled popup that displays icons in the app list:

![Popup](https://i.imgflip.com/2avtml.gif)

To use the library in that way, you can import the `Popup` component:

```js
import { Popup } from 'react-native-map-link';

<Popup
    isVisible={this.state.isVisible}
    onCancelPressed={() => this.setState({ isVisible: false })}
    onAppPressed={() => this.setState({ isVisible: false })}
    onBackButtonPressed={() => this.setState({ isVisible: false })}
    modalProps={{ // you can put all react-native-modal props inside.
        animationIn: 'slideInUp'
    }}
    appsWhiteList={[ /* Array of apps (apple-maps, google-maps, etc...) that you want
    to show in the popup, if is undefined or an empty array it will show all supported apps installed on device.*/ ]}
    appTitles: {{ /* Optional: you can override app titles. */ }}
    options={{ /* See `showLocation` method above, this accepts the same options. */ }}
    style={{ /* Optional: you can override default style by passing your values. */ }}
/>
```

The Popup component uses <a href="https://github.com/react-native-community/react-native-modal">react-native-modal</a>. So you can pass all react-native-modal properties inside "modalProps" to modify styling and animations.

Also, you can customize the styling of the popup by passing an object like this in the `style` prop of the `Popup` component:

```js
{
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
}
```
