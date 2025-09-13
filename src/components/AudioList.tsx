import { View, Text, FlatList } from 'react-native';
import React from 'react';

import { Audio, AudioListProbs } from '../modal/AppModal';
import AudioItem from './AudioItem';

const AudioList: React.FC<AudioListProbs> = ({ audioList }) => {
  return (
    <View>
      <FlatList
        style={{ paddingHorizontal: 12, marginTop: 12 }}
        data={audioList}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => <AudioItem {...(item as Audio)} />}
      />
    </View>
  );
};

export default AudioList;
