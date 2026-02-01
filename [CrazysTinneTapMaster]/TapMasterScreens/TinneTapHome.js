import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

import { getNumber } from '../utils/tinneTapGameUtils';
import { useTinneStore } from '../MasterStore/tinneContext';

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const textColor = '#A61154';
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const STORAGE_KEYS = {
  CLOCKS: 'TIME_CLOCKS',
  SCORE: 'GAME_SCORE',
};

const TinneTapHome = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [clocks, setClocks] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [crazysTinneMusIdx, setCrazysTinneMusIdx] = useState(0);
  const [sound, setSound] = useState(null);
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
    }, []),
  );

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

  useFocusEffect(
    useCallback(() => {
      const fetchSavedData = async () => {
        const savedClocks = await getNumber(STORAGE_KEYS.CLOCKS);
        const savedScore = await getNumber(STORAGE_KEYS.SCORE);

        setClocks(savedClocks);
        setMaxScore(savedScore);
      };

      fetchSavedData();
    }, []),
  );

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainContainer}>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../assets/images/loader_icon.png')}
              style={[styles.onboardImage, { marginBottom: height * 0.06 }]}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                alignItems: 'center',
                marginBottom: height * 0.04,
              }}
            >
              <Text style={styles.firstTitle}>{clocks}</Text>
              <Image source={require('../assets/images/quantImg.png')} />
            </View>

            <Text style={styles.secondTitle}>Max score:</Text>
            <Text style={styles.scoreTxt}>{maxScore}</Text>

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
                  <Image source={require('../assets/icons/wallp.png')} />
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
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 50,
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
  gradientButton: {
    marginTop: 14,
    justifyContent: 'center',
    height: 70,
    borderRadius: 32,
    alignItems: 'center',
    width: '82%',
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
    width: 258,
    height: 167,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 30,
    justifyContent: 'center',
  },
});

export default TinneTapHome;
