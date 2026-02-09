import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getNumber } from '../utils/tinneTapGameUtils';
import { crazysStoriesContent } from '../TinneTapData/crazysStories';

const tinneMasterSavedKey = 'SAVED_STORIES';

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };
const tinneMasterWhite = '#FFFFFF';
const tinneMasterBgImage = require('../assets/images/app_background.png');

const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const StoryDetailsScreen = ({ route }: any) => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterScreenHeight } = useWindowDimensions();

  const tinneMasterStoryId = route?.params?.storyId;
  const tinneMasterStory = tinneMasterStoryId
    ? (crazysStoriesContent as any)[tinneMasterStoryId]
    : null;

  const [tinneMasterClocks, setTinneMasterClocks] = useState<number>(0);
  const [tinneMasterIsSaved, setTinneMasterIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const tinneMasterLoadClocks = async () => {
      try {
        const tinneMasterSavedClocks = await getNumber('TIME_CLOCKS');
        setTinneMasterClocks(tinneMasterSavedClocks);
      } catch (error) {
        console.error('Error loading clocks:', error);
      }
    };

    tinneMasterLoadClocks();
  }, []);

  useEffect(() => {
    const tinneMasterCheckSaved = async () => {
      if (!tinneMasterStoryId) return;

      try {
        const tinneMasterRaw = await AsyncStorage.getItem(tinneMasterSavedKey);
        const tinneMasterSavedStories = tinneMasterRaw
          ? JSON.parse(tinneMasterRaw)
          : [];

        setTinneMasterIsSaved(
          tinneMasterSavedStories.includes(tinneMasterStoryId),
        );
      } catch (e) {
        console.log('Check saved error', e);
      }
    };

    tinneMasterCheckSaved();
  }, [tinneMasterStoryId]);

  const tinneMasterToggleSave = async () => {
    if (!tinneMasterStoryId) return;

    try {
      const tinneMasterRaw = await AsyncStorage.getItem(tinneMasterSavedKey);
      let tinneMasterSavedStories = tinneMasterRaw
        ? JSON.parse(tinneMasterRaw)
        : [];

      if (tinneMasterIsSaved) {
        tinneMasterSavedStories = tinneMasterSavedStories.filter(
          (id: string) => id !== tinneMasterStoryId,
        );
      } else {
        tinneMasterSavedStories.push(tinneMasterStoryId);
      }

      await AsyncStorage.setItem(
        tinneMasterSavedKey,
        JSON.stringify(tinneMasterSavedStories),
      );

      setTinneMasterIsSaved(prev => !prev);
    } catch (e) {
      console.log('Toggle save error', e);
    }
  };

  const tinneMasterShareStory = async () => {
    if (!tinneMasterStory) return;

    try {
      await Share.share({
        message: `${tinneMasterStory.title}\n\n${tinneMasterStory.text}`,
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const tinneMasterHeaderImage =
    Platform.OS === 'ios'
      ? tinneMasterHeaderImageIOS
      : tinneMasterHeaderImageAndroid;

  const tinneMasterHeaderPadTop = tinneMasterScreenHeight * 0.06;

  if (!tinneMasterStory) {
    return (
      <ImageBackground
        source={tinneMasterBgImage}
        style={tinneMasterBg}
        resizeMode="cover"
      >
        <View style={[tinneMasterSheet, tinneMasterCenterJustify]}>
          <Text style={[tinneMasterTitle, tinneMasterTitleMb14]}>
            Story not found
          </Text>

          <TouchableOpacity
            style={tinneMasterBackBtn}
            onPress={() => tinneMasterNavigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={tinneMasterBackText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

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
          style={[
            tinneMasterHeaderRow,
            { paddingTop: tinneMasterHeaderPadTop },
          ]}
        >
          <TouchableOpacity
            style={tinneMasterBackBtn}
            onPress={() => tinneMasterNavigation.goBack()}
            activeOpacity={0.85}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>

          <Image
            source={tinneMasterHeaderImage}
            style={
              Platform.OS === 'ios'
                ? tinneMasterHeaderLogoIOS
                : tinneMasterHeaderLogoAndroid
            }
          />

          <View style={tinneMasterClockRow}>
            <Image source={require('../assets/images/quantImg.png')} />
            <Text style={tinneMasterClockText}>{tinneMasterClocks}</Text>
          </View>
        </View>

        <View style={tinneMasterSheet}>
          <View style={tinneMasterTextCard}>
            <LinearGradient
              colors={tinneMasterGradientColors}
              start={tinneMasterGradientStart}
              end={tinneMasterGradientEnd}
              style={tinneMasterStoryGradient}
            >
              <View style={tinneMasterStoryInnerPad}>
                <Text style={tinneMasterTitle}>{tinneMasterStory.title}</Text>
                <Text style={tinneMasterStoryText}>
                  {tinneMasterStory.text}
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={tinneMasterActionsRow}>
            <TouchableOpacity
              onPress={tinneMasterShareStory}
              activeOpacity={0.85}
              style={tinneMasterShareWrap}
            >
              <LinearGradient
                colors={tinneMasterGradientColors}
                start={tinneMasterGradientStart}
                end={tinneMasterGradientEnd}
                style={tinneMasterShareBtn}
              >
                <Text style={tinneMasterShareText}>Share the story</Text>
                <Image source={require('../assets/icons/share.png')} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={tinneMasterToggleSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  tinneMasterIsSaved
                    ? tinneMasterSavedBtnColors
                    : tinneMasterGradientColors
                }
                start={tinneMasterGradientStart}
                end={tinneMasterGradientEnd}
                style={tinneMasterSaveBtn}
              >
                <Image source={require('../assets/icons/bookmark.png')} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default StoryDetailsScreen;

const tinneMasterBg = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterHeaderRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 20,
};

const tinneMasterHeaderLogoIOS = { width: 108, height: 74 };
const tinneMasterHeaderLogoAndroid = { width: 148, height: 70 };

const tinneMasterBackBtn = {
  borderWidth: 1,
  borderColor: '#E63182',
  backgroundColor: '#100237',
  width: 70,
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterBackText = {
  color: tinneMasterWhite,
  fontWeight: '800' as const,
};

const tinneMasterClockRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#E63182',
  backgroundColor: '#100237',
  paddingHorizontal: 12,
  paddingVertical: 14,
  borderRadius: 30,
  minWidth: 100,
  justifyContent: 'center' as const,
};

const tinneMasterClockText = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: '#F9A300',
  marginLeft: 8,
};

const tinneMasterSheet = {
  flex: 1,
  backgroundColor: '#100237',
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  marginTop: 30,
  padding: 20,
};

const tinneMasterCenterJustify = {
  justifyContent: 'center' as const,
};

const tinneMasterTitle = {
  fontSize: 14,
  fontWeight: '700' as const,
  color: tinneMasterWhite,
  marginBottom: 10,
  textAlign: 'center' as const,
};

const tinneMasterTitleMb14 = { marginBottom: 14 };

const tinneMasterTextCard = { marginBottom: 20 };

const tinneMasterStoryGradient = { borderRadius: 30 };

const tinneMasterStoryInnerPad = { padding: 20 };

const tinneMasterStoryText = {
  color: tinneMasterWhite,
  fontSize: 14,
  textAlign: 'center' as const,
  fontWeight: '300' as const,
  lineHeight: 20,
};

const tinneMasterActionsRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
};

const tinneMasterShareWrap = {
  flex: 1,
  marginRight: 20,
};

const tinneMasterShareBtn = {
  flexDirection: 'row' as const,
  width: '100%',
  height: 70,
  borderRadius: 35,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterShareText = {
  color: tinneMasterWhite,
  fontSize: 20,
  fontWeight: '800' as const,
  marginRight: 10,
};

const tinneMasterSaveBtn = {
  width: 70,
  height: 70,
  borderRadius: 30,
  backgroundColor: '#100237',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#fff',
};

const tinneMasterSavedBtnColors = ['#100237', '#100237'];
