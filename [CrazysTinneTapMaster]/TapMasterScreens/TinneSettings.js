import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getNumber } from '../utils/tinneTapGameUtils';
import { useTinneStore } from '../MasterStore/tinneContext';

const STORE_KEYS = {
  TOTAL_CATCHES: 'TOTAL_CATCHES',
  TOTAL_TIME: 'TOTAL_TIME',
};

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const textColor = '#A61154';
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const TinneSettings = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const [catches, setCatches] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const {
    crazysTinneVibrationEnabled,
    setCrazysTinneVibrationEnabled,
    crazysTinneMusicEnabled,
    setCrazysTinneMusicEnabled,
  } = useTinneStore();

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          const totalCatches = await getNumber(STORE_KEYS.TOTAL_CATCHES);
          const totalTime = await getNumber(STORE_KEYS.TOTAL_TIME);

          setCatches(totalCatches);
          setTimeSpent(totalTime);
        } catch (error) {
          console.error('Error stats :( ', error);
        }
      };

      loadStats();
    }, []),
  );

  const formattedTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  const shareApp = async () => {
    Linking.openURL('');
  };

  const toggleSound = async selectedValue => {
    try {
      await AsyncStorage.setItem(
        'toggleTapMasterMusic',
        JSON.stringify(selectedValue),
      );

      setCrazysTinneMusicEnabled(selectedValue);
    } catch (error) {
      console.log('Error mus', error);
    }
  };

  const toggleVibration = async selectedValue => {
    try {
      await AsyncStorage.setItem(
        'toggleTapMasterVibration',
        JSON.stringify(selectedValue),
      );

      setCrazysTinneVibrationEnabled(selectedValue);
    } catch (error) {
      console.log('Error vib', error);
    }
  };

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={{
            alignItems: 'center',
            paddingTop: height * 0.06,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={[styles.backBtn, { top: height * 0.06 }]}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>

          <Image
            source={require('../assets/images/loader_icon.png')}
            style={{ width: 108, height: 70, alignSelf: 'center' }}
          />
        </View>

        <View style={styles.sheet}>
          {Platform.OS === 'ios' && (
            <View style={styles.settWrapper}>
              <Text style={styles.rowText}>Music</Text>
              <TouchableOpacity
                onPress={() => toggleSound(!crazysTinneMusicEnabled)}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    crazysTinneMusicEnabled
                      ? require('../assets/images/switchon.png')
                      : require('../assets/images/switchoff.png')
                  }
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.settWrapper}>
            <Text style={styles.rowText}>Vibration</Text>
            <TouchableOpacity
              onPress={() => toggleVibration(!crazysTinneVibrationEnabled)}
              activeOpacity={0.7}
            >
              <Image
                source={
                  crazysTinneVibrationEnabled
                    ? require('../assets/images/switchon.png')
                    : require('../assets/images/switchoff.png')
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Statistics</Text>

          <Text style={styles.statLabel}>How many times was time caught:</Text>
          <Text style={styles.statValue}>{catches}</Text>

          <View style={styles.divider} />

          <Text style={styles.statLabel}>
            How much time was spent in the game
          </Text>
          <Text style={styles.statValue}>{formattedTime(timeSpent)}</Text>
        </View>

        {Platform.OS === 'ios' && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={shareApp}
              activeOpacity={0.85}
              style={{ width: '90%' }}
            >
              <LinearGradient
                colors={gradientColors}
                start={gradientXY}
                end={gradientXYEnd}
                style={styles.shareButton}
              >
                <Text style={styles.shareText}>Share the app</Text>
                <Image source={require('../assets/icons/share.png')} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    backgroundColor: mainWhite,
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  sheet: {
    flex: 1,
    backgroundColor: mainWhite,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    padding: 30,
  },
  settWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 24,
    fontWeight: '600',
    color: textColor,
  },
  divider: {
    height: 1,
    backgroundColor: textColor,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: textColor,
    textAlign: 'center',
    marginVertical: 20,
  },
  statLabel: {
    fontSize: 16,
    color: textColor,
    textAlign: 'center',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: textColor,
    textAlign: 'center',
    marginVertical: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    gap: 10,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    color: mainWhite,
    fontSize: 20,
    fontWeight: '800',
  },
});

export default TinneSettings;
