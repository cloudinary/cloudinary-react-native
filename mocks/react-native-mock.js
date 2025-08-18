const React = require('react');

// Create proper React components for testing
const MockView = React.forwardRef((props, ref) => React.createElement('View', { ...props, ref }));
const MockText = React.forwardRef((props, ref) => React.createElement('Text', { ...props, ref }));
const MockImage = React.forwardRef((props, ref) => React.createElement('Image', { ...props, ref }));
const MockTouchableOpacity = React.forwardRef((props, ref) => React.createElement('TouchableOpacity', { ...props, ref }));

// Mock React Native for Jest tests
const mockReactNative = {
  Platform: {
    OS: 'ios',
    select: jest.fn(options => options.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  View: MockView,
  Text: MockText,
  Image: MockImage,
  TouchableOpacity: MockTouchableOpacity,
  StyleSheet: {
    create: jest.fn(styles => styles),
  },
  Alert: {
    alert: jest.fn(),
  },
  Animated: {
    View: MockView,
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  },
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
  },
};

module.exports = mockReactNative;
