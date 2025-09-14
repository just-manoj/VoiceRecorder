import * as RNFS from '@dr.pogodin/react-native-fs';
import { dateTimeFormat2 } from './DateFormat';

export const moveToDocuments = async (filePath: string) => {
  const destPath = `${
    RNFS.DocumentDirectoryPath
  }/Voice Recording ${dateTimeFormat2(new Date().toString())}.m4a`;
  try {
    await RNFS.moveFile(filePath.replace('file://', ''), destPath);
    return destPath;
  } catch (err) {
    console.error('Move failed:', err);
  }
};
