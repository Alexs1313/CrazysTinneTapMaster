import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { getNumber, incrementNumber } from '../utils/tinneTapGameUtils';
import { useTinneStore } from '../MasterStore/tinneContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };

const tinneMasterTextColor = '#A61154';
const tinneMasterWhite = '#FFFFFF';
const tinneMasterBgImage = require('../assets/images/app_background.png');

const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const TINNE_MASTER_RANGES = {
  AWESOME: 150,
  GOOD: 300,
  NOT_BAD: 600,
};

const TINNE_MASTER_STORE_KEYS = {
  SCORE: 'GAME_SCORE',
  CLOCKS: 'TIME_CLOCKS',
  TOTAL_CATCHES: 'TOTAL_CATCHES',
  TOTAL_TIME: 'TOTAL_TIME',
  MAX_RUN_SCORE: 'MAX_RUN_SCORE',
};

const tinneMasterGetRandomTargetTime = () => {
  const secondsTinneMaster = Math.floor(Math.random() * 10) + 5;
  return secondsTinneMaster * 1000;
};

const TapGameScreen = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterH } = useWindowDimensions();

  const tinneMasterTimerRef = useRef<any>(null);
  const tinneMasterStartTimeRef = useRef<number>(0);
  const tinneMasterSessionStartRef = useRef<number>(0);
  const [tinneMasterRunScore, setTinneMasterRunScore] = useState<number>(0);
  const [tinneMasterTime, setTinneMasterTime] = useState<number>(0);
  const [tinneMasterTargetTime, setTinneMasterTargetTime] = useState<number>(
    tinneMasterGetRandomTargetTime(),
  );
  const [tinneMasterRunning, setTinneMasterRunning] = useState<boolean>(false);
  const [tinneMasterScore, setTinneMasterScore] = useState<number>(0);
  const [tinneMasterClocks, setTinneMasterClocks] = useState<number>(0);
  const [tinneMasterResult, setTinneMasterResult] = useState<
    'idle' | 'awesome' | 'good' | 'not_bad' | 'lose'
  >('idle');

  const { crazysTinneVibrationEnabled: tinneMasterVibrationEnabled } =
    useTinneStore();
  const tinneMasterRunScoreRef = useRef(0);

  useEffect(() => {
    tinneMasterRunScoreRef.current = tinneMasterRunScore;
  }, [tinneMasterRunScore]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        (async () => {
          try {
            const savedMax = Number(
              (await AsyncStorage.getItem(
                TINNE_MASTER_STORE_KEYS.MAX_RUN_SCORE,
              )) || '0',
            );

            const runScore = tinneMasterRunScoreRef.current;

            if (runScore > savedMax) {
              await AsyncStorage.setItem(
                TINNE_MASTER_STORE_KEYS.MAX_RUN_SCORE,
                String(runScore),
              );
            }

            setTinneMasterRunScore(0);
          } catch (e) {
            console.log('save MAX_RUN_SCORE error', e);
          }
        })();
      };
    }, []),
  );

  useEffect(() => {
    tinneMasterSessionStartRef.current = Date.now();

    const unsubscribeTinneMaster = tinneMasterNavigation.addListener(
      'beforeRemove',
      async () => {
        const sessionTimeTinneMaster = Math.floor(
          (Date.now() - tinneMasterSessionStartRef.current) / 1000,
        );

        if (sessionTimeTinneMaster > 0) {
          await incrementNumber(
            TINNE_MASTER_STORE_KEYS.TOTAL_TIME,
            sessionTimeTinneMaster,
          );
        }
      },
    );

    return unsubscribeTinneMaster;
  }, [tinneMasterNavigation]);

  useEffect(() => {
    const tinneMasterGetSaved = async () => {
      try {
        const savedScoreTinneMaster = await getNumber(
          TINNE_MASTER_STORE_KEYS.SCORE,
        );
        const savedClocksTinneMaster = await getNumber(
          TINNE_MASTER_STORE_KEYS.CLOCKS,
        );

        setTinneMasterScore(savedScoreTinneMaster);
        setTinneMasterClocks(savedClocksTinneMaster);
      } catch (error) {
        console.error('Error (score and clocks):', error);
      }
    };

    tinneMasterGetSaved();
  }, []);

  useEffect(() => {
    if (tinneMasterRunning) {
      tinneMasterStartTimeRef.current = Date.now();
      tinneMasterTimerRef.current = setInterval(() => {
        setTinneMasterTime(Date.now() - tinneMasterStartTimeRef.current);
      }, 10);
    }

    return () =>
      tinneMasterTimerRef.current && clearInterval(tinneMasterTimerRef.current);
  }, [tinneMasterRunning]);

  const tinneMasterStartGame = () => {
    setTinneMasterTime(0);
    setTinneMasterResult('idle');

    const targTimeTinneMaster = tinneMasterGetRandomTargetTime();
    setTinneMasterTargetTime(targTimeTinneMaster);
    setTinneMasterRunning(true);
  };

  const tinneMasterStopGame = async () => {
    tinneMasterTimerRef.current && clearInterval(tinneMasterTimerRef.current);
    setTinneMasterRunning(false);

    if (tinneMasterVibrationEnabled) {
      Vibration.vibrate(500);
    }

    const diffTinneMaster = Math.abs(tinneMasterTime - tinneMasterTargetTime);

    if (diffTinneMaster <= TINNE_MASTER_RANGES.AWESOME) {
      await incrementNumber(TINNE_MASTER_STORE_KEYS.TOTAL_CATCHES, 1);

      const newScoreTinneMaster = await incrementNumber(
        TINNE_MASTER_STORE_KEYS.SCORE,
        1,
      );
      const newClocksTinneMaster = await incrementNumber(
        TINNE_MASTER_STORE_KEYS.CLOCKS,
        3,
      );

      setTinneMasterScore(newScoreTinneMaster);
      setTinneMasterClocks(newClocksTinneMaster);
      setTinneMasterRunScore(prev => prev + 1);
      setTinneMasterResult('awesome');
      return;
    }

    if (diffTinneMaster <= TINNE_MASTER_RANGES.GOOD) {
      await incrementNumber(TINNE_MASTER_STORE_KEYS.TOTAL_CATCHES, 1);
      const newScoreTinneMaster = await incrementNumber(
        TINNE_MASTER_STORE_KEYS.SCORE,
        1,
      );
      const newClocksTinneMaster = await incrementNumber(
        TINNE_MASTER_STORE_KEYS.CLOCKS,
        2,
      );

      setTinneMasterScore(newScoreTinneMaster);
      setTinneMasterClocks(newClocksTinneMaster);
      setTinneMasterResult('good');
      setTinneMasterRunScore(prev => prev + 1);
      return;
    }

    if (diffTinneMaster <= TINNE_MASTER_RANGES.NOT_BAD) {
      await incrementNumber(TINNE_MASTER_STORE_KEYS.TOTAL_CATCHES, 1);
      const newClocksTinneMaster = await incrementNumber(
        TINNE_MASTER_STORE_KEYS.CLOCKS,
        1,
      );

      setTinneMasterClocks(newClocksTinneMaster);
      setTinneMasterResult('not_bad');
      setTinneMasterRunScore(prev => prev + 1);
      return;
    }

    setTinneMasterResult('lose');
  };

  const tinneMasterFormatTime = (ms: number) => {
    const secondsTinneMaster = Math.floor(ms / 1000);
    const millisecondsTinneMaster = Math.floor((ms % 1000) / 10);

    return `00:${String(secondsTinneMaster).padStart(2, '0')}:${String(
      millisecondsTinneMaster,
    ).padStart(2, '0')}`;
  };

  const tinneMasterHeaderPadTop = tinneMasterH * 0.06;
  const tinneMasterScoreMb = tinneMasterH * 0.08;

  const tinneMasterHeaderImage =
    Platform.OS === 'ios'
      ? tinneMasterHeaderImageIOS
      : tinneMasterHeaderImageAndroid;

  const tinneMasterHeaderLogoStyle =
    Platform.OS === 'ios'
      ? tinneMasterHeaderLogoIOS
      : tinneMasterHeaderLogoAndroid;

  const NextButtonTinneMaster = () => (
    <TouchableOpacity onPress={tinneMasterStartGame} activeOpacity={0.7}>
      <LinearGradient
        colors={tinneMasterGradientColors}
        start={tinneMasterGradientStart}
        end={tinneMasterGradientEnd}
        style={tinneMasterBtn}
      >
        <Text style={tinneMasterBtnText}>Next</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={tinneMasterBgImage}
      style={tinneMasterBg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={tinneMasterScrollGrow}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[tinneMasterHeader, { paddingTop: tinneMasterHeaderPadTop }]}
        >
          <TouchableOpacity
            style={tinneMasterBackBtn}
            onPress={() => tinneMasterNavigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>

          <Image
            source={tinneMasterHeaderImage}
            style={tinneMasterHeaderLogoStyle}
          />

          <View style={tinneMasterClockRow}>
            <Image source={require('../assets/images/quantImg.png')} />
            <Text style={tinneMasterClockText}>{tinneMasterClocks}</Text>
          </View>
        </View>

        <LinearGradient
          colors={tinneMasterSheetGradientColors}
          start={tinneMasterSheetGradientStart}
          end={tinneMasterSheetGradientEnd}
          style={tinneMasterSheetGradientWrap}
        >
          <View style={tinneMasterSheet}>
            <Text style={tinneMasterScoreLabel}>Score:</Text>
            <Text
              style={[tinneMasterScr, { marginBottom: tinneMasterScoreMb }]}
            >
              {tinneMasterRunScore}
            </Text>

            {tinneMasterResult === 'idle' && (
              <>
                <Text style={tinneMasterTargetT}>
                  {tinneMasterFormatTime(tinneMasterTargetTime)}
                </Text>
                <Text style={tinneMasterTimer}>
                  {tinneMasterFormatTime(tinneMasterTime)}
                </Text>

                <TouchableOpacity
                  onPress={
                    tinneMasterRunning
                      ? tinneMasterStopGame
                      : tinneMasterStartGame
                  }
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={tinneMasterGradientColors}
                    start={tinneMasterGradientStart}
                    end={tinneMasterGradientEnd}
                    style={tinneMasterBtn}
                  >
                    <Text style={tinneMasterBtnText}>
                      {tinneMasterRunning ? 'Stop' : 'Start'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {tinneMasterResult === 'awesome' && (
              <>
                <Image
                  source={require('../assets/images/awesome.png')}
                  style={tinneMasterResultImg}
                />
                <NextButtonTinneMaster />
              </>
            )}

            {tinneMasterResult === 'good' && (
              <>
                <Image
                  source={require('../assets/images/good.png')}
                  style={tinneMasterResultImg}
                />
                <NextButtonTinneMaster />
              </>
            )}

            {tinneMasterResult === 'not_bad' && (
              <>
                <Image
                  source={require('../assets/images/not_bad.png')}
                  style={tinneMasterResultImg}
                />
                <NextButtonTinneMaster />
              </>
            )}

            {tinneMasterResult === 'lose' && (
              <>
                <Image
                  source={require('../assets/images/game_over.png')}
                  style={tinneMasterResultImg}
                />

                <View style={tinneMasterGameOverRow}>
                  <TouchableOpacity
                    onPress={() => tinneMasterNavigation.goBack()}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={tinneMasterGradientColors}
                      start={tinneMasterGradientStart}
                      end={tinneMasterGradientEnd}
                      style={tinneMasterRoundBtn}
                    >
                      <Image source={require('../assets/icons/home.png')} />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={tinneMasterStartGame}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={tinneMasterGradientColors}
                      start={tinneMasterGradientStart}
                      end={tinneMasterGradientEnd}
                      style={tinneMasterRoundBtn}
                    >
                      <Image source={require('../assets/icons/restart.png')} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

export default TapGameScreen;

const tinneMasterBg = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterHeader = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 20,
};

const tinneMasterBackBtn = {
  backgroundColor: '#100237',
  width: 70,
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#E63182',
};

const tinneMasterHeaderLogoIOS = { width: 108, height: 70 };
const tinneMasterHeaderLogoAndroid = { width: 148, height: 70 };

const tinneMasterClockRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: '#100237',
  paddingHorizontal: 12,
  paddingVertical: 14,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: '#E63182',
  justifyContent: 'center' as const,
};

const tinneMasterClockText = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: '#F9A300',
  marginLeft: 8,
};

const tinneMasterSheetGradientColors = ['#100237', '#3A0054'];
const tinneMasterSheetGradientStart = { x: 0, y: 0 };
const tinneMasterSheetGradientEnd = { x: 1, y: 0 };

const tinneMasterSheetGradientWrap = {
  flex: 1,
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  marginTop: 30,
};

const tinneMasterSheet = {
  alignItems: 'center' as const,
  paddingTop: 60,
};

const tinneMasterScoreLabel = {
  fontSize: 22,
  color: tinneMasterTextColor,
  fontWeight: '700' as const,
};

const tinneMasterScr = {
  fontSize: 64,
  color: tinneMasterTextColor,
  fontWeight: '900' as const,
};

const tinneMasterTargetT = {
  fontSize: 24,
  color: tinneMasterTextColor,
  marginBottom: 20,
};

const tinneMasterTimer = {
  fontSize: 36,
  color: tinneMasterTextColor,
  marginBottom: 40,
  fontWeight: '800' as const,
};

const tinneMasterBtn = {
  width: 260,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterBtnText = {
  color: tinneMasterWhite,
  fontSize: 22,
  fontWeight: '800' as const,
};

const tinneMasterResultImg = {
  width: 300,
  height: 180,
  resizeMode: 'contain' as const,
  marginBottom: 15,
};

const tinneMasterGameOverRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  width: 160,
  marginTop: 5,
};

const tinneMasterRoundBtn = {
  width: 70,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};
