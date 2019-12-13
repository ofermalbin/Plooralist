import { Storage } from 'aws-amplify';

import FastImage from 'react-native-fast-image';

import aws_exports from '../../aws-exports';

export default async (fileUri, awsKey, level = "public") => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    try {
      const { name, type } = blob._data;
      const options = {
        level: level,
        contentType: type
      };
      const key = awsKey || name;
      const result = await Storage.put(key, blob, options);
      const url = await Storage.get(result.key, {level: level});
      FastImage.preload([
          {
              uri: url,
              //uri: `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${result.key}`,
              //headers: { Authorization: 'someAuthToken' },
          }
      ])
      return url;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};
