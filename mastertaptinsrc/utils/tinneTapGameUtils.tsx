import AsyncStorage from '@react-native-async-storage/async-storage';

// game utils

export const getNumber = async (key: string): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value ? Number(value) : 0;
  } catch (error) {
    console.error(`Error getNum`, error);

    return 0;
  }
};

export const setNumber = async (key: string, value: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (error) {
    console.error(`Error setNum`, error);
  }
};

export const incrementNumber = async (
  key: string,
  step = 1,
): Promise<number> => {
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

export const getArray = async (key: string): Promise<any[]> => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('err getArr', error);
    return [];
  }
};

export const setArray = async (key: string, array: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(array));
  } catch (error) {
    console.error(`Error setArr`, error);
  }
};

export const spendClocks = async (amount: number): Promise<number | false> => {
  const clocks = await getNumber('TIME_CLOCKS');
  if (clocks < amount) return false;

  await AsyncStorage.setItem('TIME_CLOCKS', String(clocks - amount));
  return clocks - amount;
};

// toggle story

const SAVED_KEY = 'SAVED_STORIES';

export const getSavedStories = async () => {
  const data = await AsyncStorage.getItem(SAVED_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStory = async (storyId: string): Promise<void> => {
  const saved = await getSavedStories();
  if (!saved.includes(storyId)) {
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...saved, storyId]));
  }
};

export const removeStory = async (storyId: string): Promise<void> => {
  const saved = await getSavedStories();
  const updated = saved.filter(id => id !== storyId);
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
};

export const isStorySaved = async (storyId: string): Promise<boolean> => {
  const saved = await getSavedStories();
  return saved.includes(storyId);
};
