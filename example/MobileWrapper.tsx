import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions, useWindowDimensions, Text, Linking, Image } from 'react-native';

interface MobileWrapperProps {
  children: React.ReactNode;
}

// Mock mobile dimensions for web
const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;

// Store original Dimensions.get at module level
const originalDimensionsGet = Dimensions.get;
let isDimensionOverridden = false;

const applyDimensionOverride = () => {
  if (Platform.OS === 'web' && !isDimensionOverridden) {
    isDimensionOverridden = true;
    Dimensions.get = (dim: 'window' | 'screen') => {
      if (dim === 'window') {
        const original = originalDimensionsGet('window');
        // Only override if we're on desktop (width >= 768)
        if (original.width >= 768) {
          return {
            width: MOBILE_WIDTH - 24, // Match phoneScreen width
            height: MOBILE_HEIGHT - 24, // Match phoneScreen height
            scale: original.scale,
            fontScale: original.fontScale,
          };
        }
        return original;
      }
      return originalDimensionsGet(dim);
    };
    
    // Trigger a dimension change event to notify all listeners
    // This ensures useWindowDimensions and other hooks pick up the override
    if (typeof window !== 'undefined') {
      // Dispatch a resize event to trigger React Native's dimension listeners
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 0);
    }
  }
};

// Apply dimension override immediately on module load for web
if (Platform.OS === 'web') {
  // Check if we're on desktop by looking at window size
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    applyDimensionOverride();
  }
}

