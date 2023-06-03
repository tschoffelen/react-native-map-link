jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn((url) => {
      return Promise.resolve(
        url.includes('https://') || url.includes('uber://'),
      );
    }),
  },
  Platform: {
    OS: 'ios',
  },
}));
