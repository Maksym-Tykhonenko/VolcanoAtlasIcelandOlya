import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/navTypes';
import { placeCatalog } from '../data/placeCatalog';
import { getSavedSpotIds } from '../storage/savedSpotsStorage';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'SavedSpots'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BG_IMAGE = require('../assets/images/gallery_active_layer.png');
const EMPTY_IMAGE = require('../assets/images/quiz_volcano_steam.png');

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
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 10;
const CONTENT_TOP_OFFSET = 40;

export default function SavedSpotsScreen({ navigation }: Props) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(22)).current;
  const scaleAnim = useRef(new Animated.Value(0.985)).current;

  const savedPlaces = useMemo(() => {
    return placeCatalog.filter(item => savedIds.includes(item.id));
  }, [savedIds]);

  const runAppear = () => {
    fadeAnim.setValue(0);
    moveAnim.setValue(22);
    scaleAnim.setValue(0.985);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadSaved = async () => {
    const ids = await getSavedSpotIds();
    setSavedIds(ids);
    runAppear();
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, []),
  );

  const handleOpenPlace = (placeId: string) => {
    navigation.navigate('PlaceInsight', { placeId });
  };

  return (
    <ImageBackground source={BG_IMAGE} resizeMode="cover" style={styles.background}>
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.screen,
          {
            opacity: fadeAnim,
            transform: [{ translateY: moveAnim }, { scale: scaleAnim }],
            paddingTop: CONTENT_TOP_OFFSET,
          },
        ]}
      >
        <View
          style={[
            styles.titlePill,
            {
              marginTop: topInset + 14,
              minWidth: isVerySmallScreen ? 200 : 250,
              height: isVerySmallScreen ? 40 : 48,
              borderRadius: isVerySmallScreen ? 20 : 24,
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
            Saved Locations
          </Text>
        </View>

        {savedPlaces.length === 0 ? (
          <View
            style={[
              styles.emptyWrap,
              {
                paddingHorizontal: isVerySmallScreen ? 22 : 28,
                paddingTop: isVerySmallScreen ? 26 : 34,
              },
            ]}
          >
            <Image
              source={EMPTY_IMAGE}
              resizeMode="contain"
              style={[
                styles.emptyImage,
                {
                  width: isVerySmallScreen ? width - 120 : width - 140,
                  height: isVerySmallScreen ? 220 : 280,
                },
              ]}
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  marginTop: isVerySmallScreen ? 18 : 24,
                  fontSize: isVerySmallScreen ? 20 : 24,
                  lineHeight: isVerySmallScreen ? 26 : 30,
                },
              ]}
            >
              No Saved Places Yet
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                {
                  marginTop: isVerySmallScreen ? 8 : 10,
                  fontSize: isVerySmallScreen ? 13 : 15,
                  lineHeight: isVerySmallScreen ? 19 : 22,
                  width: isVerySmallScreen ? width - 90 : width - 120,
                },
              ]}
            >
              Saved volcanic destinations will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedPlaces}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: isVerySmallScreen ? 16 : 18,
              paddingBottom: 120,
              paddingTop: isVerySmallScreen ? 16 : 20,
            }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  {
                    borderRadius: isVerySmallScreen ? 16 : 18,
                    marginBottom: isVerySmallScreen ? 12 : 14,
                  },
                ]}
              >
                <Image
                  source={PLACE_IMAGE_MAP[item.imageName]}
                  resizeMode="cover"
                  style={[
                    styles.cardImage,
                    {
                      height: isVerySmallScreen ? 150 : 185,
                    },
                  ]}
                />

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
                    style={[
                      styles.cardTitle,
                      {
                        fontSize: isVerySmallScreen ? 16 : 18,
                        marginBottom: isVerySmallScreen ? 8 : 10,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    numberOfLines={3}
                    style={[
                      styles.cardText,
                      {
                        fontSize: isVerySmallScreen ? 12 : 13,
                        lineHeight: isVerySmallScreen ? 18 : 20,
                      },
                    ]}
                  >
                    {item.description}
                  </Text>

                  <Pressable
                    style={[
                      styles.openButton,
                      {
                        marginTop: isVerySmallScreen ? 10 : 12,
                        minWidth: isVerySmallScreen ? 86 : 94,
                        height: isVerySmallScreen ? 32 : 36,
                        borderRadius: isVerySmallScreen ? 16 : 18,
                      },
                    ]}
                    onPress={() => handleOpenPlace(item.id)}
                  >
                    <Text
                      style={[
                        styles.openButtonText,
                        {
                          fontSize: isVerySmallScreen ? 13 : 15,
                        },
                      ]}
                    >
                      Open
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
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
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  screen: {
    flex: 1,
  },
  titlePill: {
    alignSelf: 'center',
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleText: {
    color: '#111111',
    fontWeight: '800',
  },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
  },
  emptyImage: {},
  emptyTitle: {
    color: '#FFF3E3',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  emptySubtitle: {
    color: '#E7DDDD',
    fontWeight: '600',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#160D0F',
    borderWidth: 1,
    borderColor: '#211416',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
  },
  cardBody: {},
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cardText: {
    color: '#EDE5E5',
  },
  openButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#B1A600',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  openButtonText: {
    color: '#FFFBE8',
    fontWeight: '800',
  },
});