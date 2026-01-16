import AsyncStorage from '@react-native-async-storage/async-storage';

// game utils

export const getNumber = async key => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value ? Number(value) : 0;
  } catch (error) {
    console.error(`Error getNum`, error);

    return 0;
  }
};

export const setNumber = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (error) {
    console.error(`Error setNum`, error);
  }
};

export const incrementNumber = async (key, step = 1) => {
  try {
    const current = await getNumber(key);

    const next = current + step;

    await setNumber(key, next);

    return next;
  } catch (error) {
    console.error(`Error increment`, error);

    throw error;
  }
};

// stories utils

export const getArray = async key => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('err getArr', error);
    return [];
  }
};

export const setArray = async (key, array) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(array));
  } catch (error) {
    console.error(`Error setArr`, error);
  }
};

export const spendClocks = async amount => {
  const clocks = await getNumber('TIME_CLOCKS');
  if (clocks < amount) return false;

  await AsyncStorage.setItem('TIME_CLOCKS', String(clocks - amount));
  return clocks - amount;
};
