import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Utils and Store / locals imports

import { getNumber, incrementNumber } from '../utils/tinneTapGameUtils';
import { useTinneStore } from '../MasterStore/tinneContext';

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const textColor = '#A61154';
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const RANGES = {
  AWESOME: 150,
  GOOD: 300,
  NOT_BAD: 600,
};

const STORE_KEYS = {
  SCORE: 'GAME_SCORE',
  CLOCKS: 'TIME_CLOCKS',
  TOTAL_CATCHES: 'TOTAL_CATCHES',
  TOTAL_TIME: 'TOTAL_TIME',
};

const getRandomTargetTime = () => {
  const seconds = Math.floor(Math.random() * 10) + 5;
  const targetTime = seconds * 1000;

  return targetTime;
};

const TapGameScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  const [time, setTime] = useState(0);
  const [targetTime, setTargetTime] = useState(getRandomTargetTime());
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [clocks, setClocks] = useState(0);
  const [result, setResult] = useState('idle');
  const sessionStartRef = useRef(0);
  const { crazysTinneVibrationEnabled } = useTinneStore();

  useEffect(() => {
    sessionStartRef.current = Date.now();

    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      const sessionTime = Math.floor(
        (Date.now() - sessionStartRef.current) / 1000,
      );

      if (sessionTime > 0) {
        await incrementNumber(STORE_KEYS.TOTAL_TIME, sessionTime);
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const getSaved = async () => {
      try {
        const savedScore = await getNumber(STORE_KEYS.SCORE);
        const savedClocks = await getNumber(STORE_KEYS.CLOCKS);

        setScore(savedScore);
        setClocks(savedClocks);
      } catch (error) {
        console.error('Error (score and clocks):', error);
      }
    };

    getSaved();
  }, []);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => timerRef.current && clearInterval(timerRef.current);
  }, [running]);

  const startGame = () => {
    setTime(0);
    setResult('idle');

    const targTime = getRandomTargetTime();
    setTargetTime(targTime);
    setRunning(true);
  };

  const stopGame = async () => {
    clearInterval(timerRef.current);
    setRunning(false);

    if (crazysTinneVibrationEnabled) {
      Vibration.vibrate(500);
      console.log('vibration!');
    }

    const diff = Math.abs(time - targetTime);

    if (diff <= RANGES.AWESOME) {
      await incrementNumber(STORE_KEYS.TOTAL_CATCHES, 1);
      const newScore = await incrementNumber(STORE_KEYS.SCORE, 1);
      const newClocks = await incrementNumber(STORE_KEYS.CLOCKS, 3);

      setScore(newScore);
      setClocks(newClocks);
      setResult('awesome');
      return;
    }

    if (diff <= RANGES.GOOD) {
      await incrementNumber(STORE_KEYS.TOTAL_CATCHES, 1);
      const newScore = await incrementNumber(STORE_KEYS.SCORE, 1);
      const newClocks = await incrementNumber(STORE_KEYS.CLOCKS, 2);

      setScore(newScore);
      setClocks(newClocks);
      setResult('good');
      return;
    }

    if (diff <= RANGES.NOT_BAD) {
      await incrementNumber(STORE_KEYS.TOTAL_CATCHES, 1);
      const newClocks = await incrementNumber(STORE_KEYS.CLOCKS, 1);

      setClocks(newClocks);
      setResult('not_bad');
      return;
    }

    setResult('lose');
  };

  const formatTime = ms => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `00:${String(seconds).padStart(2, '0')}:${String(
      milliseconds,
    ).padStart(2, '0')}`;
  };

  const NextButton = () => (
    <TouchableOpacity onPress={startGame} activeOpacity={0.7}>
      <LinearGradient
        colors={gradientColors}
        start={gradientXY}
        end={gradientXYEnd}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>

          <Image
            source={require('../assets/images/loader_icon.png')}
            style={{ width: 108, height: 70 }}
          />

          <View style={styles.clockRow}>
            <Image source={require('../assets/images/quantImg.png')} />
            <Text style={styles.clockText}>{clocks}</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={[styles.score, { marginBottom: height * 0.08 }]}>
            {score}
          </Text>

          {result === 'idle' && (
            <>
              <Text style={styles.targetTime}>{formatTime(targetTime)}</Text>
              <Text style={styles.timer}>{formatTime(time)}</Text>

              <TouchableOpacity
                onPress={running ? stopGame : startGame}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={gradientXY}
                  end={gradientXYEnd}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {running ? 'Stop' : 'Start'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {result === 'awesome' && (
            <>
              <Image
                source={require('../assets/images/awesome.png')}
                style={styles.resultImg}
              />

              <NextButton />
            </>
          )}

          {result === 'good' && (
            <>
              <Image
                source={require('../assets/images/good.png')}
                style={styles.resultImg}
              />

              <NextButton />
            </>
          )}

          {result === 'not_bad' && (
            <>
              <Image
                source={require('../assets/images/not_bad.png')}
                style={styles.resultImg}
              />

              <NextButton />
            </>
          )}

          {result === 'lose' && (
            <>
              <Image
                source={require('../assets/images/game_over.png')}
                style={styles.resultImg}
              />
              <View style={styles.gameOverRow}>
                <TouchableOpacity
                  onPress={() => navigation.popToTop()}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={gradientColors}
                    start={gradientXY}
                    end={gradientXYEnd}
                    style={styles.roundBtn}
                  >
                    <Image source={require('../assets/icons/home.png')} />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={startGame} activeOpacity={0.7}>
                  <LinearGradient
                    colors={gradientColors}
                    start={gradientXY}
                    end={gradientXYEnd}
                    style={styles.roundBtn}
                  >
                    <Image source={require('../assets/icons/restart.png')} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backBtn: {
    backgroundColor: '#100237',
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E63182',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#100237',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E63182',
  },
  clockText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9A300',
  },
  sheet: {
    flex: 1,
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    alignItems: 'center',
    paddingTop: 60,
  },
  scoreLabel: {
    fontSize: 22,
    color: textColor,
    fontWeight: '700',
  },
  score: {
    fontSize: 64,
    color: textColor,
    fontWeight: '900',
  },
  targetTime: {
    fontSize: 24,
    color: textColor,
    marginBottom: 20,
  },
  timer: {
    fontSize: 36,
    color: textColor,
    marginBottom: 40,
    fontWeight: '800',
  },
  button: {
    width: 260,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: mainWhite,
    fontSize: 22,
    fontWeight: '800',
  },
  resultImg: {
    width: 300,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  rewardText: {
    fontSize: 18,
    color: textColor,
    marginBottom: 20,
    fontWeight: '600',
  },
  gameOverRow: {
    flexDirection: 'row',
    gap: 20,
  },
  roundBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TapGameScreen;
