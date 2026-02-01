import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localStorage only when it exists (web); React Native has no localStorage
const hasLocalStorage = typeof localStorage !== 'undefined';

const storage = {
    getItem: async (key: string) => {
        if (hasLocalStorage) {
            return localStorage.getItem(key);
        }
        return await AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        if (hasLocalStorage) {
            localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    },
    removeItem: async (key: string) => {
        if (hasLocalStorage) {
            localStorage.removeItem(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    },
};

export default storage;
