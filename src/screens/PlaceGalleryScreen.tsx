import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList, RootStackParamList } from '../navigation/navTypes';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  placeCategories,
  getPlacesByCategory,
  type PlaceCategory,
  type PlaceItem,
} from '../data/placeCatalog';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'PlaceGallery'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BG_DARK = require('../assets/images/gallery_base_backdrop.png');
const BG_RED = require('../assets/images/gallery_active_layer.png');
const BACK_ICON = require('../assets/icons/nav_back_soft.png');

const CATEGORY_IMAGE_MAP: Record<string, any> = {
  'cat_all_volcanic_realm.png': require('../assets/images/cat_all_volcanic_realm.png'),
  'cat_active_fire_peaks.png': require('../assets/images/cat_active_fire_peaks.png'),
  'cat_lava_terrain_lines.png': require('../assets/images/cat_lava_terrain_lines.png'),
  'cat_crater_ring_trails.png': require('../assets/images/cat_crater_ring_trails.png'),
  'cat_geothermal_steam_basin.png': require('../assets/images/cat_geothermal_steam_basin.png'),
};

const PLACE_IMAGE_MAP: Record<string, any> = {
  'place_fagradalsfjall_flow_view.png': require('../assets/images/place_fagradalsfjall_flow_view.png'),
  'place_eyjafjallajokull_ice_fire.png': require('../assets/images/place_eyjafjallajokull_ice_fire.png'),
  'place_hekla_ridge_panorama.png': require('../assets/images/place_hekla_ridge_panorama.png'),
  'place_grimsvotn_glacier_field.png': require('../assets/images/place_grimsvotn_glacier_field.png'),
  'place_katla_black_sands_view.png': require('../assets/images/place_katla_black_sands_view.png'),

  'place_eldhraun_moss_waves.png': require('../assets/images/place_eldhraun_moss_waves.png'),
  'place_hallmundarhraun_stone_rivers.png': require('../assets/images/place_hallmundarhraun_stone_rivers.png'),
  'place_dimmuborgir_dark_castles.png': require('../assets/images/place_dimmuborgir_dark_castles.png'),
  'place_berserkjahraun_rugged_lines.png': require('../assets/images/place_berserkjahraun_rugged_lines.png'),
  'place_leitarhraun_ancient_flow.png': require('../assets/images/place_leitarhraun_ancient_flow.png'),

  'place_hverfjall_rim_walk.png': require('../assets/images/place_hverfjall_rim_walk.png'),
  'place_kerid_blue_lake_ring.png': require('../assets/images/place_kerid_blue_lake_ring.png'),
  'place_saxholl_highland_steps.png': require('../assets/images/place_saxholl_highland_steps.png'),
  'place_grabrok_ring_road_view.png': require('../assets/images/place_grabrok_ring_road_view.png'),
  'place_askja_remote_caldera.png': require('../assets/images/place_askja_remote_caldera.png'),

  'place_geysir_steam_column.png': require('../assets/images/place_geysir_steam_column.png'),
  'place_haukadalur_mineral_ground.png': require('../assets/images/place_haukadalur_mineral_ground.png'),
  'place_namaskard_color_fields.png': require('../assets/images/place_namaskard_color_fields.png'),
  'place_krysuvik_steam_valley.png': require('../assets/images/place_krysuvik_steam_valley.png'),
  'place_hverir_earth_steam.png': require('../assets/images/place_hverir_earth_steam.png'),
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = height <= 740;
const isVerySmallScreen = height <= 680;

export default function PlaceGalleryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(22)).current;
  const screenScale = useRef(new Animated.Value(0.985)).current;

  const visiblePlaces = useMemo(() => {
    if (!selectedCategory) return [];
    return getPlacesByCategory(selectedCategory.id);
  }, [selectedCategory]);

  const runAppearAnimation = () => {
    screenOpacity.setValue(0);
    screenTranslateY.setValue(22);
    screenScale.setValue(0.985);

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(screenScale, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    runAppearAnimation();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelectedCategory(null);
    });

    return unsubscribe;
  }, [navigation]);

  const openCategory = (category: PlaceCategory) => {
    setSelectedCategory(category);
    requestAnimationFrame(() => {
      runAppearAnimation();
    });
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
    requestAnimationFrame(() => {
      runAppearAnimation();
    });
  };

  const renderCategoryCard = ({ item }: { item: PlaceCategory; index: number }) => {
    const imageSource = CATEGORY_IMAGE_MAP[item.imageName];

    return (
      <Animated.View
        style={[
          styles.animatedItemWrap,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }, { scale: screenScale }],
          },
        ]}
      >
        <View
          style={[
            styles.categoryCard,
            {
              minHeight: isVerySmallScreen ? 76 : 82,
              paddingHorizontal: isVerySmallScreen ? 12 : 14,
              paddingVertical: isVerySmallScreen ? 10 : 12,
              marginBottom: isVerySmallScreen ? 14 : 18,
            },
          ]}
        >
          <Image
            source={imageSource}
            resizeMode="contain"
            style={[
              styles.categoryImage,
              {
                width: isVerySmallScreen ? 68 : 78,
                height: isVerySmallScreen ? 58 : 66,
                marginRight: isVerySmallScreen ? 10 : 12,
              },
            ]}
          />

          <View style={styles.categoryTextWrap}>
            <Text
              style={[
                styles.categoryTitle,
                {
                  fontSize: isVerySmallScreen ? 14 : 15,
                  marginBottom: isVerySmallScreen ? 8 : 10,
                },
              ]}
            >
              {item.title}
            </Text>

            <Pressable
              style={[
                styles.openButton,
                {
                  minWidth: isVerySmallScreen ? 88 : 96,
                  height: isVerySmallScreen ? 28 : 30,
                  paddingHorizontal: isVerySmallScreen ? 16 : 18,
                },
              ]}
              onPress={() => openCategory(item)}
            >
              <Text
                style={[
                  styles.openButtonText,
                  { fontSize: isVerySmallScreen ? 13 : 14 },
                ]}
              >
                Open
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPlaceCard = ({ item }: { item: PlaceItem }) => {
    const imageSource = PLACE_IMAGE_MAP[item.imageName];

    return (
      <Animated.View
        style={[
          styles.animatedItemWrap,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }, { scale: screenScale }],
          },
        ]}
      >
        <Pressable
          style={[
            styles.placeCard,
            {
              minHeight: isVerySmallScreen ? 86 : 92,
              marginBottom: isVerySmallScreen ? 10 : 12,
            },
          ]}
          onPress={() => navigation.navigate('PlaceInsight', { placeId: item.id })}
        >
          <Image
            source={imageSource}
            resizeMode="cover"
            style={[
              styles.placeImage,
              {
                width: isVerySmallScreen ? width * 0.36 : width * 0.38,
                minWidth: isVerySmallScreen ? 118 : 132,
                maxWidth: isVerySmallScreen ? 136 : 150,
              },
            ]}
          />

          <View
            style={[
              styles.placeTextWrap,
              {
                paddingHorizontal: isVerySmallScreen ? 8 : 10,
                paddingTop: isVerySmallScreen ? 8 : 10,
                paddingBottom: isVerySmallScreen ? 7 : 8,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.placeTitle,
                {
                  fontSize: isVerySmallScreen ? 13.5 : 14,
                  marginBottom: isVerySmallScreen ? 3 : 4,
                },
              ]}
            >
              {item.title}
            </Text>

            <Text
              numberOfLines={isVerySmallScreen ? 3 : 4}
              style={[
                styles.placeDescription,
                {
                  fontSize: isVerySmallScreen ? 11.5 : 12.5,
                  lineHeight: isVerySmallScreen ? 14 : 16,
                  marginBottom: isVerySmallScreen ? 6 : 8,
                },
              ]}
            >
              Description: {item.description}
            </Text>

            <Pressable
              style={[
                styles.smallOpenButton,
                {
                  minWidth: isVerySmallScreen ? 68 : 74,
                  height: isVerySmallScreen ? 24 : 26,
                  paddingHorizontal: isVerySmallScreen ? 12 : 14,
                },
              ]}
              onPress={() => navigation.navigate('PlaceInsight', { placeId: item.id })}
            >
              <Text
                style={[
                  styles.openButtonText,
                  { fontSize: isVerySmallScreen ? 12.5 : 14 },
                ]}
              >
                Open
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={selectedCategory ? BG_RED : BG_DARK}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={{
            flex: 1,
            opacity: screenOpacity,
            transform: [
              { translateY: screenTranslateY },
              { translateY: selectedCategory ? -20 : 0 },
              { scale: screenScale },
            ],
          }}
        >
          <View
            style={[
              styles.topBar,
              {
                paddingTop: Math.max(insets.top, 8),
                paddingHorizontal: isVerySmallScreen ? 16 : isSmallScreen ? 18 : 22,
                paddingBottom: isVerySmallScreen ? 10 : 12,
              },
            ]}
          >
            {selectedCategory ? (
              <View style={styles.headerRow}>
                <Pressable
                  style={[
                    styles.backButton,
                    {
                      width: isVerySmallScreen ? 40 : 44,
                      height: isVerySmallScreen ? 40 : 44,
                      borderRadius: isVerySmallScreen ? 20 : 22,
                      marginRight: isVerySmallScreen ? 10 : 12,
                    },
                  ]}
                  onPress={goBackToCategories}
                >
                  <Image
                    source={BACK_ICON}
                    resizeMode="contain"
                    style={[
                      styles.backIcon,
                      {
                        width: isVerySmallScreen ? 14 : 16,
                        height: isVerySmallScreen ? 14 : 16,
                      },
                    ]}
                  />
                </Pressable>

                <View
                  style={[
                    styles.titlePillWide,
                    {
                      height: isVerySmallScreen ? 40 : 42,
                      borderRadius: isVerySmallScreen ? 20 : 21,
                      paddingHorizontal: isVerySmallScreen ? 16 : 20,
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.titlePillText,
                      {
                        fontSize: isVerySmallScreen ? 15 : 16,
                      },
                    ]}
                  >
                    {selectedCategory.id === 'all-categories'
                      ? 'All Categories'
                      : selectedCategory.title}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.titlePillCenter,
                  {
                    minWidth: isVerySmallScreen ? 196 : 220,
                    height: isVerySmallScreen ? 40 : 42,
                    borderRadius: isVerySmallScreen ? 20 : 21,
                    paddingHorizontal: isVerySmallScreen ? 20 : 26,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.titlePillText,
                    { fontSize: isVerySmallScreen ? 15 : 16 },
                  ]}
                >
                  Volcano Explorer
                </Text>
              </View>
            )}
          </View>

          {!selectedCategory ? (
            <FlatList
              data={placeCategories}
              keyExtractor={item => item.id}
              renderItem={renderCategoryCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.categoriesListContent,
                {
                  paddingHorizontal: isVerySmallScreen ? 16 : isSmallScreen ? 18 : 22,
                  paddingBottom: isVerySmallScreen ? 96 : 110,
                  paddingTop: isVerySmallScreen ? 6 : 10,
                },
              ]}
            />
          ) : (
            <FlatList
              data={visiblePlaces}
              keyExtractor={item => item.id}
              renderItem={renderPlaceCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.placesListContent,
                {
                  paddingHorizontal: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
                  paddingBottom: isVerySmallScreen ? 96 : 110,
                  paddingTop: isVerySmallScreen ? 8 : 12,
                },
              ]}
            />
          )}
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1D1718',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  safeArea: {
    flex: 1,
  },

  topBar: {},

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    backgroundColor: '#C2BB85',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    tintColor: '#131313',
  },

  titlePillCenter: {
    alignSelf: 'center',
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titlePillWide: {
    flex: 1,
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titlePillText: {
    color: '#0D0D0D',
    fontWeight: '800',
  },

  categoriesListContent: {},

  animatedItemWrap: {
    width: '100%',
  },

  categoryCard: {
    backgroundColor: '#D6B0B2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryImage: {},

  categoryTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },

  categoryTitle: {
    color: '#111111',
    fontWeight: '800',
  },

  openButton: {
    alignSelf: 'flex-start',
    borderRadius: 15,
    backgroundColor: '#A59B00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  openButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  placesListContent: {},

  placeCard: {
    backgroundColor: 'rgba(22,18,19,0.88)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#191516',
    flexDirection: 'row',
    overflow: 'hidden',
  },

  placeImage: {
    height: '100%',
  },

  placeTextWrap: {
    flex: 1,
  },

  placeTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  placeDescription: {
    color: '#D6D1D1',
  },

  smallOpenButton: {
    alignSelf: 'flex-start',
    borderRadius: 13,
    backgroundColor: '#A59B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
});