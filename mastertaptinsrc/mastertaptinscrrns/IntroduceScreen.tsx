// onboarding screen

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import React, { useState } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const tinneMasterGradientButtonColors = ['#EA3385', '#A61154'];
const tinneMasterMainWhite = '#FFFFFF';
const tinneMasterGradStart = { x: 0, y: 0 };
const tinneMasterGradEnd = { x: 1, y: 1 };
const tinneMasterSemiBoldFont = 'Nunito-SemiBold';
const tinneMasterBackgroundImage = require('../assets/images/app_background.png');

const tinneMasterOnboardingSlides = [
  {
    id: 'slide_1',
    tinneMasterTitle: 'Master the Perfect Second',
    tinneMasterDescription:
      'Stop the timer as close as possible to the target moment.\nPrecision matters — every millisecond counts.',
    tinneMasterButtonLabel: 'Next',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
  {
    id: 'slide_2',
    tinneMasterTitle: 'Perfect Timing = Rewards',
    tinneMasterDescription:
      'The more accurate your tap, the more Time Clocks you earn.',
    tinneMasterButtonLabel: 'Got it',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
  {
    id: 'slide_3',
    tinneMasterTitle: 'Unlock Stories & Wallpapers',
    tinneMasterDescription:
      'Spend Time Clocks to unlock short stories and exclusive phone wallpapers.',
    tinneMasterButtonLabel: 'Sounds Cool',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
  {
    id: 'slide_4',
    tinneMasterTitle: 'Make It Your Way',
    tinneMasterDescription:
      'Turn music and vibration on or off, and track your total progress in settings.',
    tinneMasterButtonLabel: 'Start',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
];

export default function IntroduceScreen() {
  const tinneMasterNavigation = useNavigation<any>();

  const [tinneMasterMode, setTinneMasterMode] = useState<
    'intro' | 'onboarding'
  >('intro');
  const [tinneMasterWelcomeIdx, setTinneMasterWelcomeIdx] = useState<number>(0);

  const { width: tinneMasterW, height: tinneMasterH } = useWindowDimensions();
  const tinneMasterIsLandMode = tinneMasterW > tinneMasterH;

  const tinneMasterGoNext = () => {
    if (tinneMasterWelcomeIdx < tinneMasterOnboardingSlides.length - 1) {
      setTinneMasterWelcomeIdx(tinneMasterWelcomeIdx + 1);
    } else {
      tinneMasterHandleStart();
    }
  };

  const tinneMasterHandleStart = async () => {
    try {
      const storedProfileTinneMaster = await AsyncStorage.getItem(
        'userProfile',
      );

      if (storedProfileTinneMaster) {
        tinneMasterNavigation.replace('TinneTapHome');
      } else {
        tinneMasterNavigation.replace('TinneTapHome');
      }
    } catch (error) {
      console.error('Error during start navigation:', error);
      tinneMasterNavigation.replace('TinneTapHome');
    }
  };

  const tinneMasterCurrentSlide =
    tinneMasterOnboardingSlides[tinneMasterWelcomeIdx];

  return (
    <ImageBackground
      source={tinneMasterBackgroundImage}
      style={tinneMasterBg}
      resizeMode="cover"
    >
      <View
        style={[
          tinneMasterPage,
          { width: tinneMasterW },
          tinneMasterIsLandMode && tinneMasterPageLandscape,
        ]}
      >
        <Image source={tinneMasterCurrentSlide.image} />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#100237',
            paddingVertical: 10,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            minHeight: 410,
            paddingVertical: 40,
            marginTop: 60,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={tinneMasterTitleText}>
              {tinneMasterCurrentSlide.tinneMasterTitle}
            </Text>
            <Text style={tinneMasterDescText}>
              {tinneMasterCurrentSlide.tinneMasterDescription}
            </Text>
          </View>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={tinneMasterBtn}
              onPress={tinneMasterGoNext}
            >
              <LinearGradient
                colors={tinneMasterGradientButtonColors}
                style={tinneMasterBtnGradient}
                start={tinneMasterGradStart}
                end={tinneMasterGradEnd}
              >
                <Text style={tinneMasterBtnText}>
                  {tinneMasterCurrentSlide.tinneMasterButtonLabel}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={[tinneMasterPagination]}>
              {tinneMasterOnboardingSlides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    tinneMasterDot,
                    tinneMasterWelcomeIdx >= index && tinneMasterDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const tinneMasterBg = { flex: 1 };

const tinneMasterPagination = {
  alignSelf: 'center' as const,
  flexDirection: 'row' as const,
  zIndex: 10,
};

const tinneMasterDot = {
  width: 20,
  height: 20,
  borderRadius: 50,
  backgroundColor: tinneMasterMainWhite,
  marginHorizontal: 4,
  opacity: 0.3,
};

const tinneMasterDotActive = {
  backgroundColor: '#EA3385',
  opacity: 1,
};

const tinneMasterPage = {
  flex: 1,
  justifyContent: 'flex-end' as const,
  alignItems: 'center' as const,
};

const tinneMasterPageLandscape = {
  flexDirection: 'row' as const,
  justifyContent: 'space-around' as const,
};

const tinneMasterTitleText = {
  color: tinneMasterMainWhite,
  fontSize: 22,
  fontFamily: tinneMasterSemiBoldFont,
  textAlign: 'center' as const,
  maxWidth: 300,
  fontWeight: '900' as const,
  marginBottom: 20,
};

const tinneMasterDescText = {
  color: '#A61154',
  fontSize: 20,
  fontFamily: tinneMasterSemiBoldFont,
  textAlign: 'center' as const,
  marginTop: 21,
  maxWidth: 300,
  fontWeight: '500' as const,
  marginBottom: 50,
  paddingHorizontal: 20,
};

const tinneMasterBtn = {
  width: '100%',
  maxWidth: 250,
  marginBottom: 20,
};

const tinneMasterBtnGradient = {
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterBtnText = {
  color: tinneMasterMainWhite,
  fontSize: 22,
  fontWeight: '700' as const,
};

const tinneMasterButtonWrap = {
  justifyContent: 'flex-end' as const,
  marginBottom: 40,
  width: '100%',
  alignItems: 'center' as const,
};

const tinneMasterSlideImage = {
  width: 350,
  height: 350,
};
