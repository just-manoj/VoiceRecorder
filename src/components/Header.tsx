import { View, Text } from 'react-native';
import React from 'react';

import { texts } from '../const/Text';
import styles from "../styles/HeaderStyles";

const Header = () => {
  return (
    <View
      style={styles.container}
    >
      <Text
        style={styles.title}
      >
        {texts.voiceRecorder}
      </Text>
    </View>
  );
};

export default Header;
