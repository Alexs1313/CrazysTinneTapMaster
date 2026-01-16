import { NavigationContainer } from '@react-navigation/native';
import TapMasterNavigation from './[CrazysTinneTapMaster]/CrazysTinneNavigation/TapMasterNavigation';
import { StoreProvider } from './[CrazysTinneTapMaster]/MasterStore/tinneContext';

const App = () => {
  return (
    <NavigationContainer>
      <StoreProvider>
        <TapMasterNavigation />
      </StoreProvider>
    </NavigationContainer>
  );
};

export default App;
