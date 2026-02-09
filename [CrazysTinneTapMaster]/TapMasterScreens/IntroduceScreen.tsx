import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
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
    tinneMasterTitle: 'Timing Is a Skill',
    tinneMasterDescription:
      'Tap too early or too late and your score drops.\nHit the perfect moment to build streaks and boost your result.',
    tinneMasterButtonLabel: 'Got it',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
  {
    id: 'slide_3',
    tinneMasterTitle: 'Progress Through Precision',
    tinneMasterDescription:
      'Improve your accuracy, increase your score,\nand unlock new challenges and visual rewards as you play.',
    tinneMasterButtonLabel: 'Sounds Cool',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
  {
    id: 'slide_4',
    tinneMasterTitle: 'Play. Improve. Repeat.',
    tinneMasterDescription:
      'Short sessions, increasing difficulty,\nand clear performance feedback after every round.',
    tinneMasterButtonLabel: 'Start Playing',
    image:
      Platform.OS === 'ios'
        ? require('../assets/images/loader_icon.png')
        : require('../assets/images/loadericon.png'),
  },
];

export default function IntroduceScreen() {
  const tinneMasterNavigation = useNavigation<any>();
  const tinneMasterSlideRef = useRef<FlatList>(null);

  const [tinneMasterMode, setTinneMasterMode] = useState<
    'intro' | 'onboarding'
  >('intro');
  const [tinneMasterWelcomeIdx, setTinneMasterWelcomeIdx] = useState<number>(0);

  const { width: tinneMasterW, height: tinneMasterH } = useWindowDimensions();
  const tinneMasterIsLandMode = tinneMasterW > tinneMasterH;

  const tinneMasterHandleSlideSwipe = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentIndex = Math.round(contentOffset.x / tinneMasterW);
    setTinneMasterWelcomeIdx(currentIndex);
  };

  const tinneMasterHandleStart = async () => {
    try {
      const storedProfileTinneMaster = await AsyncStorage.getItem(
        'userProfile',
      );

      if (storedProfileTinneMaster) {
        tinneMasterNavigation.replace('TinneTapHome');
      } else {
        tinneMasterNavigation.replace('RegistrationScreen');
      }
    } catch (error) {
      console.error('Error during start navigation:', error);
      tinneMasterNavigation.replace('TinneTapHome');
    }
  };

  if (tinneMasterMode === 'intro') {
    return (
      <ImageBackground
        source={tinneMasterBackgroundImage}
        style={tinneMasterBg}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={tinneMasterScrollGrow}
          showsVerticalScrollIndicator={false}
        >
          <View style={tinneMasterIntroWrapper}>
            <View style={tinneMasterIntroContainer}>
              <Text
                style={[
                  tinneMasterTitleText,
                  { marginBottom: tinneMasterH * 0.07 },
                ]}
              >
                Use swipes to view onboarding
              </Text>
              <Image source={require('../assets/images/scroll.png')} />
            </View>

            <View style={tinneMasterButtonWrap}>
              <TouchableOpacity
                style={tinneMasterBtn}
                onPress={() => setTinneMasterMode('onboarding')}
              >
                <LinearGradient
                  colors={tinneMasterGradientButtonColors}
                  style={tinneMasterBtnGradient}
                  start={tinneMasterGradStart}
                  end={tinneMasterGradEnd}
                >
                  <Text style={tinneMasterBtnText}>Good</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  const tinneMasterOnboardSlide = ({
    item,
    index: slideIndex,
  }: {
    item: (typeof tinneMasterOnboardingSlides)[number];
    index: number;
  }) => {
    const isLastSlide = slideIndex === tinneMasterOnboardingSlides.length - 1;

    return (
      <View
        style={[
          tinneMasterPage,
          { width: tinneMasterW },
          tinneMasterIsLandMode && tinneMasterPageLandscape,
        ]}
      >
        <View>
          <Text style={tinneMasterTitleText}>{item.tinneMasterTitle}</Text>
          <Text style={tinneMasterDescText}>{item.tinneMasterDescription}</Text>
        </View>

        <Image
          source={item.image}
          resizeMode="contain"
          style={tinneMasterSlideImage}
        />

        {isLastSlide && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={tinneMasterBtn}
            onPress={tinneMasterHandleStart}
          >
            <LinearGradient
              colors={tinneMasterGradientButtonColors}
              style={tinneMasterBtnGradient}
              start={tinneMasterGradStart}
              end={tinneMasterGradEnd}
            >
              <Text style={tinneMasterBtnText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={tinneMasterBackgroundImage}
      style={tinneMasterBg}
      resizeMode="cover"
    >
      <View style={[tinneMasterPagination, { top: tinneMasterH * 0.08 }]}>
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

      <FlatList
        ref={tinneMasterSlideRef}
        data={tinneMasterOnboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={tinneMasterHandleSlideSwipe}
        keyExtractor={item => item.id}
        renderItem={tinneMasterOnboardSlide}
      />
    </ImageBackground>
  );
}

const tinneMasterBg = { flex: 1 };

const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterIntroWrapper = { flex: 1 };

const tinneMasterIntroContainer = {
  flex: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const tinneMasterPagination = {
  position: 'absolute' as const,
  alignSelf: 'center' as const,
  flexDirection: 'row' as const,
  zIndex: 10,
};

const tinneMasterDot = {
  width: 46,
  height: 7,
  borderRadius: 2,
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
  paddingTop: 120,
  paddingBottom: 140,
  paddingHorizontal: 24,
  justifyContent: 'space-between' as const,
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
  fontWeight: '700' as const,
};

const tinneMasterDescText = {
  color: tinneMasterMainWhite,
  fontSize: 18,
  fontFamily: tinneMasterSemiBoldFont,
  textAlign: 'center' as const,
  marginTop: 20,
  maxWidth: 300,
  fontWeight: '500' as const,
};

const tinneMasterBtn = {
  width: '100%',
  maxWidth: 250,
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
