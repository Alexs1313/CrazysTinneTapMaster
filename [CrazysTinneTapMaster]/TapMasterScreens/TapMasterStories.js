import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Utils and Store / locals imports
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
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const getSavedData = async () => {
      try {
        const savedClocks = await getNumber(STORE_KEYS.CLOCKS);

        const savedUnlocked = await getArray(STORE_KEYS.UNLOCKED_STORIES);

        const initialUnlocked = savedUnlocked.includes('story_1')
          ? savedUnlocked
          : ['story_1', ...savedUnlocked];

        setClocks(savedClocks);
        setUnlockedStories(initialUnlocked);

        await setArray(STORE_KEYS.UNLOCKED_STORIES, initialUnlocked);
      } catch (error) {
        console.error('Error unlocked stories:', error);
      }
    };

    getSavedData();
  }, []);

  const onStoryPress = story => {
    console.log(story);

    if (unlockedStories.includes(story.id)) {
      navigation.navigate('StoryDetailsScreen', { storyId: story.id });
      return;
    }

    setSelectedStory(story.id);
  };

  const unlockSelectedStory = async () => {
    if (!selectedStory) return;

    try {
      const newClocks = await spendClocks(10);

      if (newClocks === false) {
        Alert.alert('Not enough Clocks', 'You need 10 clocks.');
        return;
      }

      const updatedUnlocked = [...unlockedStories, selectedStory];
      await setArray(STORE_KEYS.UNLOCKED_STORIES, updatedUnlocked);

      setUnlockedStories(updatedUnlocked);
      setClocks(newClocks);

      setSelectedStory(null);
    } catch (error) {
      console.error('catched story err', error);
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
          {crazysStories.map(story => {
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
                  colors={unlocked ? gradientColors : ['#F6C1D6', '#F6C1D6']}
                >
                  <View
                    style={{
                      padding: 10,
                      paddingHorizontal: 20,
                      width: '100%',
                    }}
                  >
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
          <TouchableOpacity onPress={unlockSelectedStory} activeOpacity={0.85}>
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
    backgroundColor: mainWhite,
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: mainWhite,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 100,
    justifyContent: 'center',
  },
  clockText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9A300',
  },
  sheet: {
    flex: 1,
    backgroundColor: mainWhite,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    padding: 20,
  },
  storyCard: {
    backgroundColor: '#F6C1D6',
    borderRadius: 40,
    marginBottom: 20,
    width: '100%',
  },
  storySelected: {
    borderWidth: 1.3,
    borderColor: '#EA3385',
    borderRadius: 30,
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
