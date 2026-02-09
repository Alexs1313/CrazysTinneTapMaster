import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getNumber,
  getArray,
  setArray,
  spendClocks,
} from '../utils/tinneTapGameUtils';
import { crazysStories } from '../TinneTapData/crazysStories';

const tinneMasterStoreKeys = {
  CLOCKS: 'TIME_CLOCKS',
  UNLOCKED_STORIES: 'UNLOCKED_STORIES',
  SAVED_STORIES: 'SAVED_STORIES',
};

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };
const tinneMasterWhite = '#FFFFFF';
const tinneMasterBgImage = require('../assets/images/app_background.png');

const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const TapMasterStories = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterH } = useWindowDimensions();

  const [tinneMasterClocks, setTinneMasterClocks] = useState<number>(0);
  const [tinneMasterUnlockedStories, setTinneMasterUnlockedStories] = useState<
    string[]
  >([]);
  const [tinneMasterSavedStories, setTinneMasterSavedStories] = useState<
    string[]
  >([]);
  const [tinneMasterSelectedStory, setTinneMasterSelectedStory] = useState<
    string | null
  >(null);
  const [tinneMasterTab, setTinneMasterTab] = useState<'all' | 'saved'>('all');

  useFocusEffect(
    useCallback(() => {
      const tinneMasterLoadData = async () => {
        try {
          const savedClocksTinneMaster = await getNumber(
            tinneMasterStoreKeys.CLOCKS,
          );
          const unlockedTinneMaster = await getArray(
            tinneMasterStoreKeys.UNLOCKED_STORIES,
          );
          const savedRawTinneMaster = await AsyncStorage.getItem(
            tinneMasterStoreKeys.SAVED_STORIES,
          );

          const unlockedInitTinneMaster = unlockedTinneMaster.includes(
            'story_1',
          )
            ? unlockedTinneMaster
            : ['story_1', ...unlockedTinneMaster];

          setTinneMasterClocks(savedClocksTinneMaster);
          setTinneMasterUnlockedStories(unlockedInitTinneMaster);
          setTinneMasterSavedStories(
            savedRawTinneMaster ? JSON.parse(savedRawTinneMaster) : [],
          );

          await setArray(
            tinneMasterStoreKeys.UNLOCKED_STORIES,
            unlockedInitTinneMaster,
          );
        } catch (e) {
          console.log('Load error', e);
        }
      };

      tinneMasterLoadData();
    }, []),
  );

  const tinneMasterOnStoryPress = (story: any) => {
    if (tinneMasterUnlockedStories.includes(story.id)) {
      tinneMasterNavigation.navigate('StoryDetailsScreen', {
        storyId: story.id,
      });
      return;
    }

    setTinneMasterSelectedStory(story.id);
  };

  const tinneMasterUnlockSelectedStory = async () => {
    if (!tinneMasterSelectedStory) return;

    const newClocksTinneMaster = await spendClocks(10);
    if (newClocksTinneMaster === false) {
      Alert.alert('Not enough Clocks', 'You need 10 clocks.');
      return;
    }

    const updatedTinneMaster = [
      ...tinneMasterUnlockedStories,
      tinneMasterSelectedStory,
    ];
    await setArray(tinneMasterStoreKeys.UNLOCKED_STORIES, updatedTinneMaster);

    setTinneMasterUnlockedStories(updatedTinneMaster);
    setTinneMasterClocks(newClocksTinneMaster);
    setTinneMasterSelectedStory(null);
  };

  const tinneMasterVisibleStories =
    tinneMasterTab === 'all'
      ? crazysStories
      : crazysStories.filter(story =>
          tinneMasterSavedStories.includes(story.id),
        );

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
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={tinneMasterScrollGrow}
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

        <View style={tinneMasterSheet}>
          <View style={tinneMasterTabs}>
            <TouchableOpacity
              onPress={() => setTinneMasterTab('all')}
              style={[
                tinneMasterTabBtn,
                tinneMasterTab === 'all' && tinneMasterTabActive,
              ]}
              activeOpacity={0.85}
            >
              <Text style={tinneMasterTabText}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTinneMasterTab('saved')}
              style={[
                tinneMasterTabBtn,
                tinneMasterTab === 'saved' && tinneMasterTabActive,
              ]}
              activeOpacity={0.85}
            >
              <Text style={tinneMasterTabText}>Saved</Text>
            </TouchableOpacity>
          </View>

          {tinneMasterVisibleStories.map(story => {
            const unlockedTinneMaster = tinneMasterUnlockedStories.includes(
              story.id,
            );
            const selectedTinneMaster = tinneMasterSelectedStory === story.id;

            return (
              <TouchableOpacity
                key={story.id}
                activeOpacity={0.85}
                onPress={() => tinneMasterOnStoryPress(story)}
              >
                <LinearGradient
                  style={[
                    tinneMasterStoryCard,
                    selectedTinneMaster && tinneMasterStorySelected,
                  ]}
                  start={tinneMasterGradientStart}
                  end={tinneMasterGradientEnd}
                  colors={
                    unlockedTinneMaster
                      ? tinneMasterGradientColors
                      : tinneMasterLockedColors
                  }
                >
                  <View style={tinneMasterStoryPad}>
                    <Text style={tinneMasterStoryTitle}>{story.title}</Text>
                    <Text style={tinneMasterStoryPreview} numberOfLines={1}>
                      {story.preview}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {!!tinneMasterSelectedStory && (
        <View style={tinneMasterBottomBar}>
          <TouchableOpacity
            onPress={tinneMasterUnlockSelectedStory}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={tinneMasterGradientColors}
              start={tinneMasterGradientStart}
              end={tinneMasterGradientEnd}
              style={tinneMasterOpenButton}
            >
              <Text style={tinneMasterOpenText}>Open story</Text>
              <Image source={require('../assets/images/quantImg.png')} />
              <Text style={[tinneMasterOpenText, tinneMasterOpenPrice]}>
                10
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
};

export default TapMasterStories;

const tinneMasterBg = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterHeaderRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 20,
};

const tinneMasterHeaderLogoIOS = { width: 108, height: 70 };
const tinneMasterHeaderLogoAndroid = { width: 148, height: 70 };

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

const tinneMasterClockRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 12,
  paddingVertical: 14,
  borderRadius: 30,
  minWidth: 100,
  justifyContent: 'center' as const,
  borderWidth: 1,
  borderColor: '#E63182',
  backgroundColor: '#100237',
};

const tinneMasterClockText = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: '#F9A300',
  marginLeft: 8,
};

const tinneMasterSheet = {
  padding: 20,
  flex: 1,
  backgroundColor: '#100237',
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  marginTop: 30,
  height: '100%',
};

const tinneMasterTabs = {
  flexDirection: 'row' as const,
  padding: 20,
  gap: 10,
};

const tinneMasterTabBtn = {
  flex: 1,
  height: 40,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: '#fff',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterTabActive = {
  backgroundColor: '#EA3385',
  borderColor: '#fff',
  borderWidth: 3,
};

const tinneMasterTabText = {
  color: tinneMasterWhite,
  fontSize: 16,
  fontWeight: '700' as const,
};

const tinneMasterStoryCard = {
  borderRadius: 40,
  marginBottom: 20,
};

const tinneMasterStorySelected = {
  borderWidth: 1.3,
  borderColor: '#EA3385',
};

const tinneMasterStoryPad = { padding: 16 };

const tinneMasterStoryTitle = {
  color: tinneMasterWhite,
  fontSize: 14,
  fontWeight: '700' as const,
  textAlign: 'center' as const,
};

const tinneMasterStoryPreview = {
  color: tinneMasterWhite,
  marginTop: 6,
  fontWeight: '300' as const,
  textAlign: 'center' as const,
};

const tinneMasterBottomBar = {
  position: 'absolute' as const,
  bottom: 40,
  left: 0,
  right: 0,
  alignItems: 'center' as const,
};

const tinneMasterOpenButton = {
  flexDirection: 'row' as const,
  width: 260,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterOpenText = {
  color: tinneMasterWhite,
  fontSize: 20,
  fontWeight: '800' as const,
  marginRight: 8,
};

const tinneMasterOpenPrice = { color: '#F9A300', marginLeft: 8 };

const tinneMasterLockedColors = ['#a6115474', '#ea338579'];
