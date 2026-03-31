import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_SPOT_IDS_KEY = 'saved_spot_ids_v1';

export async function getSavedSpotIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_SPOT_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (Array.isArray(parsed)) {
      return parsed.filter(item => typeof item === 'string');
    }

    return [];
  } catch (error) {
    console.log('getSavedSpotIds error:', error);
    return [];
  }
}

export async function isSpotSaved(placeId: string): Promise<boolean> {
  const ids = await getSavedSpotIds();
  return ids.includes(placeId);
}

export async function saveSpot(placeId: string): Promise<string[]> {
  const ids = await getSavedSpotIds();

  if (ids.includes(placeId)) {
    return ids;
  }

  const next = [...ids, placeId];
  await AsyncStorage.setItem(SAVED_SPOT_IDS_KEY, JSON.stringify(next));
  return next;
}

export async function removeSpot(placeId: string): Promise<string[]> {
  const ids = await getSavedSpotIds();
  const next = ids.filter(id => id !== placeId);
  await AsyncStorage.setItem(SAVED_SPOT_IDS_KEY, JSON.stringify(next));
  return next;
}

export async function toggleSpot(placeId: string): Promise<boolean> {
  const ids = await getSavedSpotIds();

  if (ids.includes(placeId)) {
    const next = ids.filter(id => id !== placeId);
    await AsyncStorage.setItem(SAVED_SPOT_IDS_KEY, JSON.stringify(next));
    return false;
  }

  const next = [...ids, placeId];
  await AsyncStorage.setItem(SAVED_SPOT_IDS_KEY, JSON.stringify(next));
  return true;
}