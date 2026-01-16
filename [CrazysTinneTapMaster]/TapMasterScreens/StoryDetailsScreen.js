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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import { getNumber } from '../utils/tinneTapGameUtils';
import { crazysStoriesContent } from '../TinneTapData/crazysStories';

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const StoryDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { storyId } = route.params;
  const [clocks, setClocks] = useState(0);
  const story = crazysStoriesContent[storyId];

  console.log(story);

  useEffect(() => {
    const loadClocks = async () => {
      try {
        const savedClocks = await getNumber('TIME_CLOCKS');

        setClocks(savedClocks);

        console.log('loaded!!');
      } catch (error) {
        console.error('Error loading clocks:', error);
      }
    };

    loadClocks();
  }, []);

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

          <TouchableOpacity onPress={shareStory} activeOpacity={0.85}>
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
        </View>
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
