import { Storage } from 'aws-amplify';

import FastImage from 'react-native-fast-image';
import URL from 'url';

import aws_exports from '../../aws-exports';

export default async (fileUri, imgKey, level="public", identityId) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    try {
      const { name, type } = blob._data;
      const options = {
        level: level,
        contentType: type
      };
      const key = imgKey || name;
      const result = await Storage.put(key, blob, options);
      const uri = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/${level}/${(level != 'public') ? identityId : ''}${(level != 'public') ? '/' : ''}${imgKey}`;
      FastImage.preload([{
          uri: uri,
      }])
      return result;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};
