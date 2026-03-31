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
  Platform,
  StatusBar,
  Share,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import type { MainTabParamList } from '../navigation/navTypes';
import { quizLevels, type QuizLevel } from '../data/quizPrompts';

type Props = BottomTabScreenProps<MainTabParamList, 'PlaceChallenge'>;

const BG_DARK = require('../assets/images/gallery_base_backdrop.png');
const BG_RED = require('../assets/images/gallery_active_layer.png');
const BACK_ICON = require('../assets/icons/nav_back_soft.png');
const SHARE_ICON = require('../assets/icons/action_share_soft.png');
const HOME_ICON = require('../assets/icons/nav_home_soft.png');

const INTRO_IMAGE = require('../assets/images/quiz_volcano_island.png');
const RESULT_WIN_IMAGE = require('../assets/images/quiz_volcano_steam.png');
const RESULT_LOSE_IMAGE = require('../assets/images/quiz_volcano_crater.png');

const STORAGE_CURRENT_LEVEL_KEY = 'volcano_quiz_current_level';
const STORAGE_UNLOCKED_LEVEL_KEY = 'volcano_quiz_unlocked_level';

type ScreenMode = 'intro' | 'playing' | 'result';

export default function PlaceChallengeScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = height <= 740;
  const isVerySmallScreen = height <= 680;
  const isNarrowScreen = width <= 360;

  const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 10;
  const contentOffset = isVerySmallScreen ? 20 : 40;

  const [mode, setMode] = useState<ScreenMode>('intro');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answersLocked, setAnswersLocked] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [levelPassed, setLevelPassed] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const introOpacity = useRef(new Animated.Value(0)).current;
  const introTranslateY = useRef(new Animated.Value(36)).current;
  const introScale = useRef(new Animated.Value(0.98)).current;

  const playOpacity = useRef(new Animated.Value(0)).current;
  const playTranslateY = useRef(new Animated.Value(40)).current;
  const playScale = useRef(new Animated.Value(0.985)).current;

  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0.9)).current;
  const resultTranslateY = useRef(new Animated.Value(26)).current;

  const startPulse = useRef(new Animated.Value(1)).current;

  const optionsOpacity = useRef(new Animated.Value(0)).current;
  const optionsTranslateY = useRef(new Animated.Value(16)).current;

  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentLevel: QuizLevel = useMemo(() => {
    return quizLevels[Math.max(0, Math.min(currentLevelIndex, quizLevels.length - 1))];
  }, [currentLevelIndex]);

  const currentQuestion = currentLevel.questions[questionIndex];

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (!loadingProgress && mode === 'intro') {
      runIntroAnimation();
      runStartPulse();
    }
  }, [loadingProgress, mode]);

  useEffect(() => {
    if (mode === 'playing') {
      runOptionsAnimation();
    }
  }, [mode, questionIndex]);

  useFocusEffect(
    useCallback(() => {
      if (!loadingProgress) {
        resetRoundState();
        setMode('intro');
        requestAnimationFrame(() => {
          runIntroAnimation();
          runStartPulse();
        });
      }

      return () => {
        stopStartPulse();
      };
    }, [loadingProgress]),
  );

  const stopStartPulse = () => {
    pulseLoopRef.current?.stop();
    pulseLoopRef.current = null;
    startPulse.setValue(1);
  };

  const runStartPulse = () => {
    stopStartPulse();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(startPulse, {
          toValue: 1.03,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(startPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseLoopRef.current = loop;
    loop.start();
  };

  const runIntroAnimation = () => {
    introOpacity.setValue(0);
    introTranslateY.setValue(36);
    introScale.setValue(0.98);

    Animated.parallel([
      Animated.timing(introOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(introTranslateY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(introScale, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const runPlayAnimation = () => {
    playOpacity.setValue(0);
    playTranslateY.setValue(40);
    playScale.setValue(0.985);

    Animated.parallel([
      Animated.timing(playOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(playTranslateY, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(playScale, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const runOptionsAnimation = () => {
    optionsOpacity.setValue(0);
    optionsTranslateY.setValue(16);

    Animated.parallel([
      Animated.timing(optionsOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(optionsTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const runResultAnimation = () => {
    resultOpacity.setValue(0);
    resultScale.setValue(0.9);
    resultTranslateY.setValue(26);

    Animated.parallel([
      Animated.timing(resultOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(resultScale, {
        toValue: 1,
        friction: 7,
        tension: 72,
        useNativeDriver: true,
      }),
      Animated.timing(resultTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadProgress = async () => {
    try {
      const storedCurrentLevel = await AsyncStorage.getItem(STORAGE_CURRENT_LEVEL_KEY);
      const storedUnlockedLevel = await AsyncStorage.getItem(STORAGE_UNLOCKED_LEVEL_KEY);

      const safeCurrentLevel = storedCurrentLevel ? Number(storedCurrentLevel) : 0;
      const safeUnlockedLevel = storedUnlockedLevel ? Number(storedUnlockedLevel) : 0;

      setCurrentLevelIndex(
        Number.isNaN(safeCurrentLevel)
          ? 0
          : Math.max(0, Math.min(safeCurrentLevel, quizLevels.length - 1)),
      );

      setUnlockedLevelIndex(
        Number.isNaN(safeUnlockedLevel)
          ? 0
          : Math.max(0, Math.min(safeUnlockedLevel, quizLevels.length - 1)),
      );
    } catch (error) {
      console.log('Load quiz progress error:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const saveProgress = async (levelIndex: number, unlockedIndex: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_CURRENT_LEVEL_KEY, String(levelIndex));
      await AsyncStorage.setItem(STORAGE_UNLOCKED_LEVEL_KEY, String(unlockedIndex));
    } catch (error) {
      console.log('Save quiz progress error:', error);
    }
  };

  const resetRoundState = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswersLocked(false);
    setCorrectAnswersCount(0);
    setLevelPassed(false);
  };

  const handleStartQuiz = () => {
    stopStartPulse();
    resetRoundState();
    setMode('playing');
    requestAnimationFrame(() => {
      runPlayAnimation();
    });
  };

  const handleBackToIntro = () => {
    resetRoundState();
    setMode('intro');
    requestAnimationFrame(() => {
      runIntroAnimation();
      runStartPulse();
    });
  };

  const handleSelectAnswer = (answer: string) => {
    if (answersLocked) {
      return;
    }

    setSelectedAnswer(answer);
    setAnswersLocked(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    const nextCorrectCount = isCorrect ? correctAnswersCount + 1 : correctAnswersCount;

    if (isCorrect) {
      setCorrectAnswersCount(nextCorrectCount);
    }

    setTimeout(async () => {
      const isLastQuestion = questionIndex === currentLevel.questions.length - 1;

      if (!isLastQuestion) {
        setQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswersLocked(false);
        return;
      }

      const passedLevel = nextCorrectCount >= 4;
      setLevelPassed(passedLevel);

      if (passedLevel) {
        const nextUnlocked = Math.min(
          Math.max(unlockedLevelIndex, currentLevelIndex + 1),
          quizLevels.length - 1,
        );

        const nextCurrent =
          currentLevelIndex < quizLevels.length - 1 ? currentLevelIndex + 1 : currentLevelIndex;

        setUnlockedLevelIndex(nextUnlocked);
        setCurrentLevelIndex(nextCurrent);

        await saveProgress(nextCurrent, nextUnlocked);
      } else {
        await saveProgress(currentLevelIndex, unlockedLevelIndex);
      }

      setMode('result');
      requestAnimationFrame(() => {
        runResultAnimation();
      });
    }, 700);
  };

  const handleNextLevel = () => {
    resetRoundState();
    setMode('playing');
    requestAnimationFrame(() => {
      runPlayAnimation();
    });
  };

  const handleTryLevelAgain = () => {
    resetRoundState();
    setMode('playing');
    requestAnimationFrame(() => {
      runPlayAnimation();
    });
  };

  const handleShareResult = async () => {
    try {
      const levelText = currentLevel.title;
      const resultText = levelPassed ? 'Level Complete' : 'Volcano Challenge Failed';

      await Share.share({
        message: `${resultText}\n\n${levelText}\n\nVolcano Quiz Progress`,
      });
    } catch (error) {
      console.log('Share quiz result error:', error);
    }
  };

  const getAnswerButtonStyle = (option: string) => {
    if (!answersLocked) {
      return styles.optionButton;
    }

    if (option === currentQuestion.correctAnswer) {
      return styles.optionButtonCorrect;
    }

    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return styles.optionButtonWrong;
    }

    return styles.optionButtonMuted;
  };

  if (loadingProgress) {
    return (
      <ImageBackground source={BG_DARK} resizeMode="cover" style={styles.background}>
        <View style={styles.overlay} />
      </ImageBackground>
    );
  }

  const resultImage = levelPassed ? RESULT_WIN_IMAGE : RESULT_LOSE_IMAGE;

  return (
    <ImageBackground
      source={mode === 'intro' ? BG_DARK : BG_RED}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay} />

      {mode === 'intro' && (
        <Animated.View
          style={[
            styles.introRoot,
            {
              opacity: introOpacity,
              transform: [{ translateY: introTranslateY }, { scale: introScale }],
              paddingTop: contentOffset,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isVerySmallScreen ? 28 : 36,
            }}
          >
            <View
              style={[
                styles.headerOnlyWrap,
                {
                  paddingTop: topInset + 18,
                  paddingHorizontal: isVerySmallScreen ? 16 : 20,
                },
              ]}
            >
              <View
                style={[
                  styles.titlePillSingle,
                  {
                    minWidth: isVerySmallScreen ? 180 : 205,
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
                  Volcano Quiz
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.introContent,
                {
                  paddingHorizontal: isVerySmallScreen ? 16 : 22,
                  paddingTop: isVerySmallScreen ? 18 : 30,
                },
              ]}
            >
              <Image
                source={INTRO_IMAGE}
                resizeMode="contain"
                style={{
                  width: isVerySmallScreen ? 200 : isSmallScreen ? 250 : 294,
                  height: isVerySmallScreen ? 190 : isSmallScreen ? 238 : 283,
                }}
              />

              <Text
                style={[
                  styles.introTitle,
                  {
                    marginTop: isVerySmallScreen ? 6 : 10,
                    fontSize: isVerySmallScreen ? 16 : 20,
                    lineHeight: isVerySmallScreen ? 22 : 26,
                  },
                ]}
              >
                Test Your Volcano Knowledge
              </Text>

              <Text
                style={[
                  styles.introDescription,
                  {
                    marginTop: isVerySmallScreen ? 10 : 12,
                    fontSize: isVerySmallScreen ? 12 : 14,
                    lineHeight: isVerySmallScreen ? 17 : 20,
                    width: isVerySmallScreen ? width - 52 : isNarrowScreen ? width - 56 : width - 90,
                  },
                ]}
              >
                How well do you know Iceland’s volcanic landscapes? Take a short quiz and discover
                fascinating facts about the forces that shaped this land.
              </Text>

              <Text
                style={[
                  styles.savedLevelHint,
                  {
                    marginTop: isVerySmallScreen ? 10 : 12,
                    fontSize: isVerySmallScreen ? 11 : 13,
                  },
                ]}
              >
                Current saved level: {currentLevel.title}
              </Text>

              <Animated.View
                style={{
                  transform: [{ scale: startPulse }],
                }}
              >
                <Pressable
                  style={[
                    styles.startButton,
                    {
                      marginTop: isVerySmallScreen ? 18 : 28,
                      width: isVerySmallScreen ? 182 : 218,
                      height: isVerySmallScreen ? 46 : 56,
                      borderRadius: isVerySmallScreen ? 10 : 12,
                    },
                  ]}
                  onPress={handleStartQuiz}
                >
                  <Text
                    style={[
                      styles.startButtonText,
                      {
                        fontSize: isVerySmallScreen ? 15 : 18,
                      },
                    ]}
                  >
                    Start Quiz
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {mode === 'playing' && (
        <Animated.View
          style={[
            styles.playRoot,
            {
              opacity: playOpacity,
              transform: [{ translateY: playTranslateY }, { scale: playScale }],
              paddingTop: contentOffset,
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
                styles.playHeaderWrap,
                {
                  paddingTop: topInset + 18,
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
                  styles.titlePillWide,
                  {
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
                  {currentLevel.title}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.playContent,
                {
                  paddingHorizontal: isVerySmallScreen ? 16 : 22,
                  paddingTop: isVerySmallScreen ? 24 : 44,
                },
              ]}
            >
              <View
                style={[
                  styles.questionOuter,
                  {
                    width: isVerySmallScreen ? width - 32 : width - 44,
                    padding: isVerySmallScreen ? 10 : 14,
                  },
                ]}
              >
                <View
                  style={[
                    styles.questionInner,
                    {
                      minHeight: isVerySmallScreen ? 94 : 114,
                      paddingHorizontal: isVerySmallScreen ? 14 : 20,
                      paddingVertical: isVerySmallScreen ? 16 : 20,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.questionText,
                      {
                        fontSize: isVerySmallScreen ? 13 : 15,
                        lineHeight: isVerySmallScreen ? 18 : 22,
                      },
                    ]}
                  >
                    {currentQuestion.question}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.progressText,
                  {
                    marginTop: isVerySmallScreen ? 12 : 16,
                    fontSize: isVerySmallScreen ? 11 : 13,
                  },
                ]}
              >
                Question {questionIndex + 1} of {currentLevel.questions.length}
              </Text>

              <Animated.View
                style={[
                  styles.optionsWrap,
                  {
                    marginTop: isVerySmallScreen ? 20 : 32,
                    opacity: optionsOpacity,
                    transform: [{ translateY: optionsTranslateY }],
                  },
                ]}
              >
                {currentQuestion.options.map(option => (
                  <Pressable
                    key={option}
                    style={[
                      getAnswerButtonStyle(option),
                      {
                        width: isVerySmallScreen ? width - 92 : Math.min(234, width - 110),
                        minHeight: isVerySmallScreen ? 44 : 50,
                        borderRadius: isVerySmallScreen ? 10 : 11,
                        marginBottom: isVerySmallScreen ? 10 : 14,
                        paddingHorizontal: 12,
                        paddingVertical: isVerySmallScreen ? 10 : 12,
                      },
                    ]}
                    onPress={() => handleSelectAnswer(option)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        {
                          fontSize: isVerySmallScreen ? 13 : 15,
                          lineHeight: isVerySmallScreen ? 17 : 19,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </Animated.View>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {mode === 'result' && (
        <Animated.View
          style={[
            styles.resultOverlay,
            {
              opacity: resultOpacity,
              paddingTop: contentOffset,
            },
          ]}
        >
          <View style={styles.resultBackdrop} />

          <Animated.View
            style={[
              styles.resultCard,
              {
                transform: [{ scale: resultScale }, { translateY: resultTranslateY }],
                width: isVerySmallScreen ? width - 34 : width - 70,
                borderRadius: isVerySmallScreen ? 20 : 24,
                paddingHorizontal: isVerySmallScreen ? 16 : 24,
                paddingTop: isVerySmallScreen ? 18 : 26,
                paddingBottom: isVerySmallScreen ? 18 : 26,
              },
            ]}
          >
            <Image
              source={resultImage}
              resizeMode="contain"
              style={{
                width: isVerySmallScreen ? 130 : 170,
                height: isVerySmallScreen ? 86 : 112,
              }}
            />

            <Text
              style={[
                styles.resultTitle,
                {
                  fontSize: isVerySmallScreen ? 16 : 20,
                  lineHeight: isVerySmallScreen ? 22 : 26,
                  marginTop: isVerySmallScreen ? 8 : 12,
                },
              ]}
            >
              {levelPassed ? currentLevel.resultWinTitle : currentLevel.resultLoseTitle}
            </Text>

            <Text
              style={[
                styles.resultText,
                {
                  fontSize: isVerySmallScreen ? 12 : 14,
                  lineHeight: isVerySmallScreen ? 18 : 22,
                  marginTop: isVerySmallScreen ? 12 : 16,
                },
              ]}
            >
              {levelPassed ? currentLevel.resultWinText : currentLevel.resultLoseText}
            </Text>

            <View
              style={[
                styles.resultActionsRow,
                {
                  marginTop: isVerySmallScreen ? 18 : 24,
                  gap: isVerySmallScreen ? 8 : 12,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.resultCircleButton,
                  {
                    width: isVerySmallScreen ? 40 : 48,
                    height: isVerySmallScreen ? 40 : 48,
                    borderRadius: isVerySmallScreen ? 20 : 24,
                  },
                ]}
                onPress={handleShareResult}
              >
                <Image
                  source={SHARE_ICON}
                  resizeMode="contain"
                  style={[
                    styles.resultActionIcon,
                    {
                      width: isVerySmallScreen ? 18 : 22,
                      height: isVerySmallScreen ? 18 : 22,
                    },
                  ]}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.resultMainButton,
                  {
                    minWidth: isVerySmallScreen ? 146 : 190,
                    height: isVerySmallScreen ? 44 : 54,
                    borderRadius: isVerySmallScreen ? 22 : 27,
                  },
                ]}
                onPress={levelPassed ? handleNextLevel : handleTryLevelAgain}
              >
                <Text
                  style={[
                    styles.resultMainButtonText,
                    {
                      fontSize: isVerySmallScreen ? 14 : 16,
                    },
                  ]}
                >
                  {levelPassed ? 'Next Level' : 'Try Again'}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.resultCircleButton,
                  {
                    width: isVerySmallScreen ? 40 : 48,
                    height: isVerySmallScreen ? 40 : 48,
                    borderRadius: isVerySmallScreen ? 20 : 24,
                  },
                ]}
                onPress={handleBackToIntro}
              >
                <Image
                  source={HOME_ICON}
                  resizeMode="contain"
                  style={[
                    styles.resultActionIcon,
                    {
                      width: isVerySmallScreen ? 18 : 22,
                      height: isVerySmallScreen ? 18 : 22,
                    },
                  ]}
                />
              </Pressable>
            </View>
          </Animated.View>
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

  headerOnlyWrap: {
    alignItems: 'center',
  },
  introRoot: {
    flex: 1,
  },
  introContent: {
    alignItems: 'center',
  },
  titlePillSingle: {
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  titlePillWide: {
    flex: 1,
    backgroundColor: '#BDB682',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  titlePillText: {
    color: '#111111',
    fontWeight: '800',
    textAlign: 'center',
  },
  introTitle: {
    color: '#FFF0D8',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(255,160,72,0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  introDescription: {
    color: '#FFF4E8',
    fontWeight: '600',
    textAlign: 'center',
  },
  savedLevelHint: {
    color: '#E7D6B0',
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.95,
  },
  startButton: {
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
  startButtonText: {
    color: '#FFF6EA',
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.24)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  playRoot: {
    flex: 1,
  },
  playHeaderWrap: {
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
  playContent: {
    alignItems: 'center',
  },
  questionOuter: {
    borderWidth: 1.5,
    borderColor: '#3D130D',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  questionInner: {
    backgroundColor: '#E6F8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    color: '#111111',
    fontWeight: '800',
    textAlign: 'center',
  },
  progressText: {
    color: '#F6E8C5',
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsWrap: {
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#E58E00',
    borderWidth: 1.5,
    borderColor: '#8E3E13',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonCorrect: {
    backgroundColor: '#B8B200',
    borderWidth: 1.5,
    borderColor: '#7D4E15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonWrong: {
    backgroundColor: '#C86B6B',
    borderWidth: 1.5,
    borderColor: '#8E3E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonMuted: {
    backgroundColor: '#D18E8E',
    borderWidth: 1.5,
    borderColor: '#8E3E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonText: {
    color: '#FFF6EA',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31,0,0,0.62)',
  },
  resultCard: {
    backgroundColor: '#DFC6C6',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  resultTitle: {
    color: '#7D3A3A',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resultText: {
    color: '#1A1111',
    fontWeight: '500',
    textAlign: 'center',
  },
  resultActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCircleButton: {
    backgroundColor: '#B29B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultMainButton: {
    backgroundColor: '#B29B00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  resultMainButtonText: {
    color: '#FFF8E9',
    fontWeight: '900',
  },
  resultActionIcon: {
    tintColor: '#FFF8E9',
  },
});