import Share from 'react-native-share';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn((url) => {
    return Promise.resolve(url.includes('https://') || url.includes('uber://'));
  }),
}));

jest.mock('react-native-share', () => ({
  isPackageInstalled: jest.fn((appPackageName) => {
    const isAppInstalled = appPackageName === 'com.tranzmate';
    return Promise.resolve({
      isInstalled: isAppInstalled,
      message: isAppInstalled ? 'Installed' : 'Not installed',
    });
  }),
}));
