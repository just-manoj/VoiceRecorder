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
import BackgroundTimer from 'react-native-background-timer';

import {
  addRecordDb,
  connectToDatabase,
  createTables,
  geAllRecordsDb,
} from '../util/Database';
import { Audio, PlayerData, RecorderData } from '../modal/AppModal';
import { moveToDocuments } from '../util/FileSystem';

const AppViewModal = () => {
  let backgroundInterval: number | null = null;

  Sound.addRecordBackListener((e: RecordBackType) => {
    if (e.currentMetering !== undefined) {
      if (e.currentMetering < -100) {
        setSilenceCounter(prev => prev + 1);
      }

      const formatted2 = Sound.mmss(Math.floor(e.currentPosition / 1000));
      setRecorderData(prev => ({ ...prev, duration: formatted2 }));

      if (silenceCounter >= 3) {
        setRecorderData(prev => ({ ...prev, isRecording: false }));
        pauseRecording(false);

        if (!backgroundInterval) {
          backgroundInterval = BackgroundTimer.setInterval(() => {
            if (!manualPause && silenceCounter >= 3) {
              try {
                resumeRecording();
                setSilenceCounter(0);

                // stop background loop once resumed
                if (backgroundInterval) {
                  BackgroundTimer.clearInterval(backgroundInterval);
                  backgroundInterval = null;
                }
              } catch (err) {
                console.log(err);
              }
            }
          }, 1000);
        }
      }
    }
  });

  Sound.addPlaybackEndListener(e => {
    setPlayerData({
      isPlaying: false,
      id: -1,
    });
  });

  const dbConnection = useRef<SQLiteDatabase | null>(null);

  const [recordList, setRecordList] = useState<Audio[]>([]);
  const [recorderModalShown, setRecorderModalShown] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [silenceCounter, setSilenceCounter] = useState(0);
  const [managePermission, setManagePermission] = useState<{
    mic: boolean;
    storage: boolean;
  }>({
    mic: false,
    storage: false,
  });
  const [recorderData, setRecorderData] = useState<RecorderData>({
    isRecording: false,
    id: -1,
    fileName: '',
    filePath: '',
    duration: '00:00',
    createdAt: '',
  });
  const [playerData, setPlayerData] = useState<PlayerData>({
    isPlaying: false,
    id: -1,
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
    Sound.pausePlayer();
    setPlayerData({
      id: -1,
      isPlaying: true,
    });
    setManualPause(() => false);
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

    await Sound.startRecorder(undefined, audioSet, meteringEnabled);
    setManualPause(() => false);
    setRecorderData(prev => ({ ...prev, isRecording: true }));
  };

  const pauseRecording = async (isManualPause: boolean) => {
    if (isManualPause) {
      setManualPause(() => true);
    } else {
      setManualPause(() => false);
    }
    await Sound.pauseRecorder();
    setRecorderData(prev => ({ ...prev, isRecording: false }));
    setSilenceCounter(() => 0);
  };

  const resumeRecording = async () => {
    setSilenceCounter(() => 0);
    setManualPause(() => false);
    await Sound.resumeRecorder();
    setRecorderData(prev => ({ ...prev, isRecording: true }));
  };

  const stopRecording = async () => {
    setSilenceCounter(() => 0);
    setManualPause(() => false);
    const result = await Sound.stopRecorder();
    Sound.removeRecordBackListener();
    const newPath = await moveToDocuments(result);
    setRecorderData(prev => ({
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
      ...recorderData,
      createdAt,
      filePath,
      fileName,
    });
    if (result[0].insertId) {
      changeRecorderModalState();
      setRecorderData(() => ({
        isRecording: false,
        id: -1,
        fileName: '',
        filePath: '',
        duration: '00:00',
        createdAt: '',
      }));
    }
  };

  const playAudioHandler = (audioData: Audio) => {
    if (audioData.id === playerData.id) {
      if (playerData.isPlaying) {
        Sound.pausePlayer();
        setPlayerData({
          id: audioData.id,
          isPlaying: false,
        });
        return;
      } else {
        Sound.resumePlayer();
      }
    } else {
      Sound.startPlayer(audioData.filePath);
    }
    setPlayerData({
      id: audioData.id,
      isPlaying: true,
    });
  };

  return {
    recorderModalShown,
    changeRecorderModalState,
    requestAndroidPermissions,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    recorderData,
    getAllRecords,
    addNewRecord,
    recordList,
    connectToTable,
    playerData,
    playAudioHandler,
  };
};

export default AppViewModal;
