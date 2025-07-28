import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopControlsProps } from '../types';
import { styles } from '../styles';
import { ICON_SIZES } from '../constants';

export const TopControls: React.FC<TopControlsProps> = ({ onBack, onShare }) => {
  return (
    <View style={styles.topControlsBar}>
      {onBack && (
        <TouchableOpacity style={styles.topButton} onPress={onBack}>
          <Ionicons name="close" size={ICON_SIZES.top} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.topButton} onPress={onShare}>
        <Ionicons name="share-outline" size={ICON_SIZES.top} color="white" />
      </TouchableOpacity>
    </View>
  );
}; 