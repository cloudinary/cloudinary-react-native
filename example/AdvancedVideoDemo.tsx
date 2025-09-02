import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { AdvancedVideo } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});

export default function AdvancedVideoDemo() {
  const videoPlayer = useRef<any>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [autoTracking, setAutoTracking] = useState(false);

  function createMyVideoObject() {
    const myVideo = cld.video('sea_turtle')
    return myVideo
  }

  const toggleAnalytics = () => {
    const newAnalyticsState = !analyticsEnabled;
    setAnalyticsEnabled(newAnalyticsState);
    
    if (newAnalyticsState && !autoTracking) {
      setAutoTracking(true);
    }
    
    Alert.alert(
      'Analytics', 
      `Analytics ${newAnalyticsState ? 'enabled' : 'disabled'}.${newAnalyticsState && !autoTracking ? ' Auto tracking also enabled.' : ''} Reload the video to see changes.`
    );
  };

  const toggleAutoTracking = () => {
    setAutoTracking(!autoTracking);
    Alert.alert(
      'Auto Tracking', 
      `Auto tracking ${!autoTracking ? 'enabled' : 'disabled'}. Reload the video to see changes.`
    );
  };

  const addCustomEventToVideo = () => {
    if (videoPlayer.current && videoPlayer.current.addCustomEvent) {
      videoPlayer.current.addCustomEvent('user_interaction', {
        action: 'button_clicked',
        buttonName: 'share',
        videoPosition: 30.5,
        customData: {
          userId: 'demo-user-123',
          sessionId: 'session-456'
        }
      });
      Alert.alert('Custom Event', 'Custom analytics event sent!');
    } else {
      Alert.alert('Error', 'Custom events not available');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Video Demo</Text>
      
      {/* Analytics Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleAnalytics}>
          <Text style={styles.buttonText}>
            {analyticsEnabled ? 'Disable Analytics' : 'Enable Analytics'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={toggleAutoTracking}>
          <Text style={styles.buttonText}>
            {autoTracking ? 'Disable Auto Tracking' : 'Enable Auto Tracking'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={addCustomEventToVideo}>
          <Text style={styles.buttonText}>Send Custom Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <AdvancedVideo
          ref={videoPlayer}
          videoStyle={styles.video}
          cldVideo={createMyVideoObject()}
          useNativeControls={true}
          enableAnalytics={analyticsEnabled}
          autoTrackAnalytics={autoTracking}
          analyticsOptions={{
            customData: {
              userId: 'demo-user-123',
              appVersion: '1.0.0',
              platform: 'react-native'
            },
            videoPlayerType: 'expo-av',
            videoPlayerVersion: '14.0.0'
          }}
        />
      </View>
      
      {/* Status Display */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Analytics: {analyticsEnabled ? '✅ Enabled' : '❌ Disabled'}
        </Text>
        <Text style={styles.statusText}>
          Auto Tracking: {autoTracking ? '✅ Enabled' : '❌ Disabled'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  videoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  video: {
    width: 400,
    height: 220,
  },
  statusContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginVertical: 2,
  },
}); 