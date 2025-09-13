export interface Audio {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  duration: string;
  createdAt: string;
}

export interface AudioListProbs {
  audioList: Audio[];
}
