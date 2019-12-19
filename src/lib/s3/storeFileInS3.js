import { Storage } from 'aws-amplify';

export default async (fileUri, imgKey, level='public', identityId) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    try {
      const { name, type } = blob._data;
      const options = {
        level: level,
        contentType: type
      };
      const result = await Storage.put(imgKey, blob, options);
      return result;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};
