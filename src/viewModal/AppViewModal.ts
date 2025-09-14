import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { useRef, useState } from 'react';
import Sound, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  RecordBackType,
  AVModeIOSOption,
  AudioSet,
} from 'react-native-nitro-sound';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

import {
  addRecordDb,
  connectToDatabase,
  createTables,
  geAllRecordsDb,
} from '../util/Database';
import { Audio, PlayerData } from '../modal/AppModal';
import { moveToDocuments } from '../util/FileSystem';

const AppViewModal = () => {
  Sound.addRecordBackListener((e: RecordBackType) => {
    const formatted2 = Sound.mmss(Math.floor(e.currentPosition / 1000));
    setPlayerData(prev => ({ ...prev, duration: formatted2 }));
  });

  const dbConnection = useRef<SQLiteDatabase | null>(null);

  const [recordList, setRecordList] = useState<Audio[]>([]);
  const [recorderModalShown, setRecorderModalShown] = useState(false);
  const [managePermission, setManagePermission] = useState<{
    mic: boolean;
    storage: boolean;
  }>({
    mic: false,
    storage: false,
  });
  const [playerData, setPlayerData] = useState<PlayerData>({
    isRecording: false,
    id: -1,
    fileName: '',
    filePath: '',
    duration: '00:00',
    createdAt: '',
  });

  const changeRecorderModalState = () => {
    if (managePermission.mic && managePermission.storage) {
      if (!recorderModalShown) {
        startRecording();
      } else {
        getAllRecords(dbConnection.current);
      }
      setRecorderModalShown(() => !recorderModalShown);
    } else {
      Alert.alert(
        'Permission Error',
        'Please allow mic and storage permission',
      );
    }
  };

  const requestAndroidPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

        if (Platform.Version >= 33) {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
        } else {
          permissions.push(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const audioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
          PermissionsAndroid.RESULTS.GRANTED;

        const storageGranted =
          Platform.Version >= 33
            ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO] ===
              PermissionsAndroid.RESULTS.GRANTED
            : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
                PermissionsAndroid.RESULTS.GRANTED;

        if (audioGranted) {
          setManagePermission(prev => ({ ...prev, mic: true }));
        }

        if (storageGranted) {
          setManagePermission(prev => ({ ...prev, storage: true }));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const startRecording = async () => {
    const audioSet: AudioSet = {
      AVSampleRateKeyIOS: 44100,
      AVFormatIDKeyIOS: 'aac',
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVModeIOS: 'measurement' as AVModeIOSOption,
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AudioSamplingRate: 44100,
      AudioEncodingBitRate: 128000,
      AudioChannels: 1,
    };

    const meteringEnabled = true; 

    await Sound.startRecorder(
      undefined, 
      audioSet,
      meteringEnabled,
    );

    setPlayerData(prev => ({ ...prev, isRecording: true }));
  };

  const pauseRecording = async () => {
    await Sound.pauseRecorder();
    setPlayerData(prev => ({ ...prev, isRecording: false }));
  };

  const resumeRecording = async () => {
    await Sound.resumeRecorder();
    setPlayerData(prev => ({ ...prev, isRecording: true }));
  };

  const stopRecording = async () => {
    const result = await Sound.stopRecorder();
    Sound.removeRecordBackListener();
    const newPath = await moveToDocuments(result);
    setPlayerData(prev => ({
      ...prev,
      isRecording: false,
      createdAt: new Date().toString(),
      filePath: newPath ?? '',
      fileName: newPath?.split('/').pop() ?? '',
    }));
    addNewRecord({
      createdAt: new Date().toString(),
      filePath: newPath ?? '',
      fileName: newPath?.split('/').pop() ?? '',
    });
  };

  const connectToTable = async () => {
    try {
      const db = await connectToDatabase();
      dbConnection.current = db;
      await createTables(db);
      getAllRecords(db);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllRecords = async (db: SQLiteDatabase | null) => {
    if (!db) {
      console.error('Database connection is not established.');
      return;
    }
    const res = await geAllRecordsDb(db);
    setRecordList(() => res);
  };

  const addNewRecord = async ({
    createdAt,
    filePath,
    fileName,
  }: {
    fileName: string;
    filePath: string;
    createdAt: string;
  }) => {
    if (!dbConnection.current) {
      return;
    }
    const result = await addRecordDb(dbConnection.current, {
      ...playerData,
      createdAt,
      filePath,
      fileName,
    });
    if (result[0].insertId) {
      changeRecorderModalState();
      setPlayerData(() => ({
        isRecording: false,
        id: -1,
        fileName: '',
        filePath: '',
        duration: '00:00',
        createdAt: '',
      }));
    }
  };

  return {
    recorderModalShown,
    changeRecorderModalState,
    requestAndroidPermissions,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    playerData,
    getAllRecords,
    addNewRecord,
    recordList,
    connectToTable,
  };
};

export default AppViewModal;
