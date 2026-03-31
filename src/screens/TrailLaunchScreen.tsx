import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/navTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'TrailLaunch'>;

const BG_IMAGE = require('../assets/images/launch_backdrop_core.png');
const CENTER_IMAGE = require('../assets/images/launch_orbit_mark.png');

const { width } = Dimensions.get('window');

export default function TrailLaunchScreen({ navigation }: Props) {
  const [showWebLoader, setShowWebLoader] = useState(true);
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.92)).current;
  const imageTranslateY = useRef(new Animated.Value(18)).current;

  const loaderHtml = useMemo(
    () => `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: transparent;
            }

            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .spinner {
              position: relative;
              width: 42px;
              height: 42px;
            }

            .spinner div {
              position: absolute;
              left: 50%;
              top: 50%;
              width: 5px;
              height: 18px;
              margin-left: -2.5px;
              margin-top: -9px;
              border-radius: 999px;
              background: #FFFFFF;
              opacity: 0.92;
              transform-origin: center 14px;
              transform: rotate(calc(var(--rotation) * 1deg)) translateY(-14px);
              animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease-in-out;
              box-shadow: 0 0 6px rgba(255,255,255,0.28);
            }

            .spinner div:nth-child(1)  { --delay: 0.1; --rotation: 36; }
            .spinner div:nth-child(2)  { --delay: 0.2; --rotation: 72; }
            .spinner div:nth-child(3)  { --delay: 0.3; --rotation: 108; }
            .spinner div:nth-child(4)  { --delay: 0.4; --rotation: 144; }
            .spinner div:nth-child(5)  { --delay: 0.5; --rotation: 180; }
            .spinner div:nth-child(6)  { --delay: 0.6; --rotation: 216; }
            .spinner div:nth-child(7)  { --delay: 0.7; --rotation: 252; }
            .spinner div:nth-child(8)  { --delay: 0.8; --rotation: 288; }
            .spinner div:nth-child(9)  { --delay: 0.9; --rotation: 324; }
            .spinner div:nth-child(10) { --delay: 1.0; --rotation: 360; }

            @keyframes spinner-fzua35 {
              0%, 100% {
                transform: rotate(calc(var(--rotation) * 1deg)) translateY(-14px);
                opacity: 0.42;
              }
              50% {
                transform: rotate(calc(var(--rotation) * 1deg)) translateY(-18px);
                opacity: 1;
              }
            }
          </style>
        </head>
        <body>
          <div class="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </body>
      </html>
    `,
    [],
  );

  useEffect(() => {
  
    const webTimer = setTimeout(() => {
      setShowWebLoader(false);

      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(imageTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    const navTimer = setTimeout(() => {
      //navigation.replace('PathIntro');
    }, 6000);

    return () => {
      clearTimeout(webTimer);
      clearTimeout(navTimer);
    };
  }, [navigation, imageOpacity, imageScale, imageTranslateY]);

  return (
    <ImageBackground
      source={BG_IMAGE}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay} />

      <View style={styles.centerWrap}>
        {showWebLoader ? (
          <View style={styles.loaderShell}>
            <WebView
              originWhitelist={['*']}
              source={{ html: loaderHtml }}
              style={styles.webview}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              javaScriptEnabled
            />
          </View>
        ) : (
          <Animated.View
            style={[
              styles.imageHolder,
              {
                opacity: imageOpacity,
                transform: [
                  { scale: imageScale },
                  { translateY: imageTranslateY },
                ],
              },
            ]}
          >
            <Image
              source={CENTER_IMAGE}
              resizeMode="contain"
              style={styles.centerImage}
            />
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}

const BOX_SIZE = Math.min(width * 0.34, 170);
const IMAGE_SIZE = Math.min(width * 0.52, 240);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    alignSelf: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderShell: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: BOX_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'transparent',
  },
  imageHolder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerImage: {
    width: '100%',
    height: '100%',
  },
});