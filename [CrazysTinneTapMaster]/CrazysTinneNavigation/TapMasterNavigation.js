import { createStackNavigator } from '@react-navigation/stack';

import CrazysOnboarding from '../TapMasterScreens/CrazysOnboarding';
import TinneTapHome from '../TapMasterScreens/TinneTapHome';
import WelcomeTapLoader from '../TapMasterScreens/WelcomeTapLoader';
import TapGameScreen from '../TapMasterScreens/TapGameScreen';
import TapMasterStories from '../TapMasterScreens/TapMasterStories';
import StoryDetailsScreen from '../TapMasterScreens/StoryDetailsScreen';
import MasterTapWallpapers from '../TapMasterScreens/MasterTapWallpapers';
import WallpaperPreviewScreen from '../TapMasterScreens/WallpaperPreviewScreen';
import TinneSettings from '../TapMasterScreens/TinneSettings';

const Stack = createStackNavigator();

const TapMasterNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeTapLoader" component={WelcomeTapLoader} />
      <Stack.Screen name="CrazysOnboarding" component={CrazysOnboarding} />
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
    </Stack.Navigator>
  );
};

export default TapMasterNavigation;
