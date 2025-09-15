import { TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../const/Colors';
import { MicIconProbs } from '../modal/AppModal';

const MicIcon: React.FC<MicIconProbs> = ({ changeRecorderModalState }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        backgroundColor: colors.white,
        justifyContent: 'center',
        flex: 0.1,
      }}
      onPress={changeRecorderModalState}
    >
      <Ionicons
        name="mic"
        size={40}
        color={colors.black}
        style={{
          elevation: 3,
          backgroundColor: colors.white,
          padding: 10,
          borderRadius: 50,
          shadowColor: colors.black,
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
        }}
      />
    </TouchableOpacity>
  );
};

export default MicIcon;
