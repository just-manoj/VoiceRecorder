import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Audio } from '../modal/AppModal';
import { colors } from '../const/Colors';
import styles from '../styles/AudioItemStyles';
import { dateTimeFormat } from '../util/DateFormat';

const AudioItem: React.FC<Audio> = ({ id, fileName, duration, createdAt }) => {
  return (
    <View style={styles.card} key={id}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {fileName}
        </Text>
        <Text style={styles.duration}>{duration}</Text>
        <Text style={styles.duration}>{dateTimeFormat(createdAt)}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play-circle" size={32} color={colors.green} />
      </TouchableOpacity>
    </View>
  );
};

export default AudioItem;
