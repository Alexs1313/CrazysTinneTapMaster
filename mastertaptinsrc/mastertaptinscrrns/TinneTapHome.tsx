// home screen

import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Sound from 'react-native-sound';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { getNumber } from '../utils/tinneTapGameUtils';
import { useTinneStore } from '../mastertaptinstorage/tinneContext';

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const textColor = '#A61154';
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const STORAGE_KEYS = {
  CLOCKS: 'TIME_CLOCKS',
  SCORE: 'GAME_SCORE',
  MAX_RUN_SCORE: 'MAX_RUN_SCORE',
};

const RANDOM_FACTS = [
  'The average human reaction time is about 0.25 seconds.',
  'A single second contains 1,000 milliseconds.',
  'Your brain can notice differences in time as small as 20 milliseconds.',
  'The fastest human reaction times can be under 0.15 seconds.',
  'Your sense of time is controlled by several parts of the brain, not just one.',
  'When you focus intensely, time can feel like it moves slower.',
  'The word "second" comes from the Latin phrase pars minuta secunda.',
  'The human brain constantly predicts the next moment in time.',
  'Time perception changes depending on emotion and attention.',
  'Professional gamers often train to improve reaction speed and timing.',
  "When you're bored, time feels slower because your brain processes more details.",
  'Your internal sense of timing is sometimes called a biological clock.',
  'The first mechanical clocks appeared in Europe around the 14th century.',
  'Some animals can sense time intervals even better than humans.',
  'The human brain processes visual information in about 13 milliseconds.',
  'A blink of an eye takes roughly 0.3 seconds.',
  'Your brain automatically adjusts your perception of short time intervals.',
  'Even small distractions can change your timing accuracy.',
  'Athletes often train to react within fractions of a second.',
  'Time perception becomes less accurate when you are tired.',
  "The world's most accurate atomic clocks lose less than one second in millions of years.",
  'The faster you focus, the more precise your timing decisions become.',
  'Humans are surprisingly good at estimating one-second intervals.',
  'Music rhythm can improve your sense of timing.',
  'Adrenaline can make time feel like it slows down.',
  'Your brain constantly predicts when things will happen next.',
  'A perfect tap requires both attention and anticipation.',
  'Many arcade games rely on millisecond timing precision.',
  'Even expert players sometimes miss by just a few milliseconds.',
  'Every moment you react to the world happens in fractions of a second.',
];

