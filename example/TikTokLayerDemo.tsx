import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { AdvancedVideo } from 'cloudinary-react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import {
  TikTokLikeIcon,
  TikTokCommentsIcon,
  TikTokShareIcon,
  TikTokHomeIcon,
  TikTokDiscoverIcon,
  TikTokInboxIcon,
  TikTokProfileIcon,
  TikTokPlusIcon,
  TikTokMusicIcon,
} from './components/TikTokIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const cld = new Cloudinary({
  cloud: {
    cloudName: 'mobiledemoapp'
  },
  url: {
    secure: true
  }
});

interface TikTokLayerDemoProps {
  onBack?: () => void;
}

interface VideoItem {
  id: string;
  username: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  isFollowing: boolean;
}

// Mock data for the video feed
const videoData: VideoItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: `video_${index}`,
  username: `@user${index + 1}`,
  description: `Amazing video content #${index + 1} 🎥 This is a sample description for the video that shows how TikTok-style content works in our player!`,
  likes: `${Math.floor(Math.random() * 1000) + 100}K`,
  comments: `${Math.floor(Math.random() * 500) + 50}`,
  shares: `${Math.floor(Math.random() * 200) + 20}`,
  isFollowing: Math.random() > 0.5,
}));

export default function TikTokLayerDemo({ onBack }: TikTokLayerDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou');
  const [isPlaying, setIsPlaying] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<{ [key: string]: any }>({});

  // Array of video IDs to cycle through
  const videoIds = [
    'on62djua7bnddlqg3uax',
    'zdbreg8lnyflhengm0f7',
    'k2ysiacllbdfjwh6ytuy',
    'vsm6o2jm3xq7vdwrhxvy',
    'pyqfeubkgw0z6sxlsohu',
    'n9nbziezbloxshrrdyz7',
    'qyamk3x9gmgihbvjftgt'
  ];

  function createMyVideoObject(index: number) {
    // Cycle through the video IDs based on the index
    const videoId = videoIds[index % videoIds.length];
    const myVideo = cld.video(videoId);
    return myVideo;
  }

  const handleViewabilityChange = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setCurrentIndex(visibleIndex);
      
      // Pause all videos except the current one
      Object.keys(videoRefs.current).forEach((key, index) => {
        const videoRef = videoRefs.current[key];
        if (videoRef) {
          if (index === visibleIndex) {
            videoRef.playAsync();
          } else {
            videoRef.pauseAsync();
          }
        }
      });
    }
  };

  const handleLike = (index: number) => {
    Alert.alert('Like', `Liked video ${index + 1}!`);
  };

  const handleComment = (index: number) => {
    Alert.alert('Comment', `Commenting on video ${index + 1}!`);
  };

  const handleShare = (index: number) => {
    Alert.alert('Share', `Sharing video ${index + 1}!`);
  };

  const handleFollow = (index: number) => {
    Alert.alert('Follow', `Following user ${index + 1}!`);
  };

  const renderVideoItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <View style={styles.videoContainer}>
      {/* Video Player */}
      <AdvancedVideo
        ref={(ref) => {
          if (ref) {
            videoRefs.current[item.id] = ref;
          }
        }}
        cldVideo={createMyVideoObject(index)}
        videoStyle={styles.video}
        enableAnalytics={false}
      />

      {/* Top Navigation */}
      <View style={styles.topNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'foryou' && styles.activeTab]}
          onPress={() => setActiveTab('foryou')}
        >
          <Text style={[styles.tabText, activeTab === 'foryou' && styles.activeTabText]}>
            For You
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right Side Actions */}
      <View style={styles.rightActions}>
        {/* Profile Picture */}
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profilePicture}>
            <TikTokProfileIcon width={30} height={30} color="#fff" />
          </View>
          {!item.isFollowing && <View style={styles.followIndicator}>
            <TikTokPlusIcon width={12} height={12} color="#fff" />
          </View>}
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(index)}>
          <TikTokLikeIcon width={32} height={32} color="#fff" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(index)}>
          <TikTokCommentsIcon width={32} height={32} color="#fff" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(index)}>
          <TikTokShareIcon width={32} height={32} color="#fff" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>

        {/* Spinning Record */}
        <TouchableOpacity style={styles.recordButton}>
          <View style={styles.spinningRecord}>
            <TikTokMusicIcon width={30} height={30} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          {!item.isFollowing && (
            <TouchableOpacity onPress={() => handleFollow(index)}>
              <Text style={styles.followButton}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.musicBar}>
          <TikTokMusicIcon width={16} height={16} />
          <Text style={styles.musicText}>Original sound - {item.username}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Video Feed */}
      <FlatList
        ref={flatListRef}
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewabilityChange}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavigationBar}>
        <TouchableOpacity style={styles.navButton}>
          <TikTokHomeIcon width={24} height={24} color="#fff" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <TikTokDiscoverIcon width={24} height={24} color="#fff" />
          <Text style={styles.navLabel}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.createButton}>
          <View style={styles.createButtonInner}>
            <TikTokPlusIcon width={20} height={20} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <TikTokInboxIcon width={24} height={24} color="#fff" />
          <Text style={styles.navLabel}>Inbox</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton}>
          <TikTokProfileIcon width={24} height={24} color="#fff" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Back button (for demo purposes) */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topNavigation: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  rightActions: {
    position: 'absolute',
    right: 15,
    bottom: 200,
    alignItems: 'center',
    zIndex: 10,
  },
  profileButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  followIndicator: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#ff0050',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 5,
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  recordButton: {
    marginTop: 10,
  },
  spinningRecord: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  bottomContent: {
    position: 'absolute',
    bottom: 120,
    left: 15,
    right: 80,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  followButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
  },
  musicBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  musicText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
  },
  bottomNavigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },

  navLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  createButton: {
    alignItems: 'center',
    flex: 1,
  },
  createButtonInner: {
    width: 45,
    height: 30,
    backgroundColor: '#ff0050',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
