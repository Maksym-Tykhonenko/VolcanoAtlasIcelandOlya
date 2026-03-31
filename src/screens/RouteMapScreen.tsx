import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
  Share,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import {
  placeCatalog,
  placeCategories,
  type PlaceItem,
  type PlaceCategory,
} from '../data/placeCatalog';
import { isSpotSaved, toggleSpot } from '../storage/savedSpotsStorage';

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

const { width, height } = Dimensions.get('window');
const isSmallScreen = height <= 740;
const isVerySmallScreen = height <= 680;
const statusInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const TOP_SAFE_OFFSET = Platform.OS === 'ios' ? 54 : statusInset + 18;
const HEADER_TOP = TOP_SAFE_OFFSET + 20;
const CATEGORIES_TOP = HEADER_TOP + (isVerySmallScreen ? 52 : 58);

const ICELAND_REGION: Region = {
  latitude: 64.9631,
  longitude: -19.0208,
  latitudeDelta: 4.8,
  longitudeDelta: 7.4,
};

const buildRegionForPlace = (place: PlaceItem): Region => ({
  latitude: place.latitude,
  longitude: place.longitude,
  latitudeDelta: 1.1,
  longitudeDelta: 1.1,
});

export default function RouteMapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all-categories');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [region, setRegion] = useState<Region>(ICELAND_REGION);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.96)).current;

  const allCategories: PlaceCategory[] = useMemo(() => {
    const hasAll = placeCategories.some(item => item.id === 'all-categories');

    if (hasAll) {
      return placeCategories;
    }

    return [
      {
        id: 'all-categories',
        title: 'All Categories',
        imageName: '',
      },
      ...placeCategories,
    ];
  }, []);

  const visiblePlaces = useMemo(() => {
    if (selectedCategoryId === 'all-categories') {
      return placeCatalog;
    }

    return placeCatalog.filter(item => item.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenOpacity, screenTranslateY]);

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    modalOpacity.setValue(0);
    modalScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedPlace, modalOpacity, modalScale]);

  useEffect(() => {
    const fitVisibleMarkers = () => {
      if (!mapRef.current || visiblePlaces.length === 0) {
        return;
      }

      if (visiblePlaces.length === 1) {
        const onlyPlace = visiblePlaces[0];
        const nextRegion = buildRegionForPlace(onlyPlace);
        setRegion(nextRegion);
        mapRef.current.animateToRegion(nextRegion, 450);
        return;
      }

      mapRef.current.fitToCoordinates(
        visiblePlaces.map(item => ({
          latitude: item.latitude,
          longitude: item.longitude,
        })),
        {
          edgePadding: {
            top: isVerySmallScreen ? 220 : 300,
            right: isVerySmallScreen ? 40 : 70,
            bottom: isVerySmallScreen ? 180 : 240,
            left: isVerySmallScreen ? 40 : 70,
          },
          animated: true,
        },
      );
    };

    const timer = setTimeout(fitVisibleMarkers, 120);
    return () => clearTimeout(timer);
  }, [selectedCategoryId, visiblePlaces]);

  useEffect(() => {
    let active = true;

    const loadSavedState = async () => {
      if (!selectedPlace) {
        if (active) {
          setSaved(false);
        }
        return;
      }

      const result = await isSpotSaved(selectedPlace.id);

      if (active) {
        setSaved(result);
      }
    };

    loadSavedState();

    return () => {
      active = false;
    };
  }, [selectedPlace]);

  const handleSelectPlace = (place: PlaceItem) => {
    setSelectedPlace(place);

    const nextRegion = buildRegionForPlace(place);
    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 500);
  };

  const handleToggleSave = async () => {
    if (!selectedPlace) {
      return;
    }

    const next = await toggleSpot(selectedPlace.id);
    setSaved(next);
  };

  const handleShare = async () => {
    if (!selectedPlace) {
      return;
    }

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

  const handleExitCard = () => {
    setSelectedPlace(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedPlace(null);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const nextLatitudeDelta =
      direction === 'in'
        ? Math.max(region.latitudeDelta * 0.6, 0.08)
        : Math.min(region.latitudeDelta * 1.7, 10);

    const nextLongitudeDelta =
      direction === 'in'
        ? Math.max(region.longitudeDelta * 0.6, 0.08)
        : Math.min(region.longitudeDelta * 1.7, 10);

    const nextRegion: Region = {
      ...region,
      latitudeDelta: nextLatitudeDelta,
      longitudeDelta: nextLongitudeDelta,
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 250);
  };

  const handleRecenter = () => {
    if (selectedPlace) {
      const nextRegion = buildRegionForPlace(selectedPlace);
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 450);
      return;
    }

    setRegion(ICELAND_REGION);
    mapRef.current?.animateToRegion(ICELAND_REGION, 450);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={ref => {
          mapRef.current = ref;
        }}
        style={styles.map}
        initialRegion={ICELAND_REGION}
        onRegionChangeComplete={nextRegion => setRegion(nextRegion)}
      >
        {visiblePlaces.map(place => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.title}
            description={place.region}
            onPress={() => handleSelectPlace(place)}
          />
        ))}
      </MapView>

      <View pointerEvents="none" style={styles.mapOverlay} />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.overlayRoot,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }],
          },
        ]}
      >
        <View
          pointerEvents="box-none"
          style={[
            styles.headerRow,
            {
              top: HEADER_TOP,
              paddingHorizontal: isVerySmallScreen ? 16 : 20,
            },
          ]}
        >
          <View
            style={[
              styles.titlePill,
              {
                height: isVerySmallScreen ? 40 : 44,
                borderRadius: isVerySmallScreen ? 20 : 22,
                minWidth: isVerySmallScreen ? 170 : 200,
              },
            ]}
          >
            <Text
              style={[
                styles.titlePillText,
                {
                  fontSize: isVerySmallScreen ? 15 : 16,
                },
              ]}
            >
              Map
            </Text>
          </View>
        </View>

        <View
          pointerEvents="box-none"
          style={[
            styles.categoriesWrap,
            {
              top: CATEGORIES_TOP,
              paddingLeft: isVerySmallScreen ? 16 : 20,
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {allCategories.map(category => {
              const selected = category.id === selectedCategoryId;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleSelectCategory(category.id)}
                  style={[
                    styles.categoryChip,
                    selected && styles.categoryChipActive,
                    {
                      height: isVerySmallScreen ? 34 : 40,
                      borderRadius: isVerySmallScreen ? 17 : 20,
                      paddingHorizontal: isVerySmallScreen ? 14 : 16,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selected && styles.categoryChipTextActive,
                      {
                        fontSize: isVerySmallScreen ? 12 : 13.5,
                      },
                    ]}
                  >
                    {category.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View
          pointerEvents="box-none"
          style={[
            styles.mapControls,
            {
              top: '50%',
              right: isVerySmallScreen ? 12 : 16,
              transform: [{ translateY: isVerySmallScreen ? -66 : -78 }],
            },
          ]}
        >
          <Pressable
            style={[
              styles.controlButton,
              {
                width: isVerySmallScreen ? 38 : 42,
                height: isVerySmallScreen ? 38 : 42,
                borderRadius: isVerySmallScreen ? 19 : 21,
                marginBottom: isVerySmallScreen ? 8 : 10,
              },
            ]}
            onPress={() => handleZoom('in')}
          >
            <Text
              style={[
                styles.controlText,
                {
                  fontSize: isVerySmallScreen ? 20 : 22,
                },
              ]}
            >
              +
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.controlButton,
              {
                width: isVerySmallScreen ? 38 : 42,
                height: isVerySmallScreen ? 38 : 42,
                borderRadius: isVerySmallScreen ? 19 : 21,
                marginBottom: isVerySmallScreen ? 8 : 10,
              },
            ]}
            onPress={() => handleZoom('out')}
          >
            <Text
              style={[
                styles.controlText,
                {
                  fontSize: isVerySmallScreen ? 20 : 22,
                },
              ]}
            >
              −
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.controlButton,
              {
                width: isVerySmallScreen ? 38 : 42,
                height: isVerySmallScreen ? 38 : 42,
                borderRadius: isVerySmallScreen ? 19 : 21,
              },
            ]}
            onPress={handleRecenter}
          >
            <Text
              style={[
                styles.controlText,
                {
                  fontSize: isVerySmallScreen ? 18 : 20,
                },
              ]}
            >
              ◎
            </Text>
          </Pressable>
        </View>

        {selectedPlace && (
          <View pointerEvents="box-none" style={styles.modalCenterWrap}>
            <Animated.View
              style={[
                styles.centerCard,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                  width: isVerySmallScreen ? width - 44 : isSmallScreen ? width - 56 : width - 68,
                  maxWidth: 360,
                  borderRadius: isVerySmallScreen ? 16 : 20,
                },
              ]}
            >
              <Image
                source={PLACE_IMAGE_MAP[selectedPlace.imageName]}
                resizeMode="cover"
                style={[
                  styles.cardImage,
                  {
                    height: isVerySmallScreen ? 118 : isSmallScreen ? 138 : 156,
                  },
                ]}
              />

              <View
                style={[
                  styles.cardBody,
                  {
                    paddingHorizontal: isVerySmallScreen ? 12 : 14,
                    paddingTop: isVerySmallScreen ? 10 : 12,
                    paddingBottom: isVerySmallScreen ? 10 : 12,
                  },
                ]}
              >
                <Text
                  numberOfLines={2}
                  style={[
                    styles.cardTitle,
                    {
                      fontSize: isVerySmallScreen ? 14 : 16,
                      marginBottom: isVerySmallScreen ? 8 : 10,
                    },
                  ]}
                >
                  {selectedPlace.title}
                </Text>

                <Text
                  numberOfLines={isVerySmallScreen ? 4 : 5}
                  style={[
                    styles.cardDescription,
                    {
                      fontSize: isVerySmallScreen ? 11 : 12,
                      lineHeight: isVerySmallScreen ? 16 : 18,
                    },
                  ]}
                >
                  <Text style={styles.cardDescriptionBold}>Description:</Text>{' '}
                  {selectedPlace.description}
                </Text>

                <Text
                  numberOfLines={2}
                  style={[
                    styles.cardCoordinates,
                    {
                      fontSize: isVerySmallScreen ? 11 : 12,
                      marginTop: isVerySmallScreen ? 10 : 12,
                      lineHeight: isVerySmallScreen ? 15 : 17,
                    },
                  ]}
                >
                  <Text style={styles.cardDescriptionBold}>Coordinates:</Text>{' '}
                  {selectedPlace.latitude.toFixed(3)}° N, {selectedPlace.longitude.toFixed(3)}° W
                </Text>
              </View>

              <View
                style={[
                  styles.actionsRow,
                  {
                    paddingHorizontal: isVerySmallScreen ? 12 : 14,
                    paddingBottom: isVerySmallScreen ? 12 : 14,
                    gap: isVerySmallScreen ? 8 : 10,
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.circleButton,
                    {
                      width: isVerySmallScreen ? 36 : 40,
                      height: isVerySmallScreen ? 36 : 40,
                      borderRadius: isVerySmallScreen ? 18 : 20,
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
                        width: isVerySmallScreen ? 16 : 18,
                        height: isVerySmallScreen ? 16 : 18,
                      },
                    ]}
                  />
                </Pressable>

                <Pressable
                  style={[
                    styles.exitButton,
                    {
                      flex: 1,
                      height: isVerySmallScreen ? 36 : 40,
                      borderRadius: isVerySmallScreen ? 18 : 20,
                    },
                  ]}
                  onPress={handleExitCard}
                >
                  <Text
                    style={[
                      styles.exitButtonText,
                      {
                        fontSize: isVerySmallScreen ? 13 : 14,
                      },
                    ]}
                  >
                    Exit
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.circleButton,
                    {
                      width: isVerySmallScreen ? 36 : 40,
                      height: isVerySmallScreen ? 36 : 40,
                      borderRadius: isVerySmallScreen ? 18 : 20,
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
                        width: isVerySmallScreen ? 16 : 18,
                        height: isVerySmallScreen ? 16 : 18,
                      },
                    ]}
                  />
                </Pressable>
              </View>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101214',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: 'center',
  },
  titlePill: {
    paddingHorizontal: 28,
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePillText: {
    color: '#111111',
    fontWeight: '800',
  },
  categoriesWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 29,
  },
  categoriesScrollContent: {
    paddingRight: 20,
    gap: 10,
  },
  categoryChip: {
    backgroundColor: 'rgba(25,22,23,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(189,182,130,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#BDB682',
    borderColor: '#BDB682',
  },
  categoryChipText: {
    color: '#F3ECE8',
    fontWeight: '700',
  },
  categoryChipTextActive: {
    color: '#111111',
  },
  mapControls: {
    position: 'absolute',
    zIndex: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(18,13,15,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(189,182,130,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    color: '#FFF7EF',
    fontWeight: '800',
    marginTop: -1,
  },

  modalCenterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 110,
    zIndex: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerCard: {
    backgroundColor: '#160D0F',
    borderWidth: 1,
    borderColor: '#211416',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cardImage: {
    width: '100%',
  },
  cardBody: {},
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cardDescription: {
    color: '#EFEAEA',
  },
  cardDescriptionBold: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cardCoordinates: {
    color: '#EFEAEA',
  },
  actionsRow: {
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
  exitButton: {
    backgroundColor: '#B0A30C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  exitButtonText: {
    color: '#FFFBE8',
    fontWeight: '800',
  },
});