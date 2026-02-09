import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { tinneLoaderView } from '../TinneConstants/tinneLoaderView';

const tinneMasterLoaderBg = require('../assets/images/app_background.png');
const tinneMasterLoaderIconIOS = require('../assets/images/loader_icon.png');
const tinneMasterLoaderIconAndroid = require('../assets/images/loadericon.png');

const WelcomeTapLoader = () => {
  const tinneMasterNav = useNavigation<any>();

  const [tinneMasterShowLoader, setTinneMasterShowLoader] =
    useState<boolean>(true);
  const [tinneMasterShowImage, setTinneMasterShowImage] =
    useState<boolean>(false);

  useEffect(() => {
    const loaderTimerTinneMaster = setTimeout(() => {
      setTinneMasterShowLoader(false);
      setTinneMasterShowImage(true);
    }, 4000);

    const navTimerTinneMaster = setTimeout(() => {
      try {
        tinneMasterNav.replace('IntroduceScreen');
      } catch (err) {
        console.warn('replace failed =>', err);
        tinneMasterNav.navigate('IntroduceScreen');
      }
    }, 6500);

    return () => {
      clearTimeout(loaderTimerTinneMaster);
      clearTimeout(navTimerTinneMaster);
    };
  }, [tinneMasterNav]);

  const tinneMasterLogoSource =
    Platform.OS === 'ios'
      ? tinneMasterLoaderIconIOS
      : tinneMasterLoaderIconAndroid;

  return (
    <ImageBackground
      source={tinneMasterLoaderBg}
      style={tinneMasterBg}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={tinneMasterScrollGrow}
        showsVerticalScrollIndicator={false}
      >
        {!!tinneMasterShowImage && (
          <View
            style={tinneMasterImageWrapper}
            accessibilityLabel="loader-screen"
          >
            <Image source={tinneMasterLogoSource} style={tinneMasterLogo} />
          </View>
        )}

        {!!tinneMasterShowLoader && (
          <View style={tinneMasterWebviewWrapper}>
            <WebView
              originWhitelist={['*']}
              source={{ html: tinneLoaderView }}
              style={tinneMasterWebview}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default WelcomeTapLoader;

const tinneMasterBg = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterImageWrapper = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterLogo = { width: 450, height: 450 };

const tinneMasterWebviewWrapper = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  alignSelf: 'center' as const,
};

const tinneMasterWebview = {
  width: 350,
  height: 120,
  backgroundColor: 'transparent',
};
