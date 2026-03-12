// settings screen
import { getNumber } from '../utils/tinneTapGameUtils';

import { useTinneStore } from '../mastertaptinstorage/tinneContext';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tinneMasterStoreKeys = {
  TOTAL_CATCHES: 'TOTAL_CATCHES',
  TOTAL_TIME: 'TOTAL_TIME',
};

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };

const tinneMasterWhite = '#A61154';
const tinneMasterBgImage = require('../assets/images/app_background.png');

const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const TinneSettings = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterH } = useWindowDimensions();

  const [tinneMasterCatches, setTinneMasterCatches] = useState<number>(0);
  const [tinneMasterTimeSpent, setTinneMasterTimeSpent] = useState<number>(0);

  const {
    crazysTinneVibrationEnabled: tinneMasterVibrationEnabled,
    setCrazysTinneVibrationEnabled: setTinneMasterVibrationEnabled,
    crazysTinneMusicEnabled: tinneMasterMusicEnabled,
    setCrazysTinneMusicEnabled: setTinneMasterMusicEnabled,
  } = useTinneStore();

  useFocusEffect(
    useCallback(() => {
      const tinneMasterLoadStats = async () => {
        try {
          const totalCatchesTinneMaster = await getNumber(
            tinneMasterStoreKeys.TOTAL_CATCHES,
          );
          const totalTimeTinneMaster = await getNumber(
            tinneMasterStoreKeys.TOTAL_TIME,
          );

          setTinneMasterCatches(totalCatchesTinneMaster);
          setTinneMasterTimeSpent(totalTimeTinneMaster);
        } catch (error) {
          console.error('Error stats :( ', error);
        }
      };

      tinneMasterLoadStats();
    }, []),
  );

  const tinneMasterFormattedTime = (seconds: number) => {
    const hoursTinneMaster = Math.floor(seconds / 3600);
    const minutesTinneMaster = Math.floor((seconds % 3600) / 60);
    return `${hoursTinneMaster}h ${minutesTinneMaster}m`;
  };

  const tinneMasterShareApp = async () => {
    Linking.openURL(
      'https://apps.apple.com/us/app/chazytimes-tap-master/id6759247123',
    );
  };

  const tinneMasterToggleSound = async (selectedValue: boolean) => {
    try {
      await AsyncStorage.setItem(
        'toggleTapMasterMusic',
        JSON.stringify(selectedValue),
      );
      setTinneMasterMusicEnabled(selectedValue);
    } catch (error) {
      console.log('Error mus', error);
    }
  };

  const tinneMasterToggleVibration = async (selectedValue: boolean) => {
    try {
      await AsyncStorage.setItem(
        'toggleTapMasterVibration',
        JSON.stringify(selectedValue),
      );
      setTinneMasterVibrationEnabled(selectedValue);
    } catch (error) {
      console.log('Error vib', error);
    }
  };

  const tinneMasterHeaderPadTop = tinneMasterH * 0.06;

  const tinneMasterHeaderImage =
    Platform.OS === 'ios'
      ? tinneMasterHeaderImageIOS
      : tinneMasterHeaderImageAndroid;

  const tinneMasterHeaderLogoStyle =
    Platform.OS === 'ios'
      ? tinneMasterHeaderLogoIOS
      : tinneMasterHeaderLogoAndroid;

  return (
    <ImageBackground
      source={tinneMasterBgImage}
      style={tinneMasterBg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={tinneMasterScrollGrow}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={[tinneMasterTopWrap, { paddingTop: tinneMasterHeaderPadTop }]}
        >
          <TouchableOpacity
            style={[tinneMasterBackBtn]}
            onPress={() => tinneMasterNavigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>
        </View>

        <View style={tinneMasterSheetGradientWrap}>
          {Platform.OS === 'ios' && (
            <View style={tinneMasterSettRow}>
              <Text style={tinneMasterRowText}>Music</Text>
              <TouchableOpacity
                onPress={() => tinneMasterToggleSound(!tinneMasterMusicEnabled)}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    tinneMasterMusicEnabled
                      ? require('../assets/images/switchon.png')
                      : require('../assets/images/switchoff.png')
                  }
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={tinneMasterDivider} />

          <View style={tinneMasterSettRow}>
            <Text style={tinneMasterRowText}>Vibration</Text>
            <TouchableOpacity
              onPress={() =>
                tinneMasterToggleVibration(!tinneMasterVibrationEnabled)
              }
              activeOpacity={0.7}
            >
              <Image
                source={
                  tinneMasterVibrationEnabled
                    ? require('../assets/images/switchon.png')
                    : require('../assets/images/switchoff.png')
                }
              />
            </TouchableOpacity>
          </View>

          <View style={tinneMasterDivider} />

          <Text style={tinneMasterSectionTitle}>Statistics</Text>

          <Text style={tinneMasterStatLabel}>
            How many times was time caught:
          </Text>
          <Text style={tinneMasterStatValue}>{tinneMasterCatches}</Text>

          <View style={tinneMasterDivider} />

          <Text style={tinneMasterStatLabel}>
            How much time was spent in the game
          </Text>
          <Text style={tinneMasterStatValue}>
            {tinneMasterFormattedTime(tinneMasterTimeSpent)}
          </Text>

          {Platform.OS === 'ios' && (
            <View style={tinneMasterBottomBar}>
              <TouchableOpacity
                onPress={tinneMasterShareApp}
                activeOpacity={0.85}
                style={tinneMasterFullWidth}
              >
                <LinearGradient
                  colors={tinneMasterGradientColors}
                  start={tinneMasterGradientStart}
                  end={tinneMasterGradientEnd}
                  style={tinneMasterShareButton}
                >
                  <Text style={tinneMasterShareText}>Share the app</Text>
                  <Image source={require('../assets/icons/share.png')} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default TinneSettings;

const tinneMasterBg = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterTopWrap = {
  alignItems: 'flex-start' as const,
  paddingHorizontal: 20,
};

const tinneMasterBackBtn = {
  width: 70,
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#E63182',
  backgroundColor: '#100237',
};

const tinneMasterHeaderLogoIOS = {
  width: 108,
  height: 70,
  resizeMode: 'contain' as const,
};
const tinneMasterHeaderLogoAndroid = {
  width: 148,
  height: 70,
  resizeMode: 'contain' as const,
};

const tinneMasterSheetGradientWrap = {
  flex: 1,
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  marginTop: 30,
  padding: 30,
  backgroundColor: '#100237',
};

const tinneMasterSettRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
};

const tinneMasterRowText = {
  fontSize: 24,
  fontWeight: '600' as const,
  color: tinneMasterWhite,
};

const tinneMasterDivider = {
  height: 1,
  backgroundColor: tinneMasterWhite,
  marginVertical: 20,
};

const tinneMasterSectionTitle = {
  fontSize: 24,
  fontWeight: '800' as const,
  color: tinneMasterWhite,
  textAlign: 'center' as const,
  marginVertical: 20,
};

const tinneMasterStatLabel = {
  fontSize: 16,
  color: tinneMasterWhite,
  textAlign: 'center' as const,
  fontWeight: '600' as const,
};

const tinneMasterStatValue = {
  fontSize: 32,
  fontWeight: '700' as const,
  color: tinneMasterWhite,
  textAlign: 'center' as const,
  marginVertical: 10,
};

const tinneMasterBottomBar = {
  alignItems: 'center' as const,
  flex: 1,
  justifyContent: 'flex-end' as const,
  marginTop: 30,
};

const tinneMasterShareButton = {
  flexDirection: 'row' as const,
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  width: '100%',
};

const tinneMasterShareText = {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: '800' as const,
  marginRight: 10,
};

const tinneMasterFullWidth = { width: '100%' };
