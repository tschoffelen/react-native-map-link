import {showLocation} from '../src/index';
import {Linking} from 'react-native';

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('showLocation', () => {
  const latitude = 123;
  const longitude = 234;
  const sourceLatitude = 567;
  const sourceLongitude = 890;

  it('opens DGIS with correct url if source is not provided', () => {
    showLocation({
      latitude,
      longitude,
      app: 'dgis',
    });

    expect(Linking.openURL).toHaveBeenCalledWith(
      'dgis://2gis.ru/routeSearch/to/234,123/go',
    );
  });

  it('opens DGIS with correct url if source is provided', () => {
    showLocation({
      latitude,
      longitude,
      sourceLatitude,
      sourceLongitude,
      app: 'dgis',
    });

    expect(Linking.openURL).toHaveBeenCalledWith(
      'dgis://2gis.ru/routeSearch/to/234,123/from/890,567/go',
    );
  });
});
