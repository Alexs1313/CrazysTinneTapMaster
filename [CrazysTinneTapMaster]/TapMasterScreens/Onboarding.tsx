// import React, { useMemo, useState } from 'react';
// import {
//   Image,
//   ImageBackground,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';

// // assets
// const tinneMasterBgImage = require('../assets/images/app_background.png');
// const tinneMasterHeaderImageIOS = require('../assets/images/loader_icon.png');
// const tinneMasterHeaderImageAndroid = require('../assets/images/loadericon.png');

// // data
// const tinneMasterOnboardingSlides = [
//   {
//     tinneMasterTitle: 'Master the Perfect Second',
//     tinneMasterDescription:
//       'Stop the timer as close as possible to the target moment.\nPrecision matters — every millisecond counts.',
//     tinneMasterButtonLabel: 'Next',
//   },
//   {
//     tinneMasterTitle: 'Timing Is a Skill',
//     tinneMasterDescription:
//       'Tap too early or too late and your score drops.\nHit the perfect moment to build streaks and boost your result.',
//     tinneMasterButtonLabel: 'Got it',
//   },
//   {
//     tinneMasterTitle: 'Progress Through Precision',
//     tinneMasterDescription:
//       'Improve your accuracy, increase your score,\nand unlock new challenges and visual rewards as you play.',
//     tinneMasterButtonLabel: 'Sounds Cool',
//   },
//   {
//     tinneMasterTitle: 'Play. Improve. Repeat.',
//     tinneMasterDescription:
//       'Short sessions, increasing difficulty,\nand clear performance feedback after every round.',
//     tinneMasterButtonLabel: 'Start Playing',
//   },
// ];

// const CrazysOnboarding = () => {
//   const tinneMasterNavigation = useNavigation();
//   const { height: tinneMasterScreenHeight } = useWindowDimensions();

//   const [tinneMasterSlideIndex, setTinneMasterSlideIndex] = useState(0);

//   const tinneMasterCurrentSlide = useMemo(
//     () => tinneMasterOnboardingSlides[tinneMasterSlideIndex],
//     [tinneMasterSlideIndex],
//   );

//   const tinneMasterIsLastSlide =
//     tinneMasterSlideIndex === tinneMasterOnboardingSlides.length - 1;

//   const tinneMasterHeaderImage =
//     Platform.OS === 'ios'
//       ? tinneMasterHeaderImageIOS
//       : tinneMasterHeaderImageAndroid;

//   const tinneMasterHandleNext = () => {
//     if (!tinneMasterIsLastSlide) {
//       setTinneMasterSlideIndex(prev => prev + 1);
//       return;
//     }

//     tinneMasterNavigation.navigate('TinneTapHome');
//   };

//   return (
//     <ImageBackground source={tinneMasterBgImage} style={styles.tinneMasterBg}>
//       <ScrollView
//         contentContainerStyle={styles.scrollTinneMaster}
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//       >
//         <View style={styles.screenLayoutTinne}>
//           <Image
//             source={tinneMasterHeaderImage}
//             resizeMode="contain"
//             style={[
//               Platform.OS === 'ios'
//                 ? styles.headerImageTinneIOS
//                 : styles.headerImageMasterAndroid,
//               { marginBottom: tinneMasterScreenHeight * 0.13 },
//             ]}
//           />

//           <View
//             style={[
//               styles.onboardingSheetMaster,
//               { minHeight: tinneMasterScreenHeight * 0.45 },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.titleTinneMaster,
//                 { marginBottom: tinneMasterScreenHeight * 0.05 },
//               ]}
//             >
//               {tinneMasterCurrentSlide.tinneMasterTitle}
//             </Text>

//             <Text style={styles.tinneDescriptionMaster}>
//               {tinneMasterCurrentSlide.tinneMasterDescription}
//             </Text>

//             <TouchableOpacity
//               onPress={tinneMasterHandleNext}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={['#EA3385', '#A61154']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.masterCtaButton}
//               >
//                 <Text style={styles.ctaTextTinne}>
//                   {tinneMasterCurrentSlide.tinneMasterButtonLabel}
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             <View style={styles.paginationMasterRow}>
//               {tinneMasterOnboardingSlides.map((_, index) => {
//                 const tinneMasterIsActiveDot = index === tinneMasterSlideIndex;

//                 return (
//                   <View
//                     key={`tinneMasterDot-${index}`}
//                     style={[
//                       styles.tinneDotMaster,
//                       {
//                         backgroundColor: tinneMasterIsActiveDot
//                           ? '#EA3385'
//                           : '#FFFFFF33',
//                       },
//                     ]}
//                   />
//                 );
//               })}
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   tinneMasterBg: { flex: 1 },

//   scrollTinneMaster: { flexGrow: 1 },

//   screenLayoutTinne: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },

//   onboardingSheetMaster: {
//     backgroundColor: '#100237',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     padding: 50,
//   },

//   titleTinneMaster: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },

//   tinneDescriptionMaster: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: '#A61154',
//     textAlign: 'center',
//   },

//   masterCtaButton: {
//     marginTop: 40,
//     height: 70,
//     borderRadius: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//   },

//   ctaTextTinne: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: '800',
//   },

//   paginationMasterRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 25,
//   },

//   tinneDotMaster: {
//     width: 20,
//     height: 20,
//     borderRadius: 50,
//     marginHorizontal: 10,
//   },

//   headerImageTinneIOS: {
//     width: 258,
//     height: 167,
//     alignSelf: 'center',
//     marginTop: 40,
//   },

//   headerImageMasterAndroid: {
//     width: 450,
//     height: 200,
//     alignSelf: 'center',
//     marginTop: 14,
//   },
// });

// export default CrazysOnboarding;
