jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(() => Promise.resolve('mockResolve')),
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
