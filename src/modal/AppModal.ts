export interface Audio {
  id: number;
  fileName: string;
  filePath: string;
  duration: string;
  createdAt: string;
}

export interface PlayerData extends Audio {
  isRecording: boolean;
}

export interface AudioListProbs {
  audioList: Audio[];
}

export interface MicIconProbs {
  changeRecorderModalState: () => void;
}

export interface RecorderModalProbs {
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  playerData: PlayerData;
  changeRecorderModalState: () => void;
}
