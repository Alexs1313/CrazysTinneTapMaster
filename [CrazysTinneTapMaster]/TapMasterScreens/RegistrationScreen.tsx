import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };

const tinneMasterWhite = '#FFFFFF';
const tinneMasterBgImage = require('../assets/images/app_background.png');

const tinneMasterCameraIcon = require('../assets/images/mdi_photo-camera.png');
const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const RegistrationScreen = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterH } = useWindowDimensions();

  const [tinneMasterStep, setTinneMasterStep] = useState<number>(1);
  const [tinneMasterName, setTinneMasterName] = useState<string>('');
  const [tinneMasterAbout, setTinneMasterAbout] = useState<string>('');
  const [tinneMasterPhoto, setTinneMasterPhoto] = useState<string | null>(null);

  const tinneMasterCanGoNext = useMemo(
    () => tinneMasterName.trim().length > 0 && !!tinneMasterAbout,
    [tinneMasterName, tinneMasterAbout],
  );

  const tinneMasterCanSave = useMemo(
    () => !!tinneMasterPhoto,
    [tinneMasterPhoto],
  );

  const tinneMasterPickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      const { didCancel, assets } = response;
      if (!didCancel && assets?.length) {
        const uriTinneMaster = assets[0]?.uri;
        if (uriTinneMaster) setTinneMasterPhoto(uriTinneMaster);
      }
    });
  };

  const tinneMasterSaveUserProfile = async () => {
    try {
      const nowTinneMaster = new Date().toISOString();
      const newUserProfileTinneMaster = {
        name: tinneMasterName.trim(),
        about: tinneMasterAbout.trim(),
        photo: tinneMasterPhoto,
        registrationDate: nowTinneMaster,
        firstSave: nowTinneMaster,
        lastChange: nowTinneMaster,
      };

      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify(newUserProfileTinneMaster),
      );

      tinneMasterNavigation.replace('TinneTapHome');
    } catch (error) {
      console.error('Failed save', error);
    }
  };

  const tinneMasterHeaderMarginBottom = tinneMasterH * 0.04;
  const tinneMasterSheetMinHeight = tinneMasterH * 0.68;

  return (
    <ImageBackground
      style={tinneMasterBg}
      source={tinneMasterBgImage}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={tinneMasterScrollGrow}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={tinneMasterMainContainer}>
          {Platform.OS === 'ios' ? (
            <Image
              source={tinneMasterHeaderImageIOS}
              style={[
                tinneMasterOnboardImageIOS,
                { marginBottom: tinneMasterHeaderMarginBottom },
              ]}
            />
          ) : (
            <Image
              source={tinneMasterHeaderImageAndroid}
              style={[
                tinneMasterOnboardImageAndroid,
                { marginBottom: tinneMasterHeaderMarginBottom },
              ]}
            />
          )}

          <LinearGradient
            colors={tinneMasterSheetGradientColors}
            start={tinneMasterSheetGradientStart}
            end={tinneMasterSheetGradientEnd}
            style={tinneMasterSheetWrap}
          >
            <View
              style={[
                tinneMasterBottomSheet,
                { minHeight: tinneMasterSheetMinHeight },
              ]}
            >
              <View style={tinneMasterHeaderRow}>
                <Text style={tinneMasterHeaderTitle}>Registration</Text>
                <View style={tinneMasterStepPill}>
                  <Text style={tinneMasterStepPillText}>
                    {tinneMasterStep}/2
                  </Text>
                </View>
              </View>

              {tinneMasterStep === 1 && (
                <>
                  <View style={tinneMasterFieldBlock}>
                    <Text style={tinneMasterLabel}>Your nickname</Text>
                    <TextInput
                      value={tinneMasterName}
                      onChangeText={setTinneMasterName}
                      maxLength={15}
                      placeholder="Enter name"
                      placeholderTextColor={'rgba(255,255,255,0.55)'}
                      style={tinneMasterInput}
                    />
                  </View>

                  <View style={tinneMasterFieldBlock}>
                    <Text style={tinneMasterLabel}>About you</Text>
                    <TextInput
                      value={tinneMasterAbout}
                      onChangeText={setTinneMasterAbout}
                      maxLength={15}
                      placeholder="Enter about you"
                      placeholderTextColor={'rgba(255,255,255,0.55)'}
                      style={tinneMasterInput}
                    />
                  </View>

                  <Text style={tinneMasterHelperText}>
                    Only the minimum info. Everything is stored only on your
                    device.
                  </Text>

                  <TouchableOpacity
                    onPress={() => setTinneMasterStep(2)}
                    activeOpacity={0.85}
                    disabled={!tinneMasterCanGoNext}
                    style={tinneMasterMt18}
                  >
                    <LinearGradient
                      colors={tinneMasterGradientColors}
                      start={tinneMasterGradientStart}
                      end={tinneMasterGradientEnd}
                      style={[
                        tinneMasterGradientButton,
                        !tinneMasterCanGoNext && tinneMasterDisabledBtn,
                      ]}
                    >
                      <Text style={tinneMasterGradientButtonText}>Next</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}

              {tinneMasterStep === 2 && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={tinneMasterPickImage}
                    style={tinneMasterPhotoBox}
                  >
                    {tinneMasterPhoto ? (
                      <Image
                        source={{ uri: tinneMasterPhoto }}
                        style={tinneMasterPhoto}
                      />
                    ) : (
                      <View style={tinneMasterPhotoEmpty}>
                        <Image source={tinneMasterCameraIcon} />
                        <Text style={tinneMasterPhotoHint}>
                          Tap to choose photo
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {!!tinneMasterPhoto && (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={tinneMasterPickImage}
                      style={tinneMasterMt14}
                    >
                      <LinearGradient
                        colors={tinneMasterGradientColors}
                        start={tinneMasterGradientStart}
                        end={tinneMasterGradientEnd}
                        style={tinneMasterSmallGradientButton}
                      >
                        <Text style={tinneMasterSmallGradientText}>
                          Change photo
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={tinneMasterSaveUserProfile}
                    activeOpacity={0.85}
                    disabled={!tinneMasterCanSave}
                    style={tinneMasterMt28}
                  >
                    <LinearGradient
                      colors={tinneMasterGradientColors}
                      start={tinneMasterGradientStart}
                      end={tinneMasterGradientEnd}
                      style={[
                        tinneMasterGradientButton,
                        !tinneMasterCanSave && tinneMasterDisabledBtn,
                      ]}
                    >
                      <Text style={tinneMasterGradientButtonText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setTinneMasterStep(1)}
                    activeOpacity={0.85}
                    style={tinneMasterMt22}
                  >
                    <Text style={tinneMasterGhostText}>Back</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default RegistrationScreen;

const tinneMasterBg = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterMainContainer = {
  flex: 1,
  justifyContent: 'flex-end' as const,
};

const tinneMasterOnboardImageIOS = {
  width: 258,
  height: 167,
  alignSelf: 'center' as const,
  marginTop: 40,
};

const tinneMasterOnboardImageAndroid = {
  width: 350,
  height: 200,
  alignSelf: 'center' as const,
  marginTop: 40,
};

const tinneMasterSheetGradientColors = ['#100237', '#3A0054'];
const tinneMasterSheetGradientStart = { x: 0, y: 0 };
const tinneMasterSheetGradientEnd = { x: 1, y: 0 };

const tinneMasterSheetWrap = {
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  overflow: 'hidden' as const,
};

const tinneMasterBottomSheet = {
  paddingHorizontal: 26,
  paddingTop: 28,
  paddingBottom: 28,
};

const tinneMasterHeaderRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-between' as const,
  marginBottom: 24,
};

const tinneMasterHeaderTitle = {
  color: tinneMasterWhite,
  fontWeight: '700' as const,
  fontSize: 22,
};

const tinneMasterStepPill = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
};

const tinneMasterStepPillText = {
  color: tinneMasterWhite,
  fontWeight: '700' as const,
  fontSize: 14,
};

const tinneMasterHelperText = {
  color: 'rgba(255, 255, 255, 0.904)',
  fontSize: 13,
  fontWeight: '600' as const,
  marginBottom: 18,
  marginTop: 12,
  lineHeight: 18,
  textAlign: 'center' as const,
  paddingHorizontal: 20,
};

const tinneMasterFieldBlock = {
  marginBottom: 14,
};

const tinneMasterLabel = {
  color: 'rgba(255,255,255,0.86)',
  fontSize: 13,
  fontWeight: '800' as const,
  marginBottom: 8,
};

const tinneMasterInput = {
  height: 56,
  borderRadius: 22,
  paddingHorizontal: 16,
  color: tinneMasterWhite,
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  fontSize: 16,
  fontWeight: '700' as const,
};

const tinneMasterGradientButton = {
  justifyContent: 'center' as const,
  height: 70,
  borderRadius: 32,
  alignItems: 'center' as const,
  width: '72%',
  alignSelf: 'center' as const,
};

const tinneMasterGradientButtonText = {
  color: tinneMasterWhite,
  fontWeight: '900' as const,
  fontSize: 20,
};

const tinneMasterSmallGradientButton = {
  justifyContent: 'center' as const,
  height: 50,
  borderRadius: 24,
  alignItems: 'center' as const,
  width: '52%',
  alignSelf: 'center' as const,
};

const tinneMasterSmallGradientText = {
  color: tinneMasterWhite,
  fontWeight: '700' as const,
  fontSize: 16,
};

const tinneMasterDisabledBtn = { opacity: 0.35 };

const tinneMasterGhostText = {
  textAlign: 'center' as const,
  color: 'rgba(255,255,255,0.75)',
  fontWeight: '800' as const,
  fontSize: 14,
};

const tinneMasterPhotoBox = {
  width: 200,
  height: 200,
  borderRadius: 28,
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  alignSelf: 'center' as const,
  overflow: 'hidden' as const,
  marginTop: 6,
};

const tinneMasterPhoto = {
  width: '100%',
  height: '100%',
};

const tinneMasterPhotoEmpty = {
  alignItems: 'center' as const,
};

const tinneMasterPhotoHint = {
  color: 'rgba(255,255,255,0.72)',
  fontWeight: '800' as const,
  fontSize: 12,
  marginTop: 10,
};

const tinneMasterMt18 = { marginTop: 18 };
const tinneMasterMt14 = { marginTop: 14 };
const tinneMasterMt28 = { marginTop: 28 };
const tinneMasterMt22 = { marginTop: 22 };
