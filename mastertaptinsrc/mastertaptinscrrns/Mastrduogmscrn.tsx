// duo game screen

import { useTinneStore } from '../mastertaptinstorage/tinneContext';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const DUO_GRADIENT_COLORS = ['#EA3385', '#A61154'];
const DUO_GRADIENT_START = { x: 0, y: 0 };
const DUO_GRADIENT_END = { x: 1, y: 0 };
const DUO_TEXT_COLOR = '#A61154';
const DUO_WHITE = '#FFFFFF';

const DUO_BG_IMAGE = require('../assets/images/app_background.png');

const getRandomTargetMs = () => {
  const sec = 5 + Math.floor(Math.random() * 9);
  return sec * 1000;
};

const DUO_RANGES = {
  AWESOME: 150,
  GOOD: 300,
  NOT_BAD: 600,
};

type DuoResult = 'idle' | 'awesome' | 'good' | 'not_bad' | 'lose';

const formatTime = (ms: number) => {
  const sec = Math.floor(ms / 1000);
  const cent = Math.floor((ms % 1000) / 10);
  return `00:${String(sec).padStart(2, '0')}:${String(cent).padStart(2, '0')}`;
};

const Mastrduogmscrn = () => {
  const navigation = useNavigation<any>();
  const { height: screenH } = useWindowDimensions();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const store = useTinneStore() as
    | { crazysTinneVibrationEnabled?: boolean }
    | undefined;
  const vibrationEnabled = store?.crazysTinneVibrationEnabled ?? false;

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2 | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result1, setResult1] = useState<DuoResult>('idle');
  const [result2, setResult2] = useState<DuoResult>('idle');
  const [matchOver, setMatchOver] = useState(false);
  const [turn, setTurn] = useState<1 | 2>(1);

  const player1HasTriedRef = useRef(false);
  const player2HasTriedRef = useRef(false);
  const someoneGotLoseRef = useRef(false);
  const alertShownRef = useRef(false);

  const [targetTime1, setTargetTime1] = useState(getRandomTargetMs);
  const [targetTime2, setTargetTime2] = useState(getRandomTargetMs);

  const checkMatchOver = useCallback(() => {
    if (
      someoneGotLoseRef.current &&
      player1HasTriedRef.current &&
      player2HasTriedRef.current
    ) {
      setMatchOver(true);
    }
  }, []);

  const resetMatch = useCallback(() => {
    alertShownRef.current = false;
    setMatchOver(false);
    setTurn(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setResult1('idle');
    setResult2('idle');
    setActivePlayer(null);
    setElapsedMs(0);
    setTargetTime1(getRandomTargetMs());
    setTargetTime2(getRandomTargetMs());
    player1HasTriedRef.current = false;
    player2HasTriedRef.current = false;
    someoneGotLoseRef.current = false;
  }, []);

  const matchOverMessage =
    player1Score > player2Score
      ? 'Player 1 wins'
      : player2Score > player1Score
      ? 'Player 2 wins'
      : 'Match Over';

  useEffect(() => {
    if (!matchOver || alertShownRef.current) return;
    alertShownRef.current = true;
    Alert.alert(matchOverMessage, undefined, [
      { text: 'Back', onPress: () => navigation.goBack() },
      { text: 'Restart', onPress: resetMatch },
    ]);
  }, [matchOver, matchOverMessage, resetMatch, navigation]);

  useEffect(() => {
    if (activePlayer === null) return;
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 10);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [activePlayer]);

  const stopPlayer = useCallback(
    (player: 1 | 2) => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setActivePlayer(null);

      if (vibrationEnabled) Vibration.vibrate(500);

      const target = player === 1 ? targetTime1 : targetTime2;
      const diff = Math.abs(elapsedMs - target);

      if (diff <= DUO_RANGES.AWESOME) {
        if (player === 1) {
          setPlayer1Score(s => s + 1);
          setResult1('awesome');
        } else {
          setPlayer2Score(s => s + 1);
          setResult2('awesome');
        }
        setTurn(player === 1 ? 2 : 1);
        checkMatchOver();
        return;
      }
      if (diff <= DUO_RANGES.GOOD) {
        if (player === 1) {
          setPlayer1Score(s => s + 1);
          setResult1('good');
        } else {
          setPlayer2Score(s => s + 1);
          setResult2('good');
        }
        setTurn(player === 1 ? 2 : 1);
        checkMatchOver();
        return;
      }
      if (diff <= DUO_RANGES.NOT_BAD) {
        if (player === 1) setResult1('not_bad');
        else setResult2('not_bad');
        setTurn(player === 1 ? 2 : 1);
        checkMatchOver();
        return;
      }
      if (player === 1) {
        setResult1('lose');
        someoneGotLoseRef.current = true;
      } else {
        setResult2('lose');
        someoneGotLoseRef.current = true;
      }
      setTurn(player === 1 ? 2 : 1);
      checkMatchOver();
    },
    [elapsedMs, targetTime1, targetTime2, vibrationEnabled, checkMatchOver],
  );

  const startPlayer = useCallback((player: 1 | 2) => {
    if (player === 1) {
      player1HasTriedRef.current = true;
      setResult1('idle');
    } else {
      player2HasTriedRef.current = true;
      setResult2('idle');
    }
    setActivePlayer(player);
  }, []);

  const renderPlayerCard = (
    player: 1 | 2,
    score: number,
    result: DuoResult,
    targetMs: number,
  ) => {
    const showTimer = activePlayer === player;
    const showStop = activePlayer === player;
    const showStart = !showStop;

    return (
      <View key={player} style={styles.card}>
        <Text style={styles.cardTitle}>Player {player} Score:</Text>
        <Text style={styles.scoreValue}>{score}</Text>

        {result !== 'idle' && !showStop && (
          <>
            {result === 'awesome' && (
              <Image
                source={require('../assets/images/awesome.png')}
                style={styles.resultImage}
                resizeMode="contain"
              />
            )}
            {result === 'good' && (
              <Image
                source={require('../assets/images/good.png')}
                style={styles.resultImage}
                resizeMode="contain"
              />
            )}
            {result === 'not_bad' && (
              <Image
                source={require('../assets/images/not_bad.png')}
                style={styles.resultImage}
                resizeMode="contain"
              />
            )}
            {result === 'lose' && (
              <Image
                source={require('../assets/images/game_over.png')}
                style={styles.resultImage}
                resizeMode="contain"
              />
            )}
          </>
        )}

        {result === 'idle' || showTimer ? (
          <>
            <Text style={styles.targetLabel}>Target time</Text>
            <Text style={styles.targetValue}>{formatTime(targetMs)}</Text>
            {showTimer && (
              <Text style={styles.timerText}>{formatTime(elapsedMs)}</Text>
            )}
          </>
        ) : null}

        {showStart && !matchOver && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => startPlayer(player)}
            disabled={activePlayer !== null || turn !== player}
            style={[
              styles.btnWrap,
              (activePlayer !== null || turn !== player) && styles.btnDisabled,
            ]}
          >
            <LinearGradient
              colors={DUO_GRADIENT_COLORS}
              start={DUO_GRADIENT_START}
              end={DUO_GRADIENT_END}
              style={styles.mainButton}
            >
              <Text style={styles.mainButtonText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {showStop && !matchOver && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => stopPlayer(player)}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={DUO_GRADIENT_COLORS}
              start={DUO_GRADIENT_START}
              end={DUO_GRADIENT_END}
              style={styles.mainButton}
            >
              <Text style={styles.mainButtonText}>Stop</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const padTop = screenH * 0.05;

  return (
    <ImageBackground source={DUO_BG_IMAGE} style={styles.bg} resizeMode="cover">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: padTop }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsWrap}>
          {renderPlayerCard(1, player1Score, result1, targetTime1)}
          {renderPlayerCard(2, player2Score, result2, targetTime2)}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Mastrduogmscrn;

const styles = {
  bg: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#100237',
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#E63182',
  },
  matchOverWrap: {
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  matchOverText: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: DUO_TEXT_COLOR,
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  restartBtnWrap: {
    width: 200,
    alignSelf: 'center' as const,
  },
  restartButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  cardsWrap: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#100237',
    borderRadius: 50,

    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
    marginBottom: 20,
    minHeight: 335,
    justifyContent: 'center' as const,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: DUO_TEXT_COLOR,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: '800' as const,
    color: DUO_TEXT_COLOR,
    marginBottom: 16,
  },
  targetLabel: {
    fontSize: 16,
    color: '#A61154',
    marginBottom: 4,
    fontweight: '200' as const,
  },
  targetValue: {
    fontSize: 22,
    color: '#A61154',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: DUO_TEXT_COLOR,
    marginBottom: 24,
  },
  resultImage: {
    width: 230,
    height: 135,
    marginBottom: 20,
  },
  btnWrap: {
    width: 280,
    alignSelf: 'center' as const,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  mainButton: {
    height: 50,
    borderRadius: 30,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  mainButtonText: {
    color: DUO_WHITE,
    fontSize: 20,
    fontWeight: '800' as const,
  },
};
