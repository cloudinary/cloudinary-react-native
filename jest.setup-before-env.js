// This file runs before Jest environment is set up
// Mock React Native components globally before any imports

// Set NODE_ENV early 
process.env.NODE_ENV = 'test';

// Mock React Native entirely
jest.doMock('react-native', () => {
  const React = require('react');
  
  // Create mock components that work with React Native Testing Library
  const mockComponent = (name) => {
    const Component = React.forwardRef((props, ref) => {
      return React.createElement(name, { ...props, ref });
    });
    Component.displayName = name;
    return Component;
  };

  return {
    Platform: {
      OS: 'ios',
      select: jest.fn(options => options.ios),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    View: mockComponent('View'),
    Text: mockComponent('Text'), 
    Image: mockComponent('Image'),
    TouchableOpacity: mockComponent('TouchableOpacity'),
    ScrollView: mockComponent('ScrollView'),
    StyleSheet: {
      create: jest.fn(styles => styles),
    },
    Alert: {
      alert: jest.fn(),
    },
    Animated: {
      View: mockComponent('Animated.View'),
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
});