const MobileWrapper: React.FC<MobileWrapperProps> = ({ children }) => {
  const windowDims = useWindowDimensions();
  // Start with false for web desktop to ensure we wait for override
  const [isReady, setIsReady] = useState(() => {
    if (Platform.OS !== 'web') return true;
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return false;
    return true;
  });

  // Apply dimension override and mark as ready
  useLayoutEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768) {
      // Ensure override is applied (idempotent)
      applyDimensionOverride();
      // Trigger resize event to force all components to update dimensions
      window.dispatchEvent(new Event('resize'));
      
      // Wait for resize event to be processed and components to pick up new dimensions
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, []);

  // Only apply wrapper on web platform
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // Check using window.innerWidth instead of windowDims for consistency
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  // If screen is already mobile-sized, don't apply wrapper
  if (!isDesktop) {
    return <>{children}</>;
  }

  // Wait for dimensions to be ready before rendering on desktop
  if (!isReady) {
    return (
      <View style={styles.desktopContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Desktop view - wrap in mobile frame
  return (
    <View style={styles.desktopContainer}>
      <View style={styles.contentWrapper}>
        {/* Left side - Description */}
        <View style={styles.descriptionContainer}>
          <View style={styles.titleContainer}>
            {Platform.OS === 'web' ? (
              <div style={{ marginRight: 16, display: 'flex' }}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" style={{ height: 50, width: 50 }}>
                  <g fill="#ffffff" fillRule="nonzero">
                    <path d="M405.343 210.693c-21.045-65.997-82.54-111.27-151.81-111.77-58.25-.334-112.116 31.666-139.683 82.982C57.452 192.013 16 241.552 16 298.85c0 46.326 27.094 88.6 69.182 107.949l2.982 1.351h.2v-33.797C62.131 358.249 46.1 329.596 46.1 298.821c0-45.074 34.382-83.333 79.202-88.128l8.35-.875 3.658-7.515c21.169-44.863 66.617-73.52 116.223-73.28 59.476.42 111.444 41.598 125.448 99.404l2.863 11.371h11.929c39.742.816 72.024 33.65 72.167 73.4 0 28.032-16.183 50.975-43.738 62.585v32.048l1.988-.636C468.485 392.682 496 356.658 496 313.2c-.374-51.778-39.312-95.806-90.657-102.506z"/>
                    <path d="M195.243 404.253l6.6 6.6a1.316 1.316 0 01-.915 2.227h-52.087c-13.09 0-23.857-10.768-23.857-23.857V288.069c0-.72-.593-1.312-1.312-1.312h-11.146c-.72 0-1.312-.592-1.312-1.312 0-.342.131-.668.37-.915l44.215-44.215a1.312 1.312 0 011.869 0l44.175 44.215a1.316 1.316 0 01-.915 2.227h-11.292c-.727 0-1.332.584-1.352 1.312v99.404a23.853 23.853 0 006.959 16.78zM292.937 404.253l6.64 6.6c.239.247.37.573.37.915 0 .72-.592 1.312-1.312 1.312h-51.981c-13.09 0-23.857-10.768-23.857-23.857v-75.587c0-.728-.584-1.332-1.312-1.352h-11.252a1.316 1.316 0 01-.915-2.227l44.175-44.135a1.312 1.312 0 011.87 0l44.214 44.056c.239.246.37.572.37.914 0 .72-.592 1.312-1.312 1.312H287.33a1.356 1.356 0 00-1.312 1.352v73.917a23.86 23.86 0 006.918 16.78zM390.671 404.253l6.6 6.6a1.316 1.316 0 01-.915 2.227h-52.126c-13.09 0-23.857-10.768-23.857-23.857v-50.22c0-.719-.593-1.311-1.312-1.311h-11.15c-.72 0-1.312-.593-1.312-1.312 0-.362.151-.708.414-.955l44.215-44.175c.238-.246.568-.39.914-.39.346 0 .676.144.915.39l44.215 44.175c.262.247.413.593.413.955 0 .72-.592 1.312-1.312 1.312h-11.348c-.72 0-1.312.592-1.312 1.312v48.47a23.853 23.853 0 006.958 16.779z"/>
                  </g>
                </svg>
              </div>
            ) : (
              <Image 
                source={require('./assets/cloudinary-icon.svg')}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
            <Text style={styles.mainTitle}>Cloudinary React Native SDK</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Transform, optimize, and deliver images and videos at scale
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎬</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Video Player Components</Text>
                <Text style={styles.featureDescription}>
                  Rich video playback with customizable controls, layers, and interactive overlays
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🖼️</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Advanced Image Delivery</Text>
                <Text style={styles.featureDescription}>
                  Automatic format optimization, responsive images, and on-the-fly transformations
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Performance Optimized</Text>
                <Text style={styles.featureDescription}>
                  Lazy loading, adaptive bitrate streaming, and intelligent caching for smooth experiences
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎨</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Dynamic Transformations</Text>
                <Text style={styles.featureDescription}>
                  Resize, crop, filter, and enhance media assets on-the-fly with URL-based transformations
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Cross-Platform Support</Text>
                <Text style={styles.featureDescription}>
                  Works seamlessly on iOS, Android, and Web with a unified API
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.docsLinkContainer}>
            <Text style={styles.docsText}>Learn more about implementation:</Text>
            {Platform.OS === 'web' ? (
              <a 
                href="https://cloudinary.com/documentation/react_native_integration"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  fontSize: 16,
                  fontWeight: '600',
                  textDecoration: 'none',
                  marginTop: 8,
                }}
              >
                View Documentation →
              </a>
            ) : (
              <Text
                style={styles.docsLink}
                onPress={() => Linking.openURL('https://cloudinary.com/documentation/react_native_integration')}
              >
                View Documentation →
              </Text>
            )}
          </View>
        </View>
        
        {/* Right side - Phone frame */}
        <View style={styles.phoneContainer}>
          <View style={styles.phoneFrame}>
            {/* Phone notch */}
            <View style={styles.notch} />
            
            {/* Phone screen - this is where we need to constrain dimensions */}
            <View style={styles.phoneScreen}>
              {isReady ? children : null}
            </View>
            
            {/* Phone home indicator (bottom bar) */}
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    backgroundColor: '#0f172a', // Darker background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    // @ts-ignore - web only
    minHeight: '100vh',
    overflow: 'auto',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1400,
    width: '100%',
    gap: 60,
  },
  descriptionContainer: {
    flex: 1,
    maxWidth: 600,
    paddingRight: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 16,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    // @ts-ignore - web only
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: 20,
    color: '#94a3b8',
    marginBottom: 40,
    // @ts-ignore - web only
    lineHeight: '1.6',
  },
  featuresList: {
    gap: 24,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIcon: {
    fontSize: 32,
    lineHeight: 32,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 15,
    color: '#94a3b8',
    // @ts-ignore - web only
    lineHeight: '1.6',
  },
  docsLinkContainer: {
    marginTop: 20,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  docsText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  docsLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginTop: 8,
  },
  phoneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: MOBILE_WIDTH,
    height: MOBILE_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 50,
    overflow: 'visible', // Changed from 'hidden' to allow touch events
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    // @ts-ignore - web only
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    borderWidth: 12,
    borderColor: '#1a1a1a',
    position: 'relative',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    // @ts-ignore - web only
    transform: 'translateX(-50%)',
    width: 150,
    height: 30,
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 100,
  },
  phoneScreen: {
    width: MOBILE_WIDTH - 24, // Account for border (12px on each side)
    height: MOBILE_HEIGHT - 24, // Account for border
    backgroundColor: '#000000',
    overflow: 'visible', // Allow content and touch events to flow through
    borderRadius: 38, // Match the phone's inner border radius
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    // @ts-ignore - web only
    transform: 'translateX(-50%)',
    width: 134,
    height: 5,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    opacity: 0.3,
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // @ts-ignore - web only
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});

export default MobileWrapper;

