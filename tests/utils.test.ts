import {generatePrefixes} from '../src/constants';
import {
  getDirectionsModeAppleMaps,
  getDirectionsModeGoogleMaps,
  isAppInstalled,
} from '../src/utils';

describe('app installed check', () => {
  test('returns false for unknown apps', () => {
    return expect(isAppInstalled('unknown-app', {})).resolves.toBeFalsy();
  });

  test('returns false for Google Maps non-browser mode', () => {
    return expect(
      isAppInstalled('google-maps', generatePrefixes({})),
    ).resolves.toBeFalsy();
  });

  test('returns true for Google Maps browser mode', () => {
    return expect(
      isAppInstalled(
        'google-maps',
        generatePrefixes({alwaysIncludeGoogle: true}),
      ),
    ).resolves.toBeTruthy();
  });
});

describe('getDirectionsModeGoogleMaps', () => {
  it('should return the correct Google Maps mode for car', () => {
    expect(getDirectionsModeGoogleMaps('car')).toBe('driving');
  });

  it('should return the correct Google Maps mode for walk', () => {
    expect(getDirectionsModeGoogleMaps('walk')).toBe('walking');
  });

  it('should return the correct Google Maps mode for public transport', () => {
    expect(getDirectionsModeGoogleMaps('public-transport')).toBe('transit');
  });

  it('should return the correct Google Maps mode for bike', () => {
    expect(getDirectionsModeGoogleMaps('bike')).toBe('bicycling');
  });

  // it('should return undefined for an unknown mode', () => {
  //   expect(getDirectionsModeGoogleMaps('unknown')).toBeUndefined();
  // });
});

describe('getDirectionsModeAppleMaps', () => {
  it('should return the correct Apple Maps mode for car', () => {
    expect(getDirectionsModeAppleMaps('car')).toBe('d');
  });

  it('should return the correct Apple Maps mode for walk', () => {
    expect(getDirectionsModeAppleMaps('walk')).toBe('w');
  });

  it('should return the correct Apple Maps mode for public transport', () => {
    expect(getDirectionsModeAppleMaps('public-transport')).toBe('r');
  });

  // it('should return undefined for an unknown mode', () => {
  //   expect(getDirectionsModeAppleMaps('unknown')).toBeUndefined();
  // });
});
