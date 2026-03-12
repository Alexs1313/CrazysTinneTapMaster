import React, { createContext, useContext, useState } from 'react';

export const StoreContext = createContext(undefined);

export const useTinneStore = () => {
  return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
  const [crazysTinneVibrationEnabled, setCrazysTinneVibrationEnabled] =
    useState(false);
  const [crazysTinneMusicEnabled, setCrazysTinneMusicEnabled] = useState(false);

  const contextValues = {
    crazysTinneVibrationEnabled,
    setCrazysTinneVibrationEnabled,
    crazysTinneMusicEnabled,
    setCrazysTinneMusicEnabled,
  };

  return (
    <StoreContext.Provider value={contextValues}>
      {children}
    </StoreContext.Provider>
  );
};
