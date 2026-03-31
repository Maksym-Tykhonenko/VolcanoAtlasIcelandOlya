import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainTabParamList } from './navTypes';

import PlaceGalleryScreen from '../screens/PlaceGalleryScreen';
import RouteMapScreen from '../screens/RouteMapScreen';
import SurpriseSpotScreen from '../screens/SurpriseSpotScreen';
import PlaceChallengeScreen from '../screens/PlaceChallengeScreen';
import StoryFactsScreen from '../screens/StoryFactsScreen';
import SavedSpotsScreen from '../screens/SavedSpotsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_GALLERY = require('../assets/icons/tab_gallery.png');
const ICON_MAP = require('../assets/icons/tab_map.png');
const ICON_SURPRISE = require('../assets/icons/tab_surprise.png');
const ICON_CHALLENGE = require('../assets/icons/tab_challenge.png');
const ICON_STORIES = require('../assets/icons/tab_stories.png');
const ICON_SAVED = require('../assets/icons/tab_saved.png');

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 370 || height < 750;
  const isAndroid = Platform.OS === 'android';

  const bottomOffset = isAndroid
    ? 50
    : Math.max(20, insets.bottom > 0 ? insets.bottom : 20);

  const barHeight = isAndroid
    ? isSmallScreen
      ? 66
      : 76
    : isSmallScreen
      ? 76
      : 86;

  const iconSize = isAndroid
    ? isSmallScreen
      ? 20
      : 25
    : isSmallScreen
      ? 22
      : 27;

  const horizontalPadding = isSmallScreen ? 14 : 18;
  const barWidth = Math.min(width - 24, 690);

  const getIcon = (routeName: keyof MainTabParamList) => {
    switch (routeName) {
      case 'PlaceGallery':
        return ICON_GALLERY;
      case 'RouteMap':
        return ICON_MAP;
      case 'SurpriseSpot':
        return ICON_SURPRISE;
      case 'PlaceChallenge':
        return ICON_CHALLENGE;
      case 'StoryFacts':
        return ICON_STORIES;
      case 'SavedSpots':
        return ICON_SAVED;
      default:
        return ICON_GALLERY;
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.tabBarWrapper, { bottom: bottomOffset }]}
    >
      <View
        style={[
          styles.tabBar,
          {
            width: barWidth,
            height: barHeight,
            borderRadius: barHeight / 2,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconSource = getIcon(route.name as keyof MainTabParamList);

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
              testID={descriptors[route.key].options.tabBarButtonTestID}
              style={styles.tabButton}
            >
              <Image
                source={iconSource}
                resizeMode="contain"
                style={{
                  width: iconSize,
                  height: iconSize,
                  tintColor: isFocused ? '#F3E68A' : '#000000',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="PlaceGallery" component={PlaceGalleryScreen} />
      <Tab.Screen name="RouteMap" component={RouteMapScreen} />
      <Tab.Screen name="SurpriseSpot" component={SurpriseSpotScreen} />
      <Tab.Screen name="PlaceChallenge" component={PlaceChallengeScreen} />
      <Tab.Screen name="StoryFacts" component={StoryFactsScreen} />
      <Tab.Screen name="SavedSpots" component={SavedSpotsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8F8969',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.45)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 14,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});