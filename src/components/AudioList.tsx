import { View, Text, FlatList } from 'react-native';
import React from 'react';

import { Audio, AudioListProbs } from '../modal/AppModal';
import AudioItem from './AudioItem';
import { texts } from '../const/Text';
import styles from '../styles/AudioListStyles';

const AudioList: React.FC<AudioListProbs> = ({
  audioList,
  playerData,
  playAudioHandler,
}) => {
  return (
    <View style={{ flex: 0.95 }}>
      <FlatList
        style={styles.listContainer}
        data={audioList}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <AudioItem
            {...(item as Audio)}
            playerData={playerData}
            playAudioHandler={playAudioHandler}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>{texts.emptyData}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AudioList;
