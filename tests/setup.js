jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn((url) => {
    return Promise.resolve(url.includes('https://') || url.includes('uber://'));
  }),
}));
