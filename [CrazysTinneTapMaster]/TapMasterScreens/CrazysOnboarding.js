import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const onboardingTexts = [
  {
    tinneTitle: 'Master the Perfect Second',
    tinneDescription: `Stop the timer as close as possible to the target moment.
Precision matters — every millisecond counts.`,
    btnLabel: 'Next',
  },
  {
    tinneTitle: 'Timing Is a Skill',
    tinneDescription: `Tap too early or too late and your score drops.
Hit the perfect moment to build streaks and boost your result.`,
    btnLabel: 'Got it',
  },
  {
    tinneTitle: 'Progress Through Precision',
    tinneDescription: `Improve your accuracy, increase your score,
and unlock new challenges and visual rewards as you play.`,
    btnLabel: 'Sounds Cool',
  },
  {
    tinneTitle: 'Play. Improve. Repeat.',
    tinneDescription: `Short sessions, increasing difficulty,
and clear performance feedback after every round.`,
    btnLabel: 'Start Playing',
  },
];

const bgImage = require('../assets/images/app_background.png');

const CrazysOnboarding = () => {
  const { height } = useWindowDimensions();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const navigation = useNavigation();

  const onNextPress = () => {
    if (currentTextIndex < 3) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      navigation.navigate('TinneTapHome');
    }
  };

  return (
    <ImageBackground style={{ flex: 1 }} source={bgImage}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainContainer}>
          {Platform.OS === 'ios' ? (
            <Image
              source={require('../assets/images/loader_icon.png')}
              style={[styles.onboardImage, { marginBottom: height * 0.13 }]}
            />
          ) : (
            <Image
              source={require('../assets/images/loadericon.png')}
              style={{
                width: 450,
                height: 200,
                marginBottom: height * 0.13,
                alignSelf: 'center',
                marginTop: 14,
              }}
            />
          )}

          <View style={[styles.bottomSheet, { minHeight: height * 0.45 }]}>
            <Text style={[styles.firstTitle, { marginBottom: height * 0.05 }]}>
              {onboardingTexts[currentTextIndex].tinneTitle}
            </Text>
            <Text style={styles.secondTitle}>
              {onboardingTexts[currentTextIndex].tinneDescription}
            </Text>

            <TouchableOpacity onPress={onNextPress} activeOpacity={0.8}>
              <LinearGradient
                colors={['#EA3385', '#A61154']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.gradientButtonText}>
                  {onboardingTexts[currentTextIndex].btnLabel}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.paginationContainer}>
              {[1, 2, 3, 4].map(index => (
                <View
                  key={index}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 50,
                    marginHorizontal: 10,
                    backgroundColor:
                      index === currentTextIndex + 1 ? '#EA3385' : '#FFFFFF33',
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#100237',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 50,
  },
  firstTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondTitle: {
    fontSize: 20,
    color: '#A61154',
    fontWeight: '500',
    textAlign: 'center',
  },
  gradientButton: {
    marginTop: 40,
    justifyContent: 'center',
    height: 70,
    borderRadius: 32,
    alignItems: 'center',
    width: '100%',
  },
  gradientButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  onboardImage: {
    width: 258,
    height: 167,
    alignSelf: 'center',
    marginTop: 40,
  },
});

export default CrazysOnboarding;
