import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import { getNumber } from '../utils/tinneTapGameUtils';

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };
const tinneMasterWhite = '#FFFFFF';
const tinneMasterBgImage = require('../assets/images/app_background.png');

const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const WallpaperPreviewScreen = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const tinneMasterRoute = useRoute<any>();
  const { height: tinneMasterH } = useWindowDimensions();

  const { wallpaper: tinneMasterWallpaper } = tinneMasterRoute.params;

  const [tinneMasterClocks, setTinneMasterClocks] = useState<number>(0);
  const tinneMasterImageRef = useRef<any>(null);

  useEffect(() => {
    const tinneMasterGetClocks = async () => {
      try {
        const savedClocksTinneMaster = await getNumber('TIME_CLOCKS');
        setTinneMasterClocks(savedClocksTinneMaster);
      } catch (error) {
        console.error('Error loading time clocks:', error);
      }
    };

    tinneMasterGetClocks();
  }, []);

  const tinneMasterShareImage = async () => {
    try {
      const tmpUriTinneMaster = await captureRef(tinneMasterImageRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const fileUriTinneMaster = tmpUriTinneMaster.startsWith('file://')
        ? tmpUriTinneMaster
        : 'file://' + tmpUriTinneMaster;

      const pathToCheckTinneMaster = fileUriTinneMaster.replace('file://', '');
      const existsTinneMaster = await RNFS.exists(pathToCheckTinneMaster);
      if (!existsTinneMaster) return;

      await Share.open({
        url: fileUriTinneMaster,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error: any) {
      if (!error?.message?.includes('User did not share')) {
        console.error('shareWallpaper error', error);
      }
    }
  };

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
      <View
        style={[tinneMasterHeaderRow, { paddingTop: tinneMasterHeaderPadTop }]}
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
          style={tinneMasterHeaderLogoStyle}
        />

        <View style={tinneMasterClockRow}>
          <Image source={require('../assets/images/quantImg.png')} />
          <Text style={tinneMasterClockText}>{tinneMasterClocks}</Text>
        </View>
      </View>

      <View style={tinneMasterSheet}>
        <View style={tinneMasterPreviewWrapper}>
          <Image
            source={tinneMasterWallpaper.image}
            style={tinneMasterPreviewImage}
            ref={tinneMasterImageRef}
          />
        </View>

        <View style={tinneMasterButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={tinneMasterFlex1}
            onPress={tinneMasterShareImage}
          >
            <LinearGradient
              colors={tinneMasterGradientColors}
              start={tinneMasterGradientStart}
              end={tinneMasterGradientEnd}
              style={tinneMasterShareButton}
            >
              <Text style={tinneMasterButtonText}>Share</Text>
              <Image source={require('../assets/icons/share.png')} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default WallpaperPreviewScreen;

const tinneMasterBg = { flex: 1 };

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

const tinneMasterSheet = {
  flex: 1,
  backgroundColor: '#100237',
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  marginTop: 30,
  padding: 20,
  alignItems: 'center' as const,
};

const tinneMasterPreviewWrapper = {
  width: '80%',
  flex: 1,
  borderRadius: 40,
  overflow: 'hidden' as const,
  marginBottom: 30,
};

const tinneMasterPreviewImage = {
  width: '100%',
  height: '100%',
  resizeMode: 'cover' as const,
};

const tinneMasterButtonsRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  marginBottom: 20,
  width: '100%',
};

const tinneMasterFlex1 = { flex: 1 };

const tinneMasterShareButton = {
  height: 70,
  borderRadius: 35,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  width: '90%',
  alignSelf: 'center' as const,
};

const tinneMasterButtonText = {
  color: tinneMasterWhite,
  fontSize: 20,
  fontWeight: '800' as const,
  marginRight: 10,
};
