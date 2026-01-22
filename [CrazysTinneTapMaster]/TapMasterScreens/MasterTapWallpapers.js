import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  getNumber,
  getArray,
  setArray,
  spendClocks,
} from '../utils/tinneTapGameUtils';

const wallpapers = [
  { id: 'wall_1', price: 0, image: require('../assets/images/wallp1.png') },
  { id: 'wall_2', price: 10, image: require('../assets/images/wallp2.png') },
  { id: 'wall_3', price: 10, image: require('../assets/images/wallp3.png') },
  { id: 'wall_4', price: 10, image: require('../assets/images/wallp4.png') },
  { id: 'wall_5', price: 10, image: require('../assets/images/wallp5.png') },
  { id: 'wall_6', price: 10, image: require('../assets/images/wallp6.png') },
  { id: 'wall_7', price: 10, image: require('../assets/images/wallp7.png') },
  { id: 'wall_8', price: 10, image: require('../assets/images/wallp8.png') },
];

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const STORE_KEYS = {
  CLOCKS: 'TIME_CLOCKS',
  UNLOCKED_WALLPAPERS: 'UNLOCKED_WALLPAPERS',
};

const MasterTapWallpapers = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const [clocks, setClocks] = useState(0);
  const [unlocked, setUnlocked] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const getSavedWallpapers = async () => {
      try {
        const savedClocks = await getNumber(STORE_KEYS.CLOCKS);
        const savedUnlocked = await getArray(STORE_KEYS.UNLOCKED_WALLPAPERS);

        const initialUnlocked = savedUnlocked.includes('wall_1')
          ? savedUnlocked
          : ['wall_1', ...savedUnlocked];

        setClocks(savedClocks);
        setUnlocked(initialUnlocked);

        await setArray(STORE_KEYS.UNLOCKED_WALLPAPERS, initialUnlocked);
      } catch (error) {
        console.error('Error loading wallpapers', error);
      }
    };

    getSavedWallpapers();
  }, []);

  const onWallpaperPress = wallpaper => {
    if (unlocked.includes(wallpaper.id)) {
      navigation.navigate('WallpaperPreviewScreen', { wallpaper });
      return;
    }
    setSelected(wallpaper.id);
  };

  const unlockWallpaper = async () => {
    if (!selected) return;

    try {
      const newClocks = await spendClocks(10);

      if (newClocks === false) {
        Alert.alert('Not enough Clocks', 'You need 10 clocks.');
        return;
      }

      const updatedUnlocked = [...unlocked, selected];
      await setArray(STORE_KEYS.UNLOCKED_WALLPAPERS, updatedUnlocked);

      setUnlocked(updatedUnlocked);
      setClocks(newClocks);
      setSelected(null);
    } catch (error) {
      console.error('Error unlocking wallpaper :(', error);
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
          <TouchableOpacity style={styles.backBtn} onPress={navigation.goBack}>
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
          <View style={styles.grid}>
            {wallpapers.map(item => {
              const isUnlocked = unlocked.includes(item.id);
              const isSelected = selected === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => onWallpaperPress(item)}
                  style={[styles.wallCard, isSelected && styles.wallSelected]}
                >
                  <Image
                    source={item.image}
                    style={[styles.wallImage, !isUnlocked && styles.wallLocked]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {selected && (
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={unlockWallpaper} activeOpacity={0.85}>
            <LinearGradient
              colors={gradientColors}
              start={gradientXY}
              end={gradientXYEnd}
              style={styles.openButton}
            >
              <Text style={styles.openText}>Open wallpaper</Text>
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
    backgroundColor: '#100237',
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E63182',
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#100237',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E63182',
  },
  clockText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9A300',
  },
  sheet: {
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    padding: 20,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  wallCard: {
    width: '30%',
    aspectRatio: 0.55,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  wallSelected: {
    borderWidth: 3,
    borderColor: '#A61154',
  },
  wallImage: {
    width: '100%',
    height: '100%',
  },
  wallLocked: {
    opacity: 0.35,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
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

export default MasterTapWallpapers;
