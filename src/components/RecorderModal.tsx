import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../const/Colors';
import { RecorderModalProbs } from '../modal/AppModal';
import styles from '../styles/RecorderModalStyles';

const RecorderModal: React.FC<RecorderModalProbs> = ({
  pauseRecording,
  resumeRecording,
  stopRecording,
  recorderData,
  changeRecorderModalState,
}) => {
  return (
    <Modal animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.secondaryContainer}>
          <TouchableOpacity
            style={{
              alignItems: 'flex-end',
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            onPress={changeRecorderModalState}
          >
            <Ionicons
              name={'close'}
              size={30}
              color={colors.black}
              style={{
                padding: 5,
              }}
            />
          </TouchableOpacity>
          <View style={styles.mainContainer}>
            <View style={styles.durationContainer}>
              <Text style={styles.duration}>{recorderData.duration}</Text>
            </View>
            <View style={styles.controllerContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (recorderData.isRecording) {
                    pauseRecording(true);
                  } else {
                    resumeRecording();
                  }
                }}
              >
                <Ionicons
                  name={recorderData.isRecording ? 'pause' : 'play'}
                  size={40}
                  color={colors.black}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={stopRecording}>
                <Ionicons
                  name="stop"
                  size={40}
                  color={colors.black}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RecorderModal;
