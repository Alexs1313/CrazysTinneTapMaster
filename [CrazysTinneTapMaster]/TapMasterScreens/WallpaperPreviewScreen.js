import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import { getNumber } from '../utils/tinneTapGameUtils';

const gradientColors = ['#EA3385', '#A61154'];
const gradientXY = { x: 0, y: 0 };
const gradientXYEnd = { x: 1, y: 0 };
const mainWhite = '#FFFFFF';
const bgImage = require('../assets/images/app_background.png');

const WallpaperPreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { height } = useWindowDimensions();

  const { wallpaper } = route.params;

  const [clocks, setClocks] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const getClocks = async () => {
      try {
        const savedClocks = await getNumber('TIME_CLOCKS');

        setClocks(savedClocks);

        console.log('success!');
      } catch (error) {
        console.error('Error loading time clocks:', error);
      }
    };

    getClocks();
  }, []);

  const shareImage = async () => {
    try {
      const tmpUri = await captureRef(imageRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      let fileUri = tmpUri.startsWith('file://') ? tmpUri : 'file://' + tmpUri;
      const pathToCheck = fileUri.replace('file://', '');
      const exists = await RNFS.exists(pathToCheck);
      if (!exists) return;

      await Share.open({
        url: fileUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      if (!error?.message?.includes('User did not share')) {
        console.error('shareWallpaper error', error);
      }
    }
  };

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
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
        <View style={styles.previewWrapper}>
          <Image
            source={wallpaper.image}
            style={styles.previewImage}
            ref={imageRef}
          />
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{ flex: 1 }}
            onPress={shareImage}
          >
            <LinearGradient
              colors={gradientColors}
              start={gradientXY}
              end={gradientXYEnd}
              style={styles.downloadButton}
            >
              <Text style={styles.buttonText}>Share</Text>
              <Image source={require('../assets/icons/share.png')} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  previewWrapper: {
    width: '80%',
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 30,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  downloadButton: {
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    color: mainWhite,
    fontSize: 20,
    fontWeight: '800',
  },
  shareCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EA3385',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WallpaperPreviewScreen;
