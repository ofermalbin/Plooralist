import { Storage } from 'aws-amplify';

export default async (fileUri, awsKey, access = "public") => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    try {
      const { name, type } = blob._data;
      const options = {
        level: access,
        contentType: type
      };
      const key = awsKey || name;
      const result = await Storage.put(key, blob, options);
      return {
        access,
        key: result.key
      };
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};
