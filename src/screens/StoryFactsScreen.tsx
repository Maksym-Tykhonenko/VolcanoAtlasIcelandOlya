import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  FlatList,
  Platform,
  StatusBar,
  Share,
  useWindowDimensions,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { factNotes, type FactNote } from '../data/factNotes';

const BG_IMAGE = require('../assets/images/gallery_base_backdrop.png');
const BOOKMARK_ICON = require('../assets/icons/action_bookmark_soft.png');
const SHARE_ICON = require('../assets/icons/action_share_soft.png');

type TabType = 'facts' | 'tips';

export default function StoryFactsScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const isSmallScreen = height <= 740;
  const isVerySmallScreen = height <= 680;
  const isNarrowScreen = width <= 360;

  const androidTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const topOffset = Platform.OS === 'ios' ? insets.top + 10 : androidTop + 14;
  const bottomSafe = Platform.OS === 'android' ? 120 : 106;

  const [activeTab, setActiveTab] = useState<TabType>('facts');
  const listRef = useRef<FlatList<FactNote> | null>(null);

  const visibleNotes = useMemo(() => {
    return factNotes.filter(item => item.type === activeTab);
  }, [activeTab]);

  const screenTitle = activeTab === 'facts' ? 'Volcano Facts' : 'Travel Tips';

  const scrollListToTop = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollListToTop();
      return undefined;
    }, [scrollListToTop]),
  );

  useEffect(() => {
    scrollListToTop();
  }, [activeTab, scrollListToTop]);

  const handleShare = async (item: FactNote) => {
    try {
      await Share.share({
        message: `${item.title}\n\n${item.text}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const renderCard: ListRenderItem<FactNote> = ({ item }) => {
    return (
      <View
        style={[
          styles.card,
          {
            borderRadius: isVerySmallScreen ? 18 : 22,
            paddingTop: isVerySmallScreen ? 14 : 16,
            paddingBottom: isVerySmallScreen ? 44 : 48,
            paddingHorizontal: isVerySmallScreen ? 14 : 16,
            minHeight: isVerySmallScreen ? 230 : isSmallScreen ? 255 : 275,
          },
        ]}
      >
        <Image
          source={BOOKMARK_ICON}
          resizeMode="contain"
          style={[
            styles.bookmarkIcon,
            {
              width: isVerySmallScreen ? 24 : 28,
              height: isVerySmallScreen ? 36 : 42,
              marginBottom: isVerySmallScreen ? 8 : 10,
            },
          ]}
        />

        <Text
          style={[
            styles.cardText,
            {
              fontSize: isVerySmallScreen ? 12.6 : isSmallScreen ? 13.6 : 14.2,
              lineHeight: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 21,
              paddingHorizontal: isNarrowScreen ? 4 : 8,
            },
          ]}
        >
          {item.text}
        </Text>

        <Pressable
          style={[
            styles.shareButton,
            {
              width: isVerySmallScreen ? 40 : 44,
              height: isVerySmallScreen ? 40 : 44,
              borderRadius: isVerySmallScreen ? 20 : 22,
              left: isVerySmallScreen ? 14 : 16,
              bottom: isVerySmallScreen ? 12 : 14,
            },
          ]}
          onPress={() => handleShare(item)}
        >
          <Image
            source={SHARE_ICON}
            resizeMode="contain"
            style={[
              styles.shareIcon,
              {
                width: isVerySmallScreen ? 17 : 19,
                height: isVerySmallScreen ? 17 : 19,
              },
            ]}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <ImageBackground source={BG_IMAGE} resizeMode="cover" style={styles.container}>
      <View style={styles.overlay} />

      <View
        style={[
          styles.headerWrap,
          {
            paddingTop: topOffset,
            paddingHorizontal: isVerySmallScreen ? 16 : 18,
          },
        ]}
      >
        <View
          style={[
            styles.titlePill,
            {
              minWidth: isVerySmallScreen ? 220 : 280,
              height: isVerySmallScreen ? 44 : 50,
              borderRadius: isVerySmallScreen ? 22 : 25,
              paddingHorizontal: isVerySmallScreen ? 24 : 28,
            },
          ]}
        >
          <Text
            style={[
              styles.titleText,
              {
                fontSize: isVerySmallScreen ? 15 : 17,
              },
            ]}
          >
            {screenTitle}
          </Text>
        </View>

        <View
          style={[
            styles.segmentWrap,
            {
              marginTop: isVerySmallScreen ? 18 : 22,
              width: isVerySmallScreen ? width - 72 : width - 62,
              maxWidth: 360,
              height: isVerySmallScreen ? 58 : 64,
              borderRadius: isVerySmallScreen ? 29 : 32,
              padding: isVerySmallScreen ? 6 : 7,
            },
          ]}
        >
          <Pressable
            style={[
              styles.segmentButton,
              activeTab === 'facts' && styles.segmentButtonActive,
              {
                borderRadius: isVerySmallScreen ? 22 : 26,
              },
            ]}
            onPress={() => setActiveTab('facts')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'facts' && styles.segmentTextActive,
                {
                  fontSize: isVerySmallScreen ? 16 : 18,
                },
              ]}
            >
              Facts
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentButton,
              activeTab === 'tips' && styles.segmentButtonActive,
              {
                borderRadius: isVerySmallScreen ? 22 : 26,
              },
            ]}
            onPress={() => setActiveTab('tips')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'tips' && styles.segmentTextActive,
                {
                  fontSize: isVerySmallScreen ? 16 : 18,
                },
              ]}
            >
              Tips
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={visibleNotes}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: isVerySmallScreen ? 18 : 22,
          paddingHorizontal: isVerySmallScreen ? 16 : 18,
          paddingBottom: bottomSafe + insets.bottom,
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: isVerySmallScreen ? 14 : 18 }} />
        )}
        removeClippedSubviews={false}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5A020A',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80,0,0,0.08)',
  },
  headerWrap: {
    alignItems: 'center',
  },
  titlePill: {
    backgroundColor: '#B9B282',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#111111',
    fontWeight: '800',
  },
  segmentWrap: {
    backgroundColor: '#F5F0D8',
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#D97300',
  },
  segmentText: {
    color: '#111111',
    fontWeight: '800',
  },
  segmentTextActive: {
    color: '#FFF8EF',
  },
  card: {
    backgroundColor: '#C89249',
    borderWidth: 2,
    borderColor: '#8A6400',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bookmarkIcon: {
    tintColor: '#FFD02A',
  },
  cardText: {
    color: '#111111',
    fontWeight: '700',
    textAlign: 'center',
  },
  shareButton: {
    position: 'absolute',
    backgroundColor: '#B7AA2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    tintColor: '#FFF8EF',
  },
});