import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/navTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'PathIntro'>;

const BG_IMAGE = require('../assets/images/launch_backdrop_core.png');

const INTRO_SLIDES = [
  {
    id: 'intro-1',
    eyebrow: 'Discover',
    title: "Iceland's Volcano Landscapes",
    text: 'Explore dramatic volcanic terrain shaped by lava, glaciers, and time.',
    buttonLabel: 'Continue',
    image: require('../assets/images/intro_cloud_crater_mark.png'),
  },
  {
    id: 'intro-2',
    eyebrow: 'Explore',
    title: 'Unique Volcanic Places',
    text: 'Browse iconic craters, lava fields, and geothermal valleys across Iceland.',
    buttonLabel: 'Next',
    image: require('../assets/images/intro_stone_crater_mark.png'),
  },
  {
    id: 'intro-3',
    eyebrow: 'Find',
    title: 'Places on the Map',
    text: 'Use the map to locate volcanic landmarks and plan your route.',
    buttonLabel: 'Next',
    image: require('../assets/images/intro_pin_crater_mark.png'),
  },
  {
    id: 'intro-4',
    eyebrow: 'Test',
    title: 'Your Volcano Knowledge',
    text: "Take a short quiz and learn fascinating facts about Iceland's volcanoes.",
    buttonLabel: 'Next',
    image: require('../assets/images/intro_lava_gate_mark.png'),
  },
  {
    id: 'intro-5',
    eyebrow: 'Save',
    title: 'Places for Your Journey',
    text: 'Keep your favorite volcanic destinations ready for your next adventure.',
    buttonLabel: 'Next',
    image: require('../assets/images/intro_bookmark_crater_mark.png'),
  },
  {
    id: 'intro-6',
    eyebrow: 'Start',
    title: 'Exploring Iceland',
    text: 'Your volcanic journey begins now.',
    buttonLabel: 'Start Exploring',
    image: require('../assets/images/intro_fire_crater_mark.png'),
  },
] as const;

const { width, height } = Dimensions.get('window');
const isSmallScreen = height <= 700;
const isVerySmallScreen = height <= 640;

const CARD_W = Math.min(width - 56, isVerySmallScreen ? 278 : 292);
const TOP_IMAGE_W = Math.min(width * (isVerySmallScreen ? 0.72 : 0.78), isVerySmallScreen ? 255 : 300);
const TOP_IMAGE_H = Math.min(height * (isVerySmallScreen ? 0.26 : isSmallScreen ? 0.29 : 0.34), isVerySmallScreen ? 195 : 270);

export default function PathIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const imageFloatAnim = useRef(new Animated.Value(10)).current;

  const currentSlide = useMemo(() => INTRO_SLIDES[step], [step]);

  const runSlideAnimation = () => {
    fadeAnim.setValue(0);
    moveAnim.setValue(24);
    scaleAnim.setValue(0.94);
    imageFloatAnim.setValue(10);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(imageFloatAnim, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    runSlideAnimation();
  }, []);

  const handleNext = () => {
    if (step === INTRO_SLIDES.length - 1) {
      navigation.replace('MainTabs');
      return;
    }

    setStep(prev => prev + 1);

    requestAnimationFrame(() => {
      runSlideAnimation();
    });
  };

  const handleClose = () => {
    navigation.replace('MainTabs');
  };

  return (
    <ImageBackground
      source={BG_IMAGE}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.bgOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.headerRow,
            {
              paddingTop: Math.max(insets.top, 6),
              paddingHorizontal: isVerySmallScreen ? 18 : 22,
            },
          ]}
        >
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.content,
            {
              paddingHorizontal: isVerySmallScreen ? 18 : 22,
              paddingTop: isVerySmallScreen ? 0 : 6,
              paddingBottom: (isVerySmallScreen ? 18 : 34) + 20,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.imageWrap,
              {
                width: TOP_IMAGE_W,
                height: TOP_IMAGE_H,
                marginTop: isVerySmallScreen ? 0 : 4,
                opacity: fadeAnim,
                transform: [
                  { translateY: imageFloatAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Image
              source={currentSlide.image}
              resizeMode="contain"
              style={styles.topImage}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.textBlock,
              {
                marginTop: isVerySmallScreen ? -2 : -4,
                opacity: fadeAnim,
                transform: [{ translateY: moveAnim }],
              },
            ]}
          >
            <Text
              style={[
                styles.eyebrow,
                {
                  fontSize: isVerySmallScreen ? 13 : 14,
                  marginBottom: isVerySmallScreen ? 3 : 4,
                },
              ]}
            >
              {currentSlide.eyebrow}
            </Text>

            <Text
              style={[
                styles.title,
                {
                  width: CARD_W + (isVerySmallScreen ? 16 : 28),
                  fontSize: isVerySmallScreen ? 18 : 20,
                  lineHeight: isVerySmallScreen ? 24 : 28,
                  marginBottom: isVerySmallScreen ? 14 : 18,
                },
              ]}
            >
              {currentSlide.title}
            </Text>

            <View
              style={[
                styles.infoCard,
                {
                  width: CARD_W,
                  minHeight: isVerySmallScreen ? 68 : 76,
                  paddingHorizontal: isVerySmallScreen ? 14 : 16,
                  paddingVertical: isVerySmallScreen ? 11 : 13,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoText,
                  {
                    fontSize: isVerySmallScreen ? 12.5 : 13,
                    lineHeight: isVerySmallScreen ? 17 : 19,
                  },
                ]}
              >
                {currentSlide.text}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.footer,
              {
                marginTop: isVerySmallScreen ? 12 : 18,
                opacity: fadeAnim,
                transform: [{ translateY: moveAnim }],
              },
            ]}
          >
            <Pressable
              style={[
                styles.primaryButton,
                {
                  minWidth: isVerySmallScreen ? 122 : 128,
                  height: isVerySmallScreen ? 40 : 42,
                  paddingHorizontal: isVerySmallScreen ? 18 : 22,
                },
              ]}
              onPress={handleNext}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { fontSize: isVerySmallScreen ? 13 : 14 },
                ]}
              >
                {currentSlide.buttonLabel}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#063C13',
  },
  backgroundImage: {
    alignSelf: 'center',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    paddingBottom: 6,
  },
  closeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1130F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  closeText: {
    color: '#000000',
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '900',
    marginTop: -1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignItems: 'center',
  },
  eyebrow: {
    lineHeight: 18,
    color: '#F4EFE6',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  title: {
    color: '#FFF7EF',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  infoCard: {
    backgroundColor: '#F3ECE8',
    borderWidth: 2,
    borderColor: '#99241D',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  infoText: {
    color: '#3B2D28',
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: 6,
    backgroundColor: '#D90F0B',
    borderWidth: 1.5,
    borderColor: '#8A0906',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#120000',
    fontWeight: '900',
  },
});