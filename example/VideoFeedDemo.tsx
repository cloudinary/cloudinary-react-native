import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { CLDVideoLayer } from '../src/widgets/video/layer/CLDVideoLayer';
import AdvancedVideo from '../src/AdvancedVideo';
import { Cloudinary } from '@cloudinary/url-gen';
import { Ionicons } from '@expo/vector-icons';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'mobiledemoapp',
  },
  url: {
    secure: true,
  },
});

interface VideoFeedDemoProps {
  onBack?: () => void;
}

interface VideoItem {
  id: string;
  videoId: string;
  username: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  soundName: string;
}

// Video Item Component with loop support
interface VideoItemProps {
  item: VideoItem;
  index: number;
  currentIndex: number;
  styles: any;
}

const VideoItemComponent: React.FC<VideoItemProps> = ({ item, index, currentIndex, styles }) => {
  const myVideo = cld.video(item.videoId);
  const videoRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle playback status for looping and autoplay
  const handlePlaybackStatusUpdate = (status: any) => {
    if (!isLoaded && status.isLoaded) {
      setIsLoaded(true);
    }
    // Loop video when it ends
    if (status.didJustFinish && videoRef.current) {
      videoRef.current.setStatusAsync({
        positionMillis: 0,
        shouldPlay: index === currentIndex,
      });
    }
  };

  // Control play/pause based on visibility
  useEffect(() => {
    if (isLoaded && videoRef.current) {
      const timer = setTimeout(() => {
        try {
          if (index === currentIndex) {
            videoRef.current.setStatusAsync({ shouldPlay: true, isMuted: true });
          } else {
            videoRef.current.setStatusAsync({ shouldPlay: false });
          }
        } catch (error) {
          console.warn('Error setting video status:', error);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [index, currentIndex, isLoaded]);

  return (
    <View style={styles.videoContainer} pointerEvents="box-none">
      <View style={styles.videoWrapper} pointerEvents="none">
        <AdvancedVideo
          ref={videoRef}
          cldVideo={myVideo}
          videoStyle={styles.video}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false}
        />
      </View>

      {/* Scrollable area - allows scroll gestures to pass through */}
      <View style={styles.scrollableArea} pointerEvents="box-none" />

      {/* Right side action buttons */}
      <View style={styles.rightActions} pointerEvents="box-none">
        {/* Profile button */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.profileButton}>
            <Ionicons name="person" size={24} color="white" />
          </View>
          <View style={styles.followButton}>
            <Ionicons name="add" size={16} color="white" />
          </View>
        </TouchableOpacity>

        {/* Like button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart" size={40} color="white" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        {/* Comment button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={36} color="white" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={32} color="white" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>

        {/* Sound button */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.soundButton}>
            <Ionicons name="musical-notes" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom content */}
      <View style={styles.bottomContent} pointerEvents="box-none">
        <View style={styles.userInfo}>
          <Text style={styles.username}>@{item.username}</Text>
          <TouchableOpacity style={styles.followButtonSmall}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.soundInfo}>
          <Ionicons name="musical-note" size={14} color="white" />
          <Text style={styles.soundText}>{item.soundName}</Text>
        </View>
      </View>
    </View>
  );
};

const videoData: VideoItem[] = [
  {
    id: '1',
    videoId: 'qyamk3x9gmgihbvjftgt',
    username: 'creator1',
    description: 'Amazing video content #1 🎥 Check out this awesome moment!',
    likes: '1.2M',
    comments: '543',
    shares: '28',
    soundName: 'Original sound - @creator1',
  },
  {
    id: '2',
    videoId: 'n9nbziezbloxshrrdyz7',
    username: 'creator2',
    description: 'This is so cool! 🔥 Drop a like if you agree!',
    likes: '987K',
    comments: '421',
    shares: '19',
    soundName: 'Original sound - @creator2',
  },
  {
    id: '3',
    videoId: 'pyqfeubkgw0z6sxlsohu',
    username: 'creator3',
    description: 'You won\'t believe what happens next! 😱',
    likes: '2.1M',
    comments: '892',
    shares: '45',
    soundName: 'Trending sound - @creator3',
  },
  {
    id: '4',
    videoId: 'k2ysiacllbdfjwh6ytuy',
    username: 'creator4',
    description: 'Best moment ever captured! 📸 #viral',
    likes: '1.5M',
    comments: '678',
    shares: '34',
    soundName: 'Original sound - @creator4',
  },
  {
    id: '5',
    videoId: 'zdbreg8lnyflhengm0f7',
    username: 'creator5',
    description: 'Can\'t stop watching this! 🤩 Tag a friend',
    likes: '3.2M',
    comments: '1.2K',
    shares: '67',
    soundName: 'Popular sound - @creator5',
  },
  {
    id: '6',
    videoId: 'on62djua7bnddlqg3uax',
    username: 'creator6',
    description: 'This made my day! ❤️ Share the love',
    likes: '876K',
    comments: '334',
    shares: '22',
    soundName: 'Original sound - @creator6',
  },
  {
    id: '7',
    videoId: 'vsm6o2jm3xq7vdwrhxvy',
    username: 'creator7',
    description: 'Epic content! 🎬 Follow for more amazing videos',
    likes: '1.8M',
    comments: '765',
    shares: '41',
    soundName: 'Trending sound - @creator7',
  },
];

export default function VideoFeedDemo({ onBack }: VideoFeedDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Use window dimensions for proper layout
  const [dimensions, setDimensions] = useState(() => {
    const window = Dimensions.get('window');
    return {
      width: window.width,
      height: window.height,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const SCREEN_WIDTH = dimensions.width;
  const SCREEN_HEIGHT = dimensions.height;

  // Create styles with dynamic dimensions
  const styles = createStyles(SCREEN_WIDTH, SCREEN_HEIGHT);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <VideoItemComponent
      key={item.id}
      item={item}
      index={index}
      currentIndex={currentIndex}
      styles={styles}
    />
  );


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <FlatList
        ref={flatListRef}
        data={videoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        bounces={false}
        scrollEnabled={true}
        removeClippedSubviews={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        disableIntervalMomentum={true}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
      
      {/* Top bar with tabs - Fixed overlay */}
      <View style={styles.topBar} pointerEvents="box-none">
        {/* Back button */}
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>For You</Text>
            <View style={styles.tabIndicator} />
          </TouchableOpacity>
        </View>

        {/* Placeholder for alignment */}
        <View style={styles.placeholderRight} />
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="search" size={28} color="rgba(255,255,255,0.6)" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <View style={styles.addButtonInner}>
            <Ionicons name="add" size={28} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="chatbox" size={28} color="rgba(255,255,255,0.6)" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Inbox</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person" size={28} color="rgba(255,255,255,0.6)" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (SCREEN_WIDTH: number, SCREEN_HEIGHT: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 17,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: '#ffffff',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  videoWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  scrollableArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  placeholderRight: {
    width: 40,
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  followButton: {
    position: 'absolute',
    bottom: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fe2c55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomContent: {
    position: 'absolute',
    left: 16,
    right: 80,
    bottom: 120,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  followButtonSmall: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  followText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundText: {
    color: 'white',
    fontSize: 13,
    marginLeft: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 100,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    color: 'white',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelInactive: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  addButton: {
    width: 48,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonInner: {
    width: 48,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fe2c55',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

