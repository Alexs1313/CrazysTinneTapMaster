import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getNumber } from '../utils/tinneTapGameUtils';
import { crazysStoriesContent } from '../TinneTapData/crazysStories';

const SAVED_KEY = 'SAVED_STORIES';

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const StoryDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { storyId } = route.params;
  const story = crazysStoriesContent[storyId];
  const [clocks, setClocks] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadClocks = async () => {
      try {
        const savedClocks = await getNumber('TIME_CLOCKS');
        setClocks(savedClocks);
      } catch (error) {
        console.error('Error loading clocks:', error);
      }
    };

    loadClocks();
  }, []);

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const data = await AsyncStorage.getItem(SAVED_KEY);
        const savedStories = data ? JSON.parse(data) : [];
        setSaved(savedStories.includes(storyId));
      } catch (e) {
        console.log('Check saved error', e);
      }
    };

    checkSaved();
  }, [storyId]);

  const toggleSave = async () => {
    try {
      const data = await AsyncStorage.getItem(SAVED_KEY);
      let savedStories = data ? JSON.parse(data) : [];

      if (saved) {
        savedStories = savedStories.filter(id => id !== storyId);
      } else {
        savedStories.push(storyId);
      }

      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(savedStories));

      setSaved(!saved);
    } catch (e) {
      console.log('Toggle save error', e);
    }
  };

  const shareStory = async () => {
    try {
      await Share.share({
        message: `${story.title}\n\n${story.text}`,
      });
    } catch (error) {
      console.log('Share error', error);
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
          <View style={styles.textCard}>
            <LinearGradient
              colors={gradientColors}
              start={gradientXY}
              end={gradientXYEnd}
              style={{ borderRadius: 30 }}
            >
              <View style={{ padding: 20 }}>
                <Text style={styles.title}>{story.title}</Text>
                <Text style={styles.storyText}>{story.text}</Text>
              </View>
            </LinearGradient>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TouchableOpacity
              onPress={shareStory}
              activeOpacity={0.85}
              style={{ flex: 1, marginRight: 20 }}
            >
              <LinearGradient
                colors={gradientColors}
                start={gradientXY}
                end={gradientXYEnd}
                style={styles.shareButton}
              >
                <Text style={styles.shareText}>Share the story</Text>
                <Image source={require('../assets/icons/share.png')} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSave} activeOpacity={0.8}>
              <LinearGradient
                colors={saved ? ['#100237', '#100237'] : gradientColors}
                start={gradientXY}
                end={gradientXYEnd}
                style={styles.storySavedBtn}
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

const styles = StyleSheet.create({
  backBtn: {
    borderWidth: 1,
    borderColor: '#E63182',
    backgroundColor: '#100237',
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storySavedBtn: {
    width: 70,
    height: 70,
    borderRadius: 30,
    backgroundColor: '#100237',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E63182',
    backgroundColor: '#100237',
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
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    padding: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: mainWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  textCard: {
    marginBottom: 20,
  },
  storyText: {
    color: mainWhite,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
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

export default StoryDetailsScreen;
