import {Alert, Linking, Platform} from 'react-native';
import {getApps, showLocation} from '../src/index';
import {generatePrefixes} from '../src/constants';
import {isAppInstalled} from '../src/utils';

jest.mock('react-native', () => ({
  Linking: {canOpenURL: jest.fn(), openURL: jest.fn()},
  Platform: {OS: 'android'},
  Alert: {alert: jest.fn()},
  StyleSheet: {create: (styles: unknown) => styles},
  Dimensions: {get: () => ({width: 375, height: 667})},
}));

const destination = {latitude: 35.69972, longitude: 51.33722};

beforeEach(() => {
  jest.clearAllMocks();
  jest.replaceProperty(Platform, 'OS', 'android');
  jest
    .mocked(Linking.canOpenURL)
    .mockImplementation(
      async (url) => url === 'nshn://' || url.startsWith('https://'),
    );
  jest.mocked(Linking.openURL).mockResolvedValue(undefined);
});

afterEach(() => jest.restoreAllMocks());

describe('Neshan on Android', () => {
  it('detects the installed app using the custom scheme', async () => {
    await expect(isAppInstalled('neshan', generatePrefixes({}))).resolves.toBe(
      true,
    );
    expect(Linking.canOpenURL).toHaveBeenCalledWith('nshn://');
  });

  it('does not mistake HTTPS handling for Neshan installation', async () => {
    jest
      .mocked(Linking.canOpenURL)
      .mockImplementation(async (url) => url.startsWith('https://'));
    await expect(
      getApps({...destination, appsWhiteList: ['neshan']}),
    ).resolves.toEqual([]);
    await expect(
      showLocation({...destination, appsWhiteList: ['neshan']}),
    ).resolves.toBeUndefined();
    expect(Linking.openURL).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('treats a rejected availability probe as unavailable', async () => {
    jest.mocked(Linking.canOpenURL).mockRejectedValue(new Error('Not visible'));
    await expect(isAppInstalled('neshan', generatePrefixes({}))).resolves.toBe(
      false,
    );
  });

  it.each([
    [35.69972, 51.33722, 'nshn:35.69972,51.33722'],
    ['35.69972', '51.33722', 'nshn:35.69972,51.33722'],
    [0, 0, 'nshn:0,0'],
    [-35.5, -51.5, 'nshn:-35.5,-51.5'],
    [90, -180, 'nshn:90,-180'],
  ])('opens coordinates %s, %s', async (latitude, longitude, url) => {
    await expect(
      showLocation({latitude, longitude, app: 'neshan'}),
    ).resolves.toBe('neshan');
    expect(Linking.openURL).toHaveBeenCalledWith(url);
  });

  it('does not append unverified title syntax', async () => {
    await showLocation({...destination, app: 'neshan', title: 'Azadi Square'});
    expect(Linking.openURL).toHaveBeenCalledWith('nshn:35.69972,51.33722');
  });

  it.each([
    {address: 'Azadi Square'},
    {sourceLatitude: 0},
    {sourceLongitude: 0},
    {sourceLatitude: 35, sourceLongitude: 51},
    {directionsMode: 'walk' as const},
  ])('rejects unsupported location options %j', async (options) => {
    await expect(
      showLocation({...destination, ...options, app: 'neshan'}),
    ).rejects.toThrow('neshan only supports displaying coordinates');
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it.each([
    [91, 51],
    [35, -181],
    [Infinity, 51],
    ['invalid', '51'],
  ])('rejects invalid coordinates %s, %s', async (latitude, longitude) => {
    await expect(
      showLocation({latitude, longitude, app: 'neshan'}),
    ).rejects.toThrow('neshan requires valid latitude and longitude');
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('rejects missing coordinates', async () => {
    await expect(showLocation({app: 'neshan'})).rejects.toThrow(
      '`latitude` & `longitude` or `address` is required.',
    );
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('returns the app metadata and a working open callback', async () => {
    const apps = await getApps({...destination, appsWhiteList: ['neshan']});
    expect(apps).toHaveLength(1);
    expect(apps[0]).toMatchObject({id: 'neshan', name: 'Neshan'});
    expect(apps[0].icon).toBeDefined();
    await expect(apps[0].open()).resolves.toBe('neshan');
    expect(Linking.openURL).toHaveBeenCalledWith('nshn:35.69972,51.33722');
  });

  it('respects the blacklist', async () => {
    await expect(
      getApps({
        ...destination,
        appsWhiteList: ['neshan'],
        appsBlackList: ['neshan'],
      }),
    ).resolves.toEqual([]);
  });

  it('opens Neshan after selection in the existing Android picker', async () => {
    const pending = showLocation({
      ...destination,
      appsWhiteList: ['neshan', 'google-maps'],
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const options = jest.mocked(Alert.alert).mock.calls[0][2];
    const neshan = options?.find((option) => option.text === 'Neshan');
    expect(neshan).toBeDefined();
    neshan?.onPress?.();
    await expect(pending).resolves.toBe('neshan');
    expect(Linking.openURL).toHaveBeenCalledWith('nshn:35.69972,51.33722');
  });

  it('propagates an unavailable-app rejection without browser fallback', async () => {
    const error = new Error('No activity found');
    jest.mocked(Linking.openURL).mockRejectedValue(error);
    await expect(showLocation({...destination, app: 'neshan'})).rejects.toBe(
      error,
    );
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith('nshn:35.69972,51.33722');
  });
});

it.each(['ios', 'web'] as const)(
  'does not offer or open Neshan on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await expect(
      getApps({...destination, appsWhiteList: ['neshan']}),
    ).resolves.toEqual([]);
    expect(Linking.canOpenURL).not.toHaveBeenCalledWith('nshn://');
    await expect(showLocation({...destination, app: 'neshan'})).rejects.toThrow(
      'neshan is only supported on Android.',
    );
    expect(Linking.openURL).not.toHaveBeenCalled();
  },
);
