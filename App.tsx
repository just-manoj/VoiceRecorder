import { StatusBar, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AudioList from './src/components/AudioList';
import { colors } from './src/const/Colors';
import Header from './src/components/Header';
import styles from './src/styles/AppStyles';
import MicIcon from './src/components/MicIcon';
import RecorderModal from './src/components/RecorderModal';
import AppViewModal from './src/viewModal/AppViewModal';

const App = () => {
  const views = AppViewModal();

  useEffect(() => {
    views.requestAndroidPermissions();
    views.connectToTable();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <Header />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <AudioList
            audioList={views.recordList}
            playerData={views.playerData}
            playAudioHandler={views.playAudioHandler}
          />
          <MicIcon changeRecorderModalState={views.changeRecorderModalState} />
        </View>
        {views.recorderModalShown && (
          <RecorderModal
            pauseRecording={views.pauseRecording}
            resumeRecording={views.resumeRecording}
            stopRecording={views.stopRecording}
            recorderData={views.recorderData}
            changeRecorderModalState={views.changeRecorderModalState}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