const TinneTapHome = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [clocks, setClocks] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [crazysTinneMusIdx, setCrazysTinneMusIdx] = useState(0);
  const [sound, setSound] = useState(null);
  const [randomFactIndex, setRandomFactIndex] = useState(0);

  const currentFact = useMemo(
    () => RANDOM_FACTS[randomFactIndex],
    [randomFactIndex],
  );

  const shareFact = useCallback(() => {
    Share.share({
      message: `${currentFact}\n\nChazyTimes: Tap Master`,
      title: 'Tap Master fact',
    });
  }, [currentFact]);
  const crazysTinneTracksCycle = [
    'winter-weather-427454.mp3',
    'winter-weather-427454.mp3',
  ];
  const {
    setCrazysTinneVibrationEnabled,
    crazysTinneMusicEnabled,
    setCrazysTinneMusicEnabled,
  } = useTinneStore();

  useFocusEffect(
    useCallback(() => {
      loadCrazysTinneMusic();
      loadCrazysTinneVibration();
      fetchSavedData();
      setRandomFactIndex(Math.floor(Math.random() * RANDOM_FACTS.length));
    }, []),
  );

  const fetchSavedData = async () => {
    const savedClocks = await getNumber(STORAGE_KEYS.CLOCKS);

    const maxRunStr = await AsyncStorage.getItem(STORAGE_KEYS.MAX_RUN_SCORE);
    const savedMaxRun = Number(maxRunStr || '0');

    setClocks(savedClocks);
    setMaxScore(savedMaxRun);
  };

  useEffect(() => {
    playCrazysTinneMusic(crazysTinneMusIdx);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [crazysTinneMusIdx]);

  const playCrazysTinneMusic = index => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const crazysTinneTrackPath = crazysTinneTracksCycle[index];

    const newCrazysTinneGameSound = new Sound(
      crazysTinneTrackPath,

      Sound.MAIN_BUNDLE,

      error => {
        if (error) {
          console.log('Error =>', error);
          return;
        }

        newCrazysTinneGameSound.play(success => {
          if (success) {
            setCrazysTinneMusIdx(
              prevIndex => (prevIndex + 1) % crazysTinneTracksCycle.length,
            );
          } else {
            console.log('Error =>');
          }
        });
        setSound(newCrazysTinneGameSound);
      },
    );
  };

  useEffect(() => {
    const setVolumeGameMusic = async () => {
      try {
        const tinneMusicValue = await AsyncStorage.getItem(
          'toggleTapMasterMusic',
        );

        const isTinneMusicOn = JSON.parse(tinneMusicValue);
        setCrazysTinneMusicEnabled(isTinneMusicOn);
        if (sound) {
          sound.setVolume(isTinneMusicOn ? 1 : 0);
        }
      } catch (error) {
        console.error('Error =>', error);
      }
    };

    setVolumeGameMusic();
  }, [sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(crazysTinneMusicEnabled ? 1 : 0);
    }
  }, [crazysTinneMusicEnabled]);

  const loadCrazysTinneVibration = async () => {
    try {
      const crazysTinneVibrationValue = await AsyncStorage.getItem(
        'toggleTapMasterVibration',
      );
      if (crazysTinneVibrationValue !== null) {
        const isCrazysTinneVibrationOn = JSON.parse(crazysTinneVibrationValue);
        setCrazysTinneVibrationEnabled(isCrazysTinneVibrationOn);
      }
    } catch (error) {
      console.error('Error!', error);
    }
  };

  const loadCrazysTinneMusic = async () => {
    try {
      const tinneMusicValue = await AsyncStorage.getItem(
        'toggleTapMasterMusic',
      );
      const isTinneMusicOn = JSON.parse(tinneMusicValue);
      setCrazysTinneMusicEnabled(isTinneMusicOn);
    } catch (error) {
      console.error('Error loading settings =>', error);
    }
  };

  return (
    <ImageBackground style={{ flex: 1 }} source={bgImage}>
      <View style={styles.clockRowTopRight}>
        <Image source={require('../assets/images/quantImg.png')} />
        <Text style={styles.clockRowText}>{clocks}</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainContainer}>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../assets/images/loader_icon.png')}
              style={[styles.onboardImage, { marginBottom: height * 0.03 }]}
            />
          ) : (
            <Image
              source={require('../assets/images/loadericon.png')}
              style={{
                width: 350,
                height: 200,
                marginBottom: height * 0.06,
                alignSelf: 'center',
              }}
            />
          )}

          <View style={[styles.bottomSheet, { minHeight: height * 0.6 }]}>
            <Text style={styles.secondTitle}>Max score:</Text>
            <Text style={styles.scoreTxt}>{maxScore}</Text>

            <View style={styles.factBox}>
              <Text style={styles.factText}>{currentFact}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={shareFact}
                style={styles.factShareButtonWrap}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientXY}
                  end={gradientXYEnd}
                  style={styles.factShareButton}
                >
                  <Text style={styles.gradientButtonText}>Share</Text>
                  <Image
                    source={require('../assets/images/tinneetpmastshr.png')}
                    style={{ top: 2 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('TapGameScreen')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={gradientColors}
                start={gradientXY}
                end={gradientXYEnd}
                style={styles.gradientButton}
              >
                <Text style={styles.gradientButtonText}>Start</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('MasterTapWallpapers')}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientXY}
                  end={gradientXYEnd}
                  style={styles.gradientRoundButton}
                >
                  <Image source={require('../assets/icons/vibration.png')} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('TapMasterStories')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientXY}
                  end={gradientXYEnd}
                  style={styles.gradientRoundButton}
                >
                  <Image
                    source={require('../assets/images/tinneetpmstrrs.png')}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Mastrduogmscrn')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientXY}
                  end={gradientXYEnd}
                  style={styles.gradientRoundButton}
                >
                  <Image
                    source={require('../assets/images/tinneetpmdblgm.png')}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('TinneSettings')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientXY}
                  end={gradientXYEnd}
                  style={styles.gradientRoundButton}
                >
                  <Image source={require('../assets/icons/settings.png')} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  clockRowTopRight: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#100237',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E63182',
    justifyContent: 'center',
    minWidth: 100,
  },
  clockRowText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9A300',
    marginLeft: 8,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    padding: 40,
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 20,
    paddingBottom: 90,
  },
  firstTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9A300',
    textAlign: 'center',
  },
  secondTitle: {
    fontSize: 20,
    color: textColor,
    fontWeight: '800',
    textAlign: 'center',
  },
  scoreTxt: {
    fontSize: 60,
    color: textColor,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  factBox: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#EA3385',
    padding: 16,
    marginBottom: 20,
  },
  factText: {
    fontSize: 16,
    color: mainWhite,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
    fontWeight: '300',
  },
  factShareButtonWrap: {
    alignSelf: 'center',
    width: '100%',
    marginTop: 20,
  },
  factShareButton: {
    height: 40,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  gradientButton: {
    marginTop: 14,
    justifyContent: 'center',
    height: 70,
    borderRadius: 32,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  gradientRoundButton: {
    justifyContent: 'center',
    height: 70,
    borderRadius: 32,
    alignItems: 'center',
    width: 70,
    alignSelf: 'center',
  },
  gradientButtonText: {
    color: mainWhite,
    fontWeight: '800',
    fontSize: 20,
  },
  onboardImage: {
    width: 107,
    height: 117,
    alignSelf: 'center',

    resizeMode: 'contain' as const,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 30,
    justifyContent: 'center',
  },
});

export default TinneTapHome;
