import { NavigationContainer } from '@react-navigation/native';
import TapMasterNavigation from './mastertaptinsrc/mastertaptinrouts/TapMasterNavigation';
import { StoreProvider } from './mastertaptinsrc/mastertaptinstorage/tinneContext';

const Mastrcorreapp = () => {
  return (
    <NavigationContainer>
      <StoreProvider>
        <TapMasterNavigation />
      </StoreProvider>
    </NavigationContainer>
  );
};

export default Mastrcorreapp;
