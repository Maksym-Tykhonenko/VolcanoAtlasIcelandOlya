import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  Share,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/navTypes';
import { placeCatalog } from '../data/placeCatalog';
import { isSpotSaved, toggleSpot } from '../storage/savedSpotsStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceInsight'>;

const BG_IMAGE = require('../assets/images/gallery_active_layer.png');
const BACK_ICON = require('../assets/icons/nav_back_soft.png');
const SHARE_ICON = require('../assets/icons/action_share_soft.png');
const STAR_ICON = require('../assets/icons/action_star_soft.png');
const STAR_FILLED_ICON = require('../assets/icons/action_star_filled_soft.png');

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

const { height } = Dimensions.get('window');
const isSmallScreen = height <= 740;
const isVerySmallScreen = height <= 680;
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 10;

export default function PlaceInsightScreen({ route, navigation }: Props) {
  const place = useMemo(
    () => placeCatalog.find(item => item.id === route.params.placeId) ?? null,
    [route.params.placeId],
  );

  const [saved, setSaved] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(34)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const contentScale = useRef(new Animated.Value(0.97)).current;

  const mapOpacity = useRef(new Animated.Value(0)).current;
  const mapTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
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
  }, [screenOpacity, screenTranslateY, contentOpacity, contentTranslateY, contentScale]);

  useEffect(() => {
    let mounted = true;

    const loadSavedState = async () => {
      if (!place) return;
      const result = await isSpotSaved(place.id);
      if (mounted) {
        setSaved(result);
      }
    };

    loadSavedState();

    return () => {
      mounted = false;
    };
  }, [place]);

  useEffect(() => {
    if (mapVisible) {
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
    }
  }, [mapVisible, mapOpacity, mapTranslateY]);

  const handleToggleSave = async () => {
    if (!place) return;
    const next = await toggleSpot(place.id);
    setSaved(next);
  };

  const handleShare = async () => {
    if (!place) return;

    try {
      await Share.share({
        message:
          `${place.title}\n\n` +
          `${place.description}\n\n` +
          `Coordinates: ${place.latitude.toFixed(3)}° N, ${place.longitude.toFixed(3)}° W`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleToggleMap = () => {
    setMapVisible(prev => !prev);
  };

  if (!place) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Place not found</Text>
      </View>
    );
  }

  const imageSource = PLACE_IMAGE_MAP[place.imageName];

  return (
    <ImageBackground source={BG_IMAGE} resizeMode="cover" style={styles.background}>
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.screen,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }],
          },
        ]}
      >
        <View
          style={[
            styles.headerWrap,
            {
              paddingTop: topInset + 12 + 50,
              paddingHorizontal: isVerySmallScreen ? 16 : 20,
            },
          ]}
        >
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
            onPress={() => navigation.goBack()}
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
              styles.titlePill,
              {
                height: isVerySmallScreen ? 40 : 44,
                borderRadius: isVerySmallScreen ? 20 : 22,
                paddingHorizontal: isVerySmallScreen ? 16 : 18,
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
              All Categories
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          <Animated.View
            style={[
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }, { scale: contentScale }],
              },
            ]}
          >
            <View
              style={[
                styles.card,
                {
                  marginHorizontal: isVerySmallScreen ? 16 : 20,
                  marginTop: isVerySmallScreen ? 18 : 22,
                  borderRadius: isVerySmallScreen ? 18 : 20,
                },
              ]}
            >
              <Image
                source={imageSource}
                resizeMode="cover"
                style={[
                  styles.heroImage,
                  {
                    height: isVerySmallScreen ? 170 : isSmallScreen ? 190 : 210,
                  },
                ]}
              />

              <View
                style={[
                  styles.cardBody,
                  {
                    paddingHorizontal: isVerySmallScreen ? 12 : 14,
                    paddingTop: isVerySmallScreen ? 12 : 14,
                    paddingBottom: isVerySmallScreen ? 14 : 16,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.placeTitle,
                    {
                      fontSize: isVerySmallScreen ? 16 : 18,
                      marginBottom: isVerySmallScreen ? 10 : 12,
                    },
                  ]}
                >
                  {place.title}
                </Text>

                <Text
                  style={[
                    styles.descriptionText,
                    {
                      fontSize: isVerySmallScreen ? 11.5 : 12.5,
                      lineHeight: isVerySmallScreen ? 18 : 21,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Description:</Text> {place.description}
                </Text>

                <Text
                  style={[
                    styles.coordinatesText,
                    {
                      fontSize: isVerySmallScreen ? 11.5 : 12.5,
                      marginTop: isVerySmallScreen ? 14 : 18,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Coordinates:</Text> {place.latitude.toFixed(3)}° N, {place.longitude.toFixed(3)}° W
                </Text>

                {mapVisible && (
                  <Animated.View
                    style={[
                      styles.mapWrap,
                      {
                        marginTop: isVerySmallScreen ? 14 : 18,
                        opacity: mapOpacity,
                        transform: [{ translateY: mapTranslateY }],
                      },
                    ]}
                  >
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: place.latitude,
                        longitude: place.longitude,
                        latitudeDelta: 0.8,
                        longitudeDelta: 0.8,
                      }}
                      region={{
                        latitude: place.latitude,
                        longitude: place.longitude,
                        latitudeDelta: 0.8,
                        longitudeDelta: 0.8,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: place.latitude,
                          longitude: place.longitude,
                        }}
                        title={place.title}
                        description={place.region}
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
                  marginTop: isVerySmallScreen ? 14 : 18,
                  paddingHorizontal: isVerySmallScreen ? 16 : 20,
                  gap: isVerySmallScreen ? 10 : 12,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.circleButton,
                  {
                    width: isVerySmallScreen ? 42 : 46,
                    height: isVerySmallScreen ? 42 : 46,
                    borderRadius: isVerySmallScreen ? 21 : 23,
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
                      width: isVerySmallScreen ? 20 : 22,
                      height: isVerySmallScreen ? 20 : 22,
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.mapButton,
                  {
                    minWidth: isVerySmallScreen ? 150 : 176,
                    height: isVerySmallScreen ? 42 : 46,
                    borderRadius: isVerySmallScreen ? 21 : 23,
                    paddingHorizontal: isVerySmallScreen ? 16 : 20,
                  },
                ]}
                onPress={handleToggleMap}
              >
                <Text
                  style={[
                    styles.mapButtonText,
                    {
                      fontSize: isVerySmallScreen ? 14 : 16,
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
                    width: isVerySmallScreen ? 42 : 46,
                    height: isVerySmallScreen ? 42 : 46,
                    borderRadius: isVerySmallScreen ? 21 : 23,
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
                      width: isVerySmallScreen ? 20 : 22,
                      height: isVerySmallScreen ? 20 : 22,
                    },
                  ]}
                />
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#4D0008',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  screen: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#130B0D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fallbackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
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
    height: 220,
    borderRadius: 16,
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
});