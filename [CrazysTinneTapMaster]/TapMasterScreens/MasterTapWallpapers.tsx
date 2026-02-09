import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
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
import {
  getArray,
  getNumber,
  setArray,
  spendClocks,
} from '../utils/tinneTapGameUtils';

// ---------- assets / consts ----------
const tinneMasterBgImage = require('../assets/images/app_background.png');
const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };
const tinneMasterWhite = '#FFFFFF';

const tinneMasterStoreKeys = {
  CLOCKS: 'TIME_CLOCKS',
  UNLOCKED_WALLPAPERS: 'UNLOCKED_WALLPAPERS',
};

const tinneMasterWallpapers = [
  { id: 'wall_1', price: 0, image: require('../assets/images/wallp1.png') },
  { id: 'wall_2', price: 10, image: require('../assets/images/wallp2.png') },
  { id: 'wall_3', price: 10, image: require('../assets/images/wallp3.png') },
  { id: 'wall_4', price: 10, image: require('../assets/images/wallp4.png') },
  { id: 'wall_5', price: 10, image: require('../assets/images/wallp5.png') },
  { id: 'wall_6', price: 10, image: require('../assets/images/wallp6.png') },
  { id: 'wall_7', price: 10, image: require('../assets/images/wallp7.png') },
  { id: 'wall_8', price: 10, image: require('../assets/images/wallp8.png') },
];

const MasterTapWallpapers = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterScreenHeight } = useWindowDimensions();

  const [tinneMasterClocks, setTinneMasterClocks] = useState<number>(0);
  const [tinneMasterUnlockedIds, setTinneMasterUnlockedIds] = useState<
    string[]
  >([]);
  const [tinneMasterSelectedId, setTinneMasterSelectedId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const tinneMasterLoadStore = async () => {
      try {
        const tinneMasterSavedClocks = await getNumber(
          tinneMasterStoreKeys.CLOCKS,
        );
        const tinneMasterSavedUnlocked = await getArray(
          tinneMasterStoreKeys.UNLOCKED_WALLPAPERS,
        );

        const tinneMasterInitialUnlocked = tinneMasterSavedUnlocked.includes(
          'wall_1',
        )
          ? tinneMasterSavedUnlocked
          : ['wall_1', ...tinneMasterSavedUnlocked];

        setTinneMasterClocks(tinneMasterSavedClocks);
        setTinneMasterUnlockedIds(tinneMasterInitialUnlocked);

        await setArray(
          tinneMasterStoreKeys.UNLOCKED_WALLPAPERS,
          tinneMasterInitialUnlocked,
        );
      } catch (error) {
        console.error('Error loading wallpapers', error);
      }
    };

    tinneMasterLoadStore();
  }, []);

  const tinneMasterOnWallpaperPress = (
    wallpaper: (typeof tinneMasterWallpapers)[number],
  ) => {
    if (tinneMasterUnlockedIds.includes(wallpaper.id)) {
      tinneMasterNavigation.navigate('WallpaperPreviewScreen', { wallpaper });
      return;
    }
    setTinneMasterSelectedId(wallpaper.id);
  };

  const tinneMasterUnlockSelected = async () => {
    if (!tinneMasterSelectedId) return;

    try {
      const tinneMasterNewClocks = await spendClocks(10);

      if (tinneMasterNewClocks === false) {
        Alert.alert('Not enough Clocks', 'You need 10 clocks.');
        return;
      }

      const tinneMasterUpdatedUnlocked = [
        ...tinneMasterUnlockedIds,
        tinneMasterSelectedId,
      ];

      await setArray(
        tinneMasterStoreKeys.UNLOCKED_WALLPAPERS,
        tinneMasterUpdatedUnlocked,
      );

      setTinneMasterUnlockedIds(tinneMasterUpdatedUnlocked);
      setTinneMasterClocks(tinneMasterNewClocks);
      setTinneMasterSelectedId(null);
    } catch (error) {
      console.error('Error unlocking wallpaper :(', error);
    }
  };

  const tinneMasterHeaderImage =
    Platform.OS === 'ios'
      ? tinneMasterHeaderImageIOS
      : tinneMasterHeaderImageAndroid;

  const tinneMasterHeaderPadTop = tinneMasterScreenHeight * 0.06;

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
            onPress={tinneMasterNavigation.goBack}
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

        <LinearGradient
          colors={tinneMasterSheetGradientColors}
          start={tinneMasterSheetGradientStart}
          end={tinneMasterSheetGradientEnd}
          style={tinneMasterSheetGradientWrap}
        >
          <View style={tinneMasterSheet}>
            <View style={tinneMasterGrid}>
              {tinneMasterWallpapers.map(item => {
                const tinneMasterIsUnlocked = tinneMasterUnlockedIds.includes(
                  item.id,
                );
                const tinneMasterIsSelected = tinneMasterSelectedId === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() => tinneMasterOnWallpaperPress(item)}
                    style={[
                      tinneMasterWallCard,
                      tinneMasterIsSelected && tinneMasterWallSelected,
                    ]}
                  >
                    <Image
                      source={item.image}
                      style={[
                        tinneMasterWallImage,
                        !tinneMasterIsUnlocked && tinneMasterWallLocked,
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      {!!tinneMasterSelectedId && (
        <View style={tinneMasterBottomBar}>
          <TouchableOpacity
            onPress={tinneMasterUnlockSelected}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={tinneMasterGradientColors}
              start={tinneMasterGradientStart}
              end={tinneMasterGradientEnd}
              style={tinneMasterOpenButton}
            >
              <Text style={tinneMasterOpenText}>Open wallpaper</Text>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
              >
                <Image source={require('../assets/images/quantImg.png')} />
                <Text style={[tinneMasterOpenText, tinneMasterOpenPriceText]}>
                  10
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
};

const tinneMasterBg = { flex: 1 };

const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterHeaderRow = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  paddingHorizontal: 20,
};

const tinneMasterBackBtn = {
  backgroundColor: '#100237',
  width: 70,
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#E63182',
};

const tinneMasterHeaderLogoIOS = { width: 108, height: 70 };
const tinneMasterHeaderLogoAndroid = { width: 148, height: 70 };

const tinneMasterClockRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: '#100237',
  paddingHorizontal: 12,
  paddingVertical: 14,
  borderRadius: 30,
  minWidth: 100,
  justifyContent: 'center' as const,
  borderWidth: 1,
  borderColor: '#E63182',
};

const tinneMasterClockText = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: '#F9A300',
  marginLeft: 8,
};

const tinneMasterSheetGradientColors = ['#100237', '#3A0054'];
const tinneMasterSheetGradientStart = { x: 0, y: 0 };
const tinneMasterSheetGradientEnd = { x: 1, y: 0 };

const tinneMasterSheetGradientWrap = {
  flex: 1,
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  marginTop: 30,
};

const tinneMasterSheet = {
  padding: 20,
};

const tinneMasterGrid = {
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  justifyContent: 'center' as const,
  gap: 15,
};

const tinneMasterWallCard = {
  width: '30%',
  aspectRatio: 0.55,
  borderRadius: 20,
  marginBottom: 20,
  overflow: 'hidden' as const,
};

const tinneMasterWallSelected = {
  borderWidth: 3,
  borderColor: '#A61154',
};

const tinneMasterWallImage = {
  width: '100%',
  height: '100%',
};

const tinneMasterWallLocked = {
  opacity: 0.35,
};

const tinneMasterBottomBar = {
  position: 'absolute' as const,
  bottom: 30,
  left: 0,
  right: 0,
  alignItems: 'center' as const,
};

const tinneMasterOpenButton = {
  flexDirection: 'row' as const,
  width: 268,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: 8,
};

const tinneMasterOpenText = {
  color: tinneMasterWhite,
  fontSize: 18,
  fontWeight: '800' as const,
};

const tinneMasterOpenPriceText = { color: '#F9A300' };

export default MasterTapWallpapers;
