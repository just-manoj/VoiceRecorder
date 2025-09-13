import { StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AudioList from './src/components/AudioList';
import { audioList } from './src/data';
import { colors } from './src/const/Colors';
import Header from './src/components/Header';
import styles from './src/styles/AppStyles';

const App = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <Header />
        <AudioList audioList={audioList} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
