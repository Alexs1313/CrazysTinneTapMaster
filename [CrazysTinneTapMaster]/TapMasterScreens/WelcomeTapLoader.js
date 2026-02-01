import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { tinneLoaderView } from '../TinneConstants/tinneLoaderView';

const loaderBg = require('../assets/images/app_background.png');

const WelcomeTapLoader = () => {
  const nav = useNavigation();
  const [showLoader, setShowLoader] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
      setShowImage(true);
    }, 4000);

    const navTimer = setTimeout(() => {
      try {
        nav.replace('CrazysOnboarding');
      } catch (err) {
        console.warn('replace failed =>', err);
        nav.navigate('CrazysOnboarding');
      }
    }, 6500);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(navTimer);
    };
  }, [nav]);

  return (
    <ImageBackground source={loaderBg} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {showImage && (
          <View style={sty.imageWrapper} accessibilityLabel="loader-screen">
            {Platform.OS === 'ios' ? (
              <Image source={require('../assets/images/loader_icon.png')} />
            ) : (
              <Image
                source={require('../assets/images/loadericon.png')}
                style={{ width: 450, height: 450 }}
              />
            )}
          </View>
        )}

        {showLoader && (
          <View style={sty.webviewWrapper}>
            <WebView
              originWhitelist={['*']}
              source={{ html: tinneLoaderView }}
              style={sty.webview}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const sty = StyleSheet.create({
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  webview: {
    width: 350,
    height: 120,
    backgroundColor: 'transparent',
  },
});

export default WelcomeTapLoader;
