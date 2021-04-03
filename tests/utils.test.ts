import {isAppInstalled} from '../src/utils';
import {generatePrefixes} from '../src/constants';

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
