import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Animated,
  Easing,
  Share,
  Platform,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/navTypes';
import { placeCatalog, type PlaceItem } from '../data/placeCatalog';
import { isSpotSaved, toggleSpot } from '../storage/savedSpotsStorage';

type Props = BottomTabScreenProps<MainTabParamList, 'SurpriseSpot'>;

const BG_IMAGE = require('../assets/images/gallery_base_backdrop.png');
const BACK_ICON = require('../assets/icons/nav_back_soft.png');
const SHARE_ICON = require('../assets/icons/action_share_soft.png');
const STAR_ICON = require('../assets/icons/action_star_soft.png');
const STAR_FILLED_ICON = require('../assets/icons/action_star_filled_soft.png');
const RANDOM_TOP_IMAGE = require('../assets/images/random_discovery_crater_mark.png');

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

const CONTENT_TOP_OFFSET = 40;
const TAB_SAFE_BOTTOM_IOS = 110;
const TAB_SAFE_BOTTOM_ANDROID = 122;

export default function SurpriseSpotScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = height <= 740;
  const isVerySmallScreen = height <= 680;
  const isNarrowScreen = width <= 360;
  const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 10;
  const bottomSafeSpace = Platform.OS === 'android' ? TAB_SAFE_BOTTOM_ANDROID : TAB_SAFE_BOTTOM_IOS;

  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const introOpacity = useRef(new Animated.Value(0)).current;
  const introTranslateY = useRef(new Animated.Value(24)).current;

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(34)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const contentScale = useRef(new Animated.Value(0.97)).current;

  const mapOpacity = useRef(new Animated.Value(0)).current;
  const mapTranslateY = useRef(new Animated.Value(16)).current;

  const randomPool = useMemo(() => placeCatalog, []);

  const runIntroAnimation = () => {
    introOpacity.setValue(0);
    introTranslateY.setValue(24);

    Animated.parallel([
      Animated.timing(introOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(introTranslateY, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const runDetailAnimation = () => {
    screenOpacity.setValue(0);
    screenTranslateY.setValue(34);
    contentOpacity.setValue(0);
    contentTranslateY.setValue(24);
    contentScale.setValue(0.97);

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
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const runMapAnimation = () => {
    mapOpacity.setValue(0);
    mapTranslateY.setValue(16);

    Animated.parallel([
      Animated.timing(mapOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(mapTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    runIntroAnimation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setMapVisible(false);
      setSelectedPlace(null);
      setSaved(false);

      requestAnimationFrame(() => {
        runIntroAnimation();
      });

      return undefined;
    }, []),
  );

  useEffect(() => {
    if (!selectedPlace) return;
    runDetailAnimation();
  }, [selectedPlace]);

  useEffect(() => {
    let mounted = true;

    const loadSavedState = async () => {
      if (!selectedPlace) return;
      const result = await isSpotSaved(selectedPlace.id);
      if (mounted) {
        setSaved(result);
      }
    };

    loadSavedState();

    return () => {
      mounted = false;
    };
  }, [selectedPlace]);

  useEffect(() => {
    if (mapVisible) {
      runMapAnimation();
    }
  }, [mapVisible]);

  const pickRandomPlace = () => {
    if (randomPool.length === 0) return;

    let nextPlace = randomPool[Math.floor(Math.random() * randomPool.length)];

    if (selectedPlace && randomPool.length > 1) {
      while (nextPlace.id === selectedPlace.id) {
        nextPlace = randomPool[Math.floor(Math.random() * randomPool.length)];
      }
    }

    setMapVisible(false);
    setSelectedPlace(nextPlace);
  };

  const handleTryAgain = () => {
    pickRandomPlace();
  };

  const handleBackToIntro = () => {
    setMapVisible(false);
    setSelectedPlace(null);
    setSaved(false);

    requestAnimationFrame(() => {
      runIntroAnimation();
    });
  };

  const handleToggleSave = async () => {
    if (!selectedPlace) return;
    const next = await toggleSpot(selectedPlace.id);
    setSaved(next);
  };

  const handleShare = async () => {
    if (!selectedPlace) return;

    try {
      await Share.share({
        message:
          `${selectedPlace.title}\n\n` +
          `${selectedPlace.description}\n\n` +
          `Coordinates: ${selectedPlace.latitude.toFixed(3)}° N, ${selectedPlace.longitude.toFixed(3)}° W`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleToggleMap = () => {
    setMapVisible(prev => !prev);
  };

  const detailImage = selectedPlace ? PLACE_IMAGE_MAP[selectedPlace.imageName] : null;

  const detailCardWidth = isVerySmallScreen ? width - 34 : isSmallScreen ? width - 44 : width - 54;
  const maxCardWidth = 390;

  return (
    <ImageBackground source={BG_IMAGE} resizeMode="cover" style={styles.background}>
      <View style={styles.overlay} />

      {!selectedPlace ? (
        <Animated.View
          style={[
            styles.introScreen,
            {
              opacity: introOpacity,
              transform: [{ translateY: introTranslateY }],
              paddingTop: CONTENT_TOP_OFFSET,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isVerySmallScreen ? 26 : 36,
            }}
          >
            <View
              style={[
                styles.introHeaderWrap,
                {
                  paddingTop: topInset + 28,
                  paddingHorizontal: isVerySmallScreen ? 16 : 20,
                },
              ]}
            >
              <View
                style={[
                  styles.titlePillSingle,
                  {
                    minWidth: isVerySmallScreen ? 210 : 280,
                    height: isVerySmallScreen ? 38 : 44,
                    borderRadius: isVerySmallScreen ? 19 : 22,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.titlePillText,
                    {
                      fontSize: isVerySmallScreen ? 14 : 16,
                    },
                  ]}
                >
                  Random Discovery
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.introContentWrap,
                {
                  paddingHorizontal: isVerySmallScreen ? 16 : 22,
                  paddingTop: isVerySmallScreen ? 20 : 30,
                },
              ]}
            >
              <Image
                source={RANDOM_TOP_IMAGE}
                resizeMode="contain"
                style={[
                  styles.randomHeroImage,
                  {
                    width: isVerySmallScreen ? width * 0.64 : width * 0.74,
                    height: isVerySmallScreen ? 210 : isSmallScreen ? 270 : 330,
                  },
                ]}
              />

              <Text
                style={[
                  styles.randomQuestion,
                  {
                    marginTop: isVerySmallScreen ? 10 : 18,
                    fontSize: isVerySmallScreen ? 17 : 24,
                    lineHeight: isVerySmallScreen ? 23 : 30,
                    paddingHorizontal: isNarrowScreen ? 8 : 0,
                  },
                ]}
              >
                Not Sure Where to Go?
              </Text>

              <Pressable
                style={[
                  styles.randomMainButton,
                  {
                    marginTop: isVerySmallScreen ? 18 : 28,
                    minWidth: isVerySmallScreen ? 200 : 270,
                    height: isVerySmallScreen ? 50 : 64,
                    borderRadius: isVerySmallScreen ? 12 : 16,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={pickRandomPlace}
              >
                <Text
                  style={[
                    styles.randomMainButtonText,
                    {
                      fontSize: isVerySmallScreen ? 14 : 18,
                    },
                  ]}
                >
                  Discover a Place
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.screen,
            {
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslateY }],
              paddingTop: CONTENT_TOP_OFFSET,
            },
          ]}
        >
          <View
            style={[
              styles.headerWrap,
              {
                paddingTop: topInset + 28,
                paddingHorizontal: isVerySmallScreen ? 16 : 20,
              },
            ]}
          >
            <Pressable
              style={[
                styles.backButton,
                {
                  width: isVerySmallScreen ? 38 : 44,
                  height: isVerySmallScreen ? 38 : 44,
                  borderRadius: isVerySmallScreen ? 19 : 22,
                  marginRight: isVerySmallScreen ? 10 : 12,
                },
              ]}
              onPress={handleBackToIntro}
            >
              <Image
                source={BACK_ICON}
                resizeMode="contain"
                style={[
                  styles.backIcon,
                  {
                    width: isVerySmallScreen ? 13 : 16,
                    height: isVerySmallScreen ? 13 : 16,
                  },
                ]}
              />
            </Pressable>

            <View
              style={[
                styles.titlePill,
                {
                  height: isVerySmallScreen ? 38 : 44,
                  borderRadius: isVerySmallScreen ? 19 : 22,
                  paddingHorizontal: isVerySmallScreen ? 14 : 18,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.titlePillText,
                  {
                    fontSize: isVerySmallScreen ? 14 : 16,
                  },
                ]}
              >
                Random Discovery
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: bottomSafeSpace,
            }}
          >
            <Animated.View
              style={{
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
                alignItems: 'center',
              }}
            >
              <View
                style={[
                  styles.card,
                  {
                    width: Math.min(detailCardWidth, maxCardWidth),
                    marginTop: isVerySmallScreen ? 14 : 20,
                    borderRadius: isVerySmallScreen ? 16 : 20,
                  },
                ]}
              >
                {detailImage && (
                  <Image
                    source={detailImage}
                    resizeMode="cover"
                    style={[
                      styles.heroImage,
                      {
                        height: isVerySmallScreen ? 128 : isSmallScreen ? 150 : 172,
                      },
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.cardBody,
                    {
                      paddingHorizontal: isVerySmallScreen ? 12 : 14,
                      paddingTop: isVerySmallScreen ? 10 : 12,
                      paddingBottom: isVerySmallScreen ? 12 : 14,
                    },
                  ]}
                >
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.placeTitle,
                      {
                        fontSize: isVerySmallScreen ? 14 : 17,
                        marginBottom: isVerySmallScreen ? 8 : 10,
                      },
                    ]}
                  >
                    {selectedPlace.title}
                  </Text>

                  <Text
                    numberOfLines={isVerySmallScreen ? 4 : 5}
                    style={[
                      styles.descriptionText,
                      {
                        fontSize: isVerySmallScreen ? 10.5 : 12,
                        lineHeight: isVerySmallScreen ? 16 : 19,
                      },
                    ]}
                  >
                    <Text style={styles.boldText}>Description:</Text> {selectedPlace.description}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={[
                      styles.coordinatesText,
                      {
                        fontSize: isVerySmallScreen ? 10.5 : 12,
                        marginTop: isVerySmallScreen ? 10 : 12,
                        lineHeight: isVerySmallScreen ? 15 : 18,
                      },
                    ]}
                  >
                    <Text style={styles.boldText}>Coordinates:</Text>{' '}
                    {selectedPlace.latitude.toFixed(3)}° N, {selectedPlace.longitude.toFixed(3)}° W
                  </Text>

                  {mapVisible && (
                    <Animated.View
                      style={[
                        styles.mapWrap,
                        {
                          marginTop: isVerySmallScreen ? 12 : 16,
                          height: isVerySmallScreen ? 150 : 180,
                          opacity: mapOpacity,
                          transform: [{ translateY: mapTranslateY }],
                        },
                      ]}
                    >
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: selectedPlace.latitude,
                          longitude: selectedPlace.longitude,
                          latitudeDelta: 0.8,
                          longitudeDelta: 0.8,
                        }}
                        region={{
                          latitude: selectedPlace.latitude,
                          longitude: selectedPlace.longitude,
                          latitudeDelta: 0.8,
                          longitudeDelta: 0.8,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: selectedPlace.latitude,
                            longitude: selectedPlace.longitude,
                          }}
                          title={selectedPlace.title}
                          description={selectedPlace.region}
                        />
                      </MapView>
                    </Animated.View>
                  )}
                </View>
              </View>

              <View
                style={[
                  styles.actionRow,
                  {
                    width: Math.min(detailCardWidth, maxCardWidth),
                    marginTop: isVerySmallScreen ? 10 : 14,
                    gap: isVerySmallScreen ? 8 : 10,
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.circleButton,
                    {
                      width: isVerySmallScreen ? 34 : 40,
                      height: isVerySmallScreen ? 34 : 40,
                      borderRadius: isVerySmallScreen ? 17 : 20,
                    },
                  ]}
                  onPress={handleShare}
                >
                  <Image
                    source={SHARE_ICON}
                    resizeMode="contain"
                    style={[
                      styles.actionIcon,
                      {
                        width: isVerySmallScreen ? 15 : 18,
                        height: isVerySmallScreen ? 15 : 18,
                      },
                    ]}
                  />
                </Pressable>

                <Pressable
                  style={[
                    styles.mapButton,
                    {
                      flex: 1,
                      height: isVerySmallScreen ? 34 : 40,
                      borderRadius: isVerySmallScreen ? 17 : 20,
                      paddingHorizontal: isVerySmallScreen ? 10 : 14,
                    },
                  ]}
                  onPress={handleToggleMap}
                >
                  <Text
                    style={[
                      styles.mapButtonText,
                      {
                        fontSize: isVerySmallScreen ? 11.5 : 13,
                      },
                    ]}
                  >
                    {mapVisible ? 'Hide Map' : 'Open Map'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.circleButton,
                    {
                      width: isVerySmallScreen ? 34 : 40,
                      height: isVerySmallScreen ? 34 : 40,
                      borderRadius: isVerySmallScreen ? 17 : 20,
                    },
                  ]}
                  onPress={handleToggleSave}
                >
                  <Image
                    source={saved ? STAR_FILLED_ICON : STAR_ICON}
                    resizeMode="contain"
                    style={[
                      styles.actionIcon,
                      {
                        width: isVerySmallScreen ? 15 : 18,
                        height: isVerySmallScreen ? 15 : 18,
                      },
                    ]}
                  />
                </Pressable>
              </View>

              <View
                style={[
                  styles.tryAgainWrap,
                  {
                    width: Math.min(detailCardWidth, maxCardWidth),
                    marginTop: isVerySmallScreen ? 12 : 18,
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.tryAgainButton,
                    {
                      width: '100%',
                      height: isVerySmallScreen ? 40 : 46,
                      borderRadius: isVerySmallScreen ? 11 : 13,
                      paddingHorizontal: 18,
                    },
                  ]}
                  onPress={handleTryAgain}
                >
                  <Text
                    style={[
                      styles.tryAgainButtonText,
                      {
                        fontSize: isVerySmallScreen ? 13.5 : 15.5,
                      },
                    ]}
                  >
                    Try Again
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#24191B',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  introScreen: {
    flex: 1,
  },
  introHeaderWrap: {
    alignItems: 'center',
  },
  titlePillSingle: {
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  introContentWrap: {
    alignItems: 'center',
  },
  randomHeroImage: {},
  randomQuestion: {
    color: '#FFF2E3',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(255,170,78,0.26)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  randomMainButton: {
    backgroundColor: '#E58E00',
    borderWidth: 1.5,
    borderColor: '#A45E00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  randomMainButtonText: {
    color: '#FFF6EA',
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.24)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  screen: {
    flex: 1,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    tintColor: '#111111',
  },
  titlePill: {
    flex: 1,
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePillText: {
    color: '#111111',
    fontWeight: '800',
  },

  card: {
    backgroundColor: '#160D0F',
    borderWidth: 1,
    borderColor: '#211416',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
  },
  cardBody: {},
  placeTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  descriptionText: {
    color: '#EFEAEA',
  },
  boldText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  coordinatesText: {
    color: '#EFEAEA',
  },

  mapWrap: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#322225',
  },
  map: {
    width: '100%',
    height: '100%',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    backgroundColor: '#B0A30C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    tintColor: '#FFFBE8',
  },
  mapButton: {
    backgroundColor: '#B0A30C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonText: {
    color: '#FFFBE8',
    fontWeight: '800',
  },

  tryAgainWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#E58E00',
    borderWidth: 1.5,
    borderColor: '#A45E00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tryAgainButtonText: {
    color: '#FFF6EA',
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.24)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});