import AsyncStorage from '@react-native-community/async-storage';

const MEMORY_KEY_PREFIX = '@MemoryStorage:';
let dataMemory = {};

export default class AmplifyAuthStorage {
  static syncPromise = null;

  /**
   * This is used to set a specific item in storage
   */
  static setItem(key, value) {
    AsyncStorage.setItem(MEMORY_KEY_PREFIX + key, value, error => {
      console.log('error setting item', error);
    });
    dataMemory[key] = value;
    return dataMemory[key];
  }

  /**
   * This is used to get a specific key from storage
   */
  static getItem(key) {
    return Object.prototype.hasOwnProperty.call(dataMemory, key)
      ? dataMemory[key]
      : undefined;
  }

  /**
   * This is used to remove an item from storage
   */
  static removeItem(key) {
    AsyncStorage.removeItem(MEMORY_KEY_PREFIX + key);
    return delete dataMemory[key];
  }

  /**
   * This is used to clear the storage
   */
  static clear() {
    dataMemory = {};
    return dataMemory;
  }

  /**
   * Will sync the MemoryStorage data from AsyncStorage to storageWindow MemoryStorage
   */
  static sync() {
    if (!this.syncPromise) {
      console.log('****** sync items to memory storage!');
      this.syncPromise = new Promise((res, rej) => {
        AsyncStorage.getAllKeys((errKeys, keys) => {
          if (errKeys) {
            rej(errKeys);
          }
          const memoryKeys = keys.filter(key =>
            key.startsWith(MEMORY_KEY_PREFIX)
          );
          AsyncStorage.multiGet(memoryKeys, (err, stores) => {
            if (err) {
              rej(err);
            }
            stores.map((result, index, store) => {
              const key = store[index][0];
              const value = store[index][1];
              const memoryKey = key.replace(MEMORY_KEY_PREFIX, '');
              dataMemory[memoryKey] = value;
            });
            res();
          });
        });
      });
    }
    return this.syncPromise;
  }
}