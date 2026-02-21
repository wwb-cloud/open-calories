import AsyncStorage from '@react-native-async-storage/async-storage';

export type Gender = 'male' | 'female';

export interface UserProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: Gender;
}

const PROFILE_KEY = 'user_profile';

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading profile:', error);
    return null;
  }
};

export const calculateBMR = (profile: UserProfile): number => {
  const { age, weight, height, gender } = profile;
  // Mifflin-St Jeor Equation
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  
  return Math.round(bmr);
};
