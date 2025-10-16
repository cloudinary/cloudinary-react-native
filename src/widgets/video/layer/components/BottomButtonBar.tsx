import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ButtonConfig } from '../types';

interface BottomButtonBarProps {
  isControlsVisible: boolean;
  bottomButtonBar?: {
    enabled: boolean;
    buttons: ButtonConfig[];
    style?: {
      marginHorizontal?: number;
      backgroundColor?: string;
      borderRadius?: number;
      paddingHorizontal?: number;
      paddingVertical?: number;
      marginBottom?: number;
    };
  };
}

export function BottomButtonBar({
  isControlsVisible,
  bottomButtonBar
}: BottomButtonBarProps) {
  if (!isControlsVisible || !bottomButtonBar?.enabled) return null;

  return (
    <View style={[
      {
        position: 'absolute',
        bottom: (() => {
          // Position button bar below the seekbar (closer to screen bottom)
          // Use a small bottom value to place it below the seekbar
          const spacingFromBottom = 0;
          
          return spacingFromBottom;
        })(),
        left: bottomButtonBar.style?.marginHorizontal || 20,
        right: bottomButtonBar.style?.marginHorizontal || 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Lower than seekbar and bottom controls
        backgroundColor: bottomButtonBar.style?.backgroundColor || 'rgba(0,0,0,0.7)',
        borderRadius: bottomButtonBar.style?.borderRadius || 20,
        paddingHorizontal: bottomButtonBar.style?.paddingHorizontal || 16,
        paddingVertical: bottomButtonBar.style?.paddingVertical || 8,
        marginBottom: bottomButtonBar.style?.marginBottom || 0,
      }
    ]}>
      {bottomButtonBar.buttons.map((button, index) => (
        <TouchableOpacity
          key={`bottom-bar-${index}`}
          style={{
            marginHorizontal: 16,
            paddingVertical: 8,
            paddingHorizontal: 8,
            backgroundColor: button.backgroundColor || 'transparent',
            borderRadius: button.backgroundColor ? 15 : 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={button.onPress || (() => {})}
        >
          <Ionicons 
            name={button.icon as any} 
            size={button.size || 20} 
            color={button.color || 'white'} 
          />
          {button.text && (
            <Text style={{
              color: button.textColor || button.color || 'white',
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 6,
            }}>
              {button.text}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
