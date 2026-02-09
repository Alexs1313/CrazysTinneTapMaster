import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';

const tinneMasterBgImage = require('../assets/images/app_background.png');
const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

const tinneMasterGradientColors = ['#EA3385', '#A61154'];
const tinneMasterGradientStart = { x: 0, y: 0 };
const tinneMasterGradientEnd = { x: 1, y: 0 };
const tinneMasterWhite = '#FFFFFF';

const ProfileScreen = () => {
  const tinneMasterNavigation = useNavigation<any>();
  const { height: tinneMasterH } = useWindowDimensions();

  const [tinneMasterProfile, setTinneMasterProfile] = useState<any>(null);

  useEffect(() => {
    tinneMasterGetProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tinneMasterGetProfile = async () => {
    try {
      const storedProfileTinneMaster = await AsyncStorage.getItem(
        'userProfile',
      );
      if (storedProfileTinneMaster) {
        setTinneMasterProfile(JSON.parse(storedProfileTinneMaster));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const tinneMasterUpdateProfile = async (updatedData: any) => {
    try {
      const updatedProfileTinneMaster = {
        ...tinneMasterProfile,
        ...updatedData,
        lastChange: new Date().toISOString(),
      };

      setTinneMasterProfile(updatedProfileTinneMaster);
      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify(updatedProfileTinneMaster),
      );
    } catch (error) {
      console.error('Error updating =>', error);
    }
  };

  const tinneMasterPickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && response.assets?.length) {
        const selectedImageTinneMaster = response.assets[0]?.uri;
        if (selectedImageTinneMaster) {
          tinneMasterUpdateProfile({ photo: selectedImageTinneMaster });
        }
      }
    });
  };

  const tinneMasterFormatDate = (date: any) =>
    date ? new Date(date).toLocaleDateString('en-GB') : '--';

  const tinneMasterShareProfile = () => {
    if (!tinneMasterProfile?.name || !tinneMasterProfile?.about) return;

    Share.share({
      message: `Check out my profile!\nName: ${tinneMasterProfile.name}\nAbout: ${tinneMasterProfile.about}`,
    }).catch(error => console.error('Error sharing profile:', error));
  };

  const tinneMasterDeleteProfile = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('visitRecords');
      await AsyncStorage.removeItem('bookmarkedPlaces');

      setTinneMasterProfile(null);
      tinneMasterNavigation.replace('RegistrationScreen');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const tinneMasterHeaderPadTop = tinneMasterH * 0.06;
  const tinneMasterBackBtnTop = tinneMasterH * 0.06;
  const tinneMasterSheetMinHeight = tinneMasterH * 0.78;

  const tinneMasterHeaderImage =
    Platform.OS === 'ios'
      ? tinneMasterHeaderImageIOS
      : tinneMasterHeaderImageAndroid;

  if (!tinneMasterProfile) {
    return (
      <ImageBackground
        source={tinneMasterBgImage}
        style={tinneMasterBg}
        resizeMode="cover"
      >
        <View style={tinneMasterEmptyFlex} />
      </ImageBackground>
    );
  }

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
        <View style={tinneMasterMainContainer}>
          <View
            style={[
              tinneMasterTopWrap,
              { paddingTop: tinneMasterHeaderPadTop },
            ]}
          >
            <TouchableOpacity
              style={[tinneMasterBackBtn, { top: tinneMasterBackBtnTop }]}
              onPress={() => tinneMasterNavigation.goBack()}
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
          </View>

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
                <Text style={tinneMasterTitle}>My profile</Text>
              </View>

              <View style={tinneMasterPhotoRow}>
                <View style={tinneMasterAvatarWrap}>
                  {tinneMasterProfile.photo ? (
                    <Image
                      source={{ uri: tinneMasterProfile.photo }}
                      style={tinneMasterUserImg}
                    />
                  ) : (
                    <View style={tinneMasterAvatarPlaceholder}>
                      <Text style={tinneMasterAvatarPlaceholderText}>
                        No photo
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={tinneMasterPickImage}
                  style={tinneMasterFlex1}
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
              </View>

              <View style={tinneMasterFieldsWrap}>
                <Text style={tinneMasterLabel}>Name</Text>
                <TextInput
                  style={tinneMasterInput}
                  value={tinneMasterProfile.name}
                  onChangeText={text =>
                    tinneMasterUpdateProfile({ name: text })
                  }
                  placeholder="Your name"
                  placeholderTextColor={'rgba(255,255,255,0.55)'}
                />

                <Text style={[tinneMasterLabel, tinneMasterLabelTopGap]}>
                  About
                </Text>
                <TextInput
                  style={tinneMasterInput}
                  value={tinneMasterProfile.about}
                  onChangeText={text =>
                    tinneMasterUpdateProfile({ about: text })
                  }
                  placeholder="About you"
                  placeholderTextColor={'rgba(255,255,255,0.55)'}
                />
              </View>

              <View style={tinneMasterDatesBlock}>
                <View style={tinneMasterDateCard}>
                  <Text style={tinneMasterDateLabel}>Registration</Text>
                  <Text style={tinneMasterDateValue}>
                    {tinneMasterFormatDate(tinneMasterProfile.registrationDate)}
                  </Text>
                </View>

                <View style={tinneMasterDateCard}>
                  <Text style={tinneMasterDateLabel}>First save</Text>
                  <Text style={tinneMasterDateValue}>
                    {tinneMasterFormatDate(tinneMasterProfile.firstSave)}
                  </Text>
                </View>

                <View style={tinneMasterDateCard}>
                  <Text style={tinneMasterDateLabel}>Last change</Text>
                  <Text style={tinneMasterDateValue}>
                    {tinneMasterFormatDate(tinneMasterProfile.lastChange)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={tinneMasterShareProfile}
                style={tinneMasterBtnMt16}
              >
                <LinearGradient
                  colors={tinneMasterGradientColors}
                  start={tinneMasterGradientStart}
                  end={tinneMasterGradientEnd}
                  style={tinneMasterBigButton}
                >
                  <Text style={tinneMasterBigButtonText}>Share profile</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={tinneMasterDeleteProfile}
                style={tinneMasterBtnMt12}
              >
                <LinearGradient
                  colors={tinneMasterGradientColors}
                  start={tinneMasterGradientStart}
                  end={tinneMasterGradientEnd}
                  style={tinneMasterBigButton}
                >
                  <Text style={tinneMasterBigButtonText}>Delete profile</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={tinneMasterFooterHint}>
                Stored only on your device.
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const tinneMasterBg = { flex: 1 };
const tinneMasterEmptyFlex = { flex: 1 };
const tinneMasterScrollGrow = { flexGrow: 1 };

const tinneMasterMainContainer = {
  flex: 1,
  justifyContent: 'flex-end' as const,
};

const tinneMasterTopWrap = {
  alignItems: 'center' as const,
  paddingHorizontal: 20,
  marginBottom: 50,
};

const tinneMasterBackBtn = {
  width: 70,
  height: 70,
  borderRadius: 30,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  position: 'absolute' as const,
  left: 20,
  borderWidth: 1,
  borderColor: '#E63182',
  backgroundColor: '#100237',
};

const tinneMasterHeaderLogoIOS = { width: 138, height: 70 };
const tinneMasterHeaderLogoAndroid = { width: 148, height: 70 };

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
  paddingTop: 26,
  paddingBottom: 28,
};

const tinneMasterHeaderRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-between' as const,
  marginBottom: 14,
};

const tinneMasterTitle = {
  color: tinneMasterWhite,
  fontSize: 22,
  fontWeight: '700' as const,
};

const tinneMasterPhotoRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  marginBottom: 16,
  marginTop: 8,
};

const tinneMasterAvatarWrap = {
  width: 92,
  height: 92,
  borderRadius: 28,
  overflow: 'hidden' as const,
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  marginRight: 14,
};

const tinneMasterUserImg = {
  width: '100%',
  height: '100%',
};

const tinneMasterAvatarPlaceholder = {
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const tinneMasterAvatarPlaceholderText = {
  color: 'rgba(255,255,255,0.65)',
  fontWeight: '800' as const,
  fontSize: 12,
};

const tinneMasterLabel = {
  color: 'rgba(255,255,255,0.86)',
  fontSize: 13,
  fontWeight: '800' as const,
  marginBottom: 8,
};

const tinneMasterLabelTopGap = { marginTop: 10 };

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

const tinneMasterDatesBlock = {
  marginTop: 16,
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  justifyContent: 'space-between' as const,
  gap: 8,
};

const tinneMasterDateCard = {
  flexGrow: 1,
  flexBasis: '30%' as const,
  minWidth: 110,
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 18,
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  marginBottom: 10,
};

const tinneMasterDateLabel = {
  color: 'rgba(255,255,255,0.68)',
  fontSize: 10,
  fontWeight: '800' as const,
  marginBottom: 6,
};

const tinneMasterDateValue = {
  color: tinneMasterWhite,
  fontSize: 13,
  fontWeight: '900' as const,
};

const tinneMasterSmallGradientButton = {
  justifyContent: 'center' as const,
  height: 56,
  borderRadius: 26,
  alignItems: 'center' as const,
  width: '100%',
};

const tinneMasterSmallGradientText = {
  color: tinneMasterWhite,
  fontWeight: '900' as const,
  fontSize: 14,
};

const tinneMasterBigButton = {
  justifyContent: 'center' as const,
  height: 70,
  borderRadius: 32,
  alignItems: 'center' as const,
  width: '72%',
  alignSelf: 'center' as const,
};

const tinneMasterBigButtonText = {
  color: tinneMasterWhite,
  fontWeight: '700' as const,
  fontSize: 18,
};

const tinneMasterFooterHint = {
  textAlign: 'center' as const,
  marginTop: 14,
  color: 'rgba(255,255,255,0.60)',
  fontWeight: '700' as const,
  fontSize: 12,
};

const tinneMasterFlex1 = { flex: 1 };

const tinneMasterFieldsWrap = { marginTop: 6 };
const tinneMasterBtnMt16 = { marginTop: 16 };
const tinneMasterBtnMt12 = { marginTop: 12 };
