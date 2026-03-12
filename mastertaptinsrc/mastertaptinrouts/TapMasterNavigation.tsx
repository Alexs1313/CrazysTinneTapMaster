import { createStackNavigator } from '@react-navigation/stack';

import TinneTapHome from '../mastertaptinscrrns/TinneTapHome';
import WelcomeTapLoader from '../mastertaptinscrrns/WelcomeTapLoader';
import TapGameScreen from '../mastertaptinscrrns/TapGameScreen';
import TapMasterStories from '../mastertaptinscrrns/TapMasterStories';
import StoryDetailsScreen from '../mastertaptinscrrns/StoryDetailsScreen';
import MasterTapWallpapers from '../mastertaptinscrrns/MasterTapWallpapers';
import WallpaperPreviewScreen from '../mastertaptinscrrns/WallpaperPreviewScreen';
import TinneSettings from '../mastertaptinscrrns/TinneSettings';
import IntroduceScreen from '../mastertaptinscrrns/IntroduceScreen';

import ProfileScreen from '../mastertaptinscrrns/ProfileScreen';
import Mastrduogmscrn from '../mastertaptinscrrns/Mastrduogmscrn';

const Stack = createStackNavigator();

const TapMasterNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeTapLoader" component={WelcomeTapLoader} />
      <Stack.Screen name="IntroduceScreen" component={IntroduceScreen} />
      <Stack.Screen name="TinneTapHome" component={TinneTapHome} />
      <Stack.Screen name="TapGameScreen" component={TapGameScreen} />
      <Stack.Screen name="TapMasterStories" component={TapMasterStories} />
      <Stack.Screen name="StoryDetailsScreen" component={StoryDetailsScreen} />
      <Stack.Screen
        name="MasterTapWallpapers"
        component={MasterTapWallpapers}
      />
      <Stack.Screen
        name="WallpaperPreviewScreen"
        component={WallpaperPreviewScreen}
      />
      <Stack.Screen name="TinneSettings" component={TinneSettings} />

      <Stack.Screen name="Mastrduogmscrn" component={Mastrduogmscrn} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default TapMasterNavigation;
