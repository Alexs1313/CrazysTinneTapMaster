import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { use, useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  useWindowDimensions,
  Platform,
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

const STORE_KEYS = {
  CLOCKS: 'TIME_CLOCKS',
  UNLOCKED_STORIES: 'UNLOCKED_STORIES',
  SAVED_STORIES: 'SAVED_STORIES',
};

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const TapMasterStories = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const [clocks, setClocks] = useState(0);
  const [unlockedStories, setUnlockedStories] = useState([]);
  const [savedStories, setSavedStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [tab, setTab] = useState('all');

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const savedClocks = await getNumber(STORE_KEYS.CLOCKS);
          const unlocked = await getArray(STORE_KEYS.UNLOCKED_STORIES);
          const saved = await AsyncStorage.getItem(STORE_KEYS.SAVED_STORIES);

          const unlockedInit = unlocked.includes('story_1')
            ? unlocked
            : ['story_1', ...unlocked];

          setClocks(savedClocks);
          setUnlockedStories(unlockedInit);
          setSavedStories(saved ? JSON.parse(saved) : []);

          await setArray(STORE_KEYS.UNLOCKED_STORIES, unlockedInit);
        } catch (e) {
          console.log('Load error', e);
        }
      };

      loadData();
    }, []),
  );

  const onStoryPress = story => {
    if (unlockedStories.includes(story.id)) {
      navigation.navigate('StoryDetailsScreen', { storyId: story.id });
      return;
    }

    setSelectedStory(story.id);
  };

  const unlockSelectedStory = async () => {
    if (!selectedStory) return;

    const newClocks = await spendClocks(10);
    if (newClocks === false) {
      Alert.alert('Not enough Clocks', 'You need 10 clocks.');
      return;
    }

    const updated = [...unlockedStories, selectedStory];
    await setArray(STORE_KEYS.UNLOCKED_STORIES, updated);

    setUnlockedStories(updated);
    setClocks(newClocks);
    setSelectedStory(null);
  };

  const visibleStories =
    tab === 'all'
      ? crazysStories
      : crazysStories.filter(story => savedStories.includes(story.id));

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: height * 0.06,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>

          {Platform.OS === 'ios' ? (
            <Image
              source={require('../assets/images/loader_icon.png')}
              style={{ width: 108, height: 70 }}
            />
          ) : (
            <Image
              source={require('../assets/images/loadericon.png')}
              style={{
                width: 148,
                height: 70,
              }}
            />
          )}

          <View style={styles.clockRow}>
            <Image source={require('../assets/images/quantImg.png')} />
            <Text style={styles.clockText}>{clocks}</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => setTab('all')}
              style={[styles.tab, tab === 'all' && styles.tabActive]}
            >
              <Text style={styles.tabText}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab('saved')}
              style={[styles.tab, tab === 'saved' && styles.tabActive]}
            >
              <Text style={styles.tabText}>Saved</Text>
            </TouchableOpacity>
          </View>

          {visibleStories.map(story => {
            const unlocked = unlockedStories.includes(story.id);
            const selected = selectedStory === story.id;

            return (
              <TouchableOpacity
                key={story.id}
                activeOpacity={0.85}
                onPress={() => onStoryPress(story)}
              >
                <LinearGradient
                  style={[styles.storyCard, selected && styles.storySelected]}
                  start={gradientXY}
                  end={gradientXYEnd}
                  colors={
                    unlocked ? gradientColors : ['#a6115474', '#ea338579']
                  }
                >
                  <View style={{ padding: 16 }}>
                    <Text style={styles.storyTitle}>{story.title}</Text>
                    <Text style={styles.storyPreview} numberOfLines={1}>
                      {story.preview}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedStory && (
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={unlockSelectedStory}>
            <LinearGradient
              colors={gradientColors}
              start={gradientXY}
              end={gradientXYEnd}
              style={styles.openButton}
            >
              <Text style={styles.openText}>Open story</Text>
              <Image source={require('../assets/images/quantImg.png')} />
              <Text style={[styles.openText, { color: '#F9A300' }]}>10</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E63182',
    backgroundColor: '#100237',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E63182',
    backgroundColor: '#100237',
  },
  clockText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9A300',
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#EA3385',
    borderColor: '#fff',
    borderWidth: 3,
  },
  tabText: {
    color: mainWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  sheet: {
    padding: 20,
    flex: 1,
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    height: '100%',
  },
  storyCard: {
    borderRadius: 40,
    marginBottom: 20,
  },
  storySelected: {
    borderWidth: 1.3,
    borderColor: '#EA3385',
  },
  storyTitle: {
    color: mainWhite,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  storyPreview: {
    color: mainWhite,
    marginTop: 6,
    fontWeight: '300',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  openButton: {
    flexDirection: 'row',
    gap: 10,
    width: 260,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openText: {
    color: mainWhite,
    fontSize: 20,
    fontWeight: '800',
  },
});

export default TapMasterStories;
