import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import {AdvancedImage, AdvancedVideo} from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';
import {scale} from "@cloudinary/url-gen/actions/resize";
import {cartoonify} from "@cloudinary/url-gen/actions/effect";
import {max} from "@cloudinary/url-gen/actions/roundCorners";
import React, {useRef, useState} from "react";

const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true
  }
});

export default function App() {
  const videoPlayer = useRef<any>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [autoTracking, setAutoTracking] = useState(false);

  function createMyImage() {
    var myImage = cld.image('sample').resize(scale().width(300)).effect(cartoonify()).roundCorners(max());
    return myImage
  }

  function createMyVideoObject() {
    const myVideo = cld.video('sea_turtle')
    return myVideo
  };

  const toggleAnalytics = () => {
    setAnalyticsEnabled(!analyticsEnabled);
    Alert.alert(
      'Analytics', 
      `Analytics ${!analyticsEnabled ? 'enabled' : 'disabled'}. Reload the video to see changes.`
    );
  };

  const toggleAutoTracking = () => {
    setAutoTracking(!autoTracking);
    Alert.alert(
      'Auto Tracking', 
      `Auto tracking ${!autoTracking ? 'enabled' : 'disabled'}. Reload the video to see changes.`
    );
  };

  const startManualTracking = () => {
    if (videoPlayer.current && videoPlayer.current.startAnalyticsTracking) {
      videoPlayer.current.startAnalyticsTracking(
        {
          publicId: 'jnwczzoacujqb4r4loj1',
          cloudName: 'mobiledemoapp',
          type: 'video'
        },
        {
          customData: {
            userId: 'test-user-123',
            sessionId: 'test-session-456',
            category: 'demo-video'
          }
        }
      );
      Alert.alert('Manual Tracking', 'Manual analytics tracking started!');
    } else {
      Alert.alert('Error', 'Video ref not available or analytics not enabled');
    }
  };

  const stopManualTracking = () => {
    if (videoPlayer.current && videoPlayer.current.stopAnalyticsTracking) {
      videoPlayer.current.stopAnalyticsTracking();
      Alert.alert('Manual Tracking', 'Manual analytics tracking stopped!');
    } else {
      Alert.alert('Error', 'Video ref not available');
    }
  };

  const startAutoTrackingManually = () => {
    if (videoPlayer.current && videoPlayer.current.startAutoAnalyticsTracking) {
      videoPlayer.current.startAutoAnalyticsTracking({
        customData: {
          userId: 'test-user-123',
          source: 'manual-trigger'
        }
      });
      Alert.alert('Auto Tracking', 'Auto analytics tracking started manually!');
    } else {
      Alert.alert('Error', 'Video ref not available or analytics not enabled');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <AdvancedImage cldImg={createMyImage()} style={{backgroundColor:"black", width:300, height:200}}/>
      </View>
      
      {/* Analytics Controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.title}>Analytics Testing</Text>
        
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
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.smallButton]} onPress={startManualTracking}>
            <Text style={styles.buttonText}>Start Manual</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.smallButton]} onPress={stopManualTracking}>
            <Text style={styles.buttonText}>Stop Manual</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={startAutoTrackingManually}>
          <Text style={styles.buttonText}>Start Auto Manually</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <AdvancedVideo
          ref={videoPlayer}
          videoStyle={styles.video}
          cldVideo={createMyVideoObject()}
          enableAnalytics={true}
          autoTrackAnalytics={true}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  controlsContainer: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  smallButton: {
    minWidth: 90,
    marginHorizontal: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
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
