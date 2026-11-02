import {Alert, Linking, Platform} from 'react-native';
import {getApps, showLocation} from '../src/index';
import {generatePrefixes} from '../src/constants';
import {isAppInstalled} from '../src/utils';
import type {ShowLocationProps} from '../src/type';

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

  const validCoordinates: [number | string, number | string][] = [
    [35.69972, 51.33722],
    [0, 0],
    [0, 51.33722],
    [35.69972, 0],
    [-35.5, -51.5],
    [-90, -180],
    [90, 180],
    ['35.69972', '51.33722'],
    ['0', '0'],
    ['0', '51.33722'],
    ['35.69972', '0'],
    ['-35.5', '-51.5'],
    ['-90', '-180'],
    ['90', '180'],
    ['  +35.69972  ', ' 51.33722 '],
    ['.5', '-.5'],
    ['35.', '051.00'],
  ];

  const selectApp = async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const options = jest.mocked(Alert.alert).mock.calls[0]?.[2];
    const choice = options?.find((option) => option.text === name);
    expect(choice).toBeDefined();
    choice?.onPress?.();
  };

  describe.each(['explicit', 'only app', 'mixed picker', 'callback'])(
    '%s opening',
    (path) => {
      it.each(validCoordinates)(
        'opens complete coordinates %s, %s',
        async (latitude, longitude) => {
          const coordinates = {latitude, longitude};
          let pending;
          if (path === 'callback') {
            const apps = await getApps({
              ...coordinates,
              appsWhiteList: ['neshan'],
            });
            pending = apps[0].open();
          } else {
            pending = showLocation({
              ...coordinates,
              ...(path === 'explicit'
                ? {app: 'neshan' as const}
                : {
                    appsWhiteList:
                      path === 'only app'
                        ? ['neshan']
                        : ['neshan', 'google-maps'],
                  }),
            });
            if (path === 'mixed picker') {
              await selectApp('Neshan');
            }
          }
          await expect(pending).resolves.toBe('neshan');
          expect(Linking.openURL).toHaveBeenCalledTimes(1);
          expect(Linking.openURL).toHaveBeenCalledWith(
            `nshn:${Number(latitude)},${Number(longitude)}`,
          );
          if (path !== 'mixed picker') {
            expect(Alert.alert).not.toHaveBeenCalled();
          }
        },
      );
    },
  );

  // Only ordinary decimal strings (with optional surrounding whitespace) are supported.
  const invalidCoordinates: unknown[] = [
    '35.7abc',
    '51.0foo',
    '',
    ' ',
    '\t\n',
    'NaN',
    'Infinity',
    '0x23',
    '0b10',
    '0o10',
    '3.5e1',
    '35,7',
    '35.7.1',
    '--35',
    '35 7',
    '+',
    '.',
    NaN,
    Infinity,
    -Infinity,
    undefined,
    null,
    true,
    false,
    {},
    [],
    [35],
  ];

  describe.each(['latitude', 'longitude'] as const)(
    '%s validation',
    (field) => {
      it.each(invalidCoordinates)(
        'rejects original input %p',
        async (value) => {
          await expect(
            showLocation({
              ...destination,
              [field]: value,
              app: 'neshan',
            } as ShowLocationProps),
          ).rejects.toThrow();
          expect(Linking.openURL).not.toHaveBeenCalled();
        },
      );

      it.each(['only app', 'mixed picker', 'callback'])(
        'rejects a suffix through %s without fallback',
        async (path) => {
          const coordinates = {...destination, [field]: '35.7invalid'};
          let pending;
          if (path === 'callback') {
            const apps = await getApps({
              ...coordinates,
              appsWhiteList: ['neshan'],
            });
            pending = apps[0].open();
          } else {
            pending = showLocation({
              ...coordinates,
              appsWhiteList:
                path === 'only app' ? ['neshan'] : ['neshan', 'google-maps'],
            });
          }
          // Attach the rejection handler before selecting an app.
          const rejection = pending.catch((error: Error) => error);
          if (path === 'mixed picker') {
            await selectApp('Neshan');
          }
          await expect(rejection).resolves.toMatchObject({
            message: expect.stringContaining(
              'neshan requires valid latitude and longitude',
            ),
          });
          expect(Linking.openURL).not.toHaveBeenCalled();
        },
      );
    },
  );

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
    [-90.001, 51],
    [35, -181],
    [35, 180.001],
    ['90.001', '51'],
    ['35', '-180.001'],
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

  it.each([
    {address: 'Azadi Square'},
    {sourceLatitude: 0},
    {sourceLongitude: 0},
    {directionsMode: 'walk' as const},
  ])('rejects unsupported picker options %j', async (options) => {
    const pending = showLocation({
      ...destination,
      ...options,
      appsWhiteList: ['neshan', 'google-maps'],
    });
    const rejection = pending.catch((error: Error) => error);
    await selectApp('Neshan');
    await expect(rejection).resolves.toMatchObject({
      message: expect.stringContaining(
        'neshan only supports displaying coordinates',
      ),
    });
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

describe('other providers retain their behavior', () => {
  it.each([
    [
      {latitude: '35.7abc', longitude: '51.0foo', app: 'google-maps'},
      'https://www.google.com/maps/search/?api=1&query=35.7,51',
    ],
    [
      {latitude: 123, longitude: 234, app: 'google-maps'},
      'https://www.google.com/maps/search/?api=1&query=123,234',
    ],
    [
      {address: '1 Main St', app: 'google-maps'},
      'https://www.google.com/maps/search/?api=1&query=1%20Main%20St',
    ],
    [{address: '1 Main St', app: 'waze'}, 'waze://?q=1%20Main%20St'],
    [
      {latitude: '35.7abc', longitude: '51.0foo', app: 'outmap'},
      'outmap://waypoint/@35.7,51',
    ],
  ] as [ShowLocationProps, string][])(
    'preserves URL handling for %j',
    async (options, url) => {
      await showLocation(options);
      expect(Linking.openURL).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).toHaveBeenCalledWith(url);
    },
  );

  it.each([
    [0, 51],
    [35, 0],
    [0, 0],
    ['0', '0'],
  ])(
    'accepts zero presence for Google Maps %s, %s',
    async (latitude, longitude) => {
      await showLocation({latitude, longitude, app: 'google-maps'});
      expect(Linking.openURL).toHaveBeenCalledWith(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      );
    },
  );

  it.each([
    {latitude: 0},
    {longitude: 0},
    {latitude: '', longitude: 51},
    {latitude: 35, longitude: ''},
    {latitude: 35},
    {longitude: 51},
    {},
  ])('still rejects missing picker coordinates %j', async (coordinates) => {
    await expect(showLocation(coordinates)).rejects.toThrow(
      '`latitude` & `longitude` or `address` is required.',
    );
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it.each([
    {title: 123},
    {address: 123},
    {googleForceLatLon: 'yes'},
    {googlePlaceId: 123},
    {app: 'unknown'},
    {appsWhiteList: ['unknown']},
    {appTitles: 'wrong'},
  ])('preserves option validation %j', async (options) => {
    await expect(
      showLocation({
        ...destination,
        ...options,
      } as ShowLocationProps),
    ).rejects.toThrow();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it.each(['google-maps', 'Cancel'])(
    'allows %s in the mixed picker with legacy string parsing',
    async (choice) => {
      const pending = showLocation({
        latitude: '35.7abc',
        longitude: '51.0foo',
        appsWhiteList: ['neshan', 'google-maps'],
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      const options = jest.mocked(Alert.alert).mock.calls[0]?.[2];
      const button = options?.find(
        (option) =>
          option.text === (choice === 'google-maps' ? 'Google Maps' : choice),
      );
      expect(button).toBeDefined();
      button?.onPress?.();
      await expect(pending).resolves.toBe(
        choice === 'Cancel' ? undefined : 'google-maps',
      );
      if (choice === 'Cancel') {
        expect(Linking.openURL).not.toHaveBeenCalled();
      } else {
        expect(Linking.openURL).toHaveBeenCalledWith(
          'https://www.google.com/maps/search/?api=1&query=35.7,51',
        );
      }
    },
  );

  it('keeps address-only auto-selection available to Google Maps', async () => {
    await showLocation({address: '1 Main St', appsWhiteList: ['google-maps']});
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://www.google.com/maps/search/?api=1&query=1%20Main%20St',
    );
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
