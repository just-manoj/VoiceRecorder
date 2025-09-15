export interface Audio {
  id: number;
  fileName: string;
  filePath: string;
  duration: string;
  createdAt: string;
}

export interface RecorderData extends Audio {
  isRecording: boolean;
}

export interface PlayerData {
  isPlaying: boolean;
  id: number;
}

export interface AudioListProbs {
  audioList: Audio[];
  playerData: PlayerData;
  playAudioHandler: (audioData: Audio) => void;
}

export interface MicIconProbs {
  changeRecorderModalState: () => void;
}

export interface RecorderModalProbs {
  pauseRecording: (isManualPause: boolean) => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  recorderData: RecorderData;
  changeRecorderModalState: () => void;
}

export interface AudioItemProbs extends Audio {
  playerData: PlayerData;
  playAudioHandler: (audioData: Audio) => void;
}
