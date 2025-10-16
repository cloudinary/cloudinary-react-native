import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ButtonConfig } from '../types';
import { styles, getResponsiveStyles } from '../styles';
import { ICON_SIZES } from '../constants';

interface CustomButtonProps {
  config: ButtonConfig;
  isLandscape?: boolean;
  style?: any;
  defaultOnPress?: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  config, 
  isLandscape = false,
  style,
  defaultOnPress
}) => {
  const responsiveStyles = getResponsiveStyles(isLandscape);
  
  const handlePress = () => {
    if (config.onPress) {
      config.onPress();
    } else if (defaultOnPress) {
      defaultOnPress();
    }
  };

  const buttonStyle = [
    responsiveStyles.topButton,
    {
      backgroundColor: config.backgroundColor || 'rgba(0, 0, 0, 0.7)',
    },
    style
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={handlePress}
    >
      <Ionicons 
        name={config.icon as any} 
        size={config.size || ICON_SIZES.top} 
        color={config.color || 'white'} 
      />
    </TouchableOpacity>
  );
};
