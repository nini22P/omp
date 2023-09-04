export interface PlayerStatus {
  playStatu: 'paused' | 'playing' | 'waiting';
  cover: string;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

export interface PlayerAction {
  updatePlayStatu: (isPlaying: PlayerStatus['playStatu']) => void;
  updateCover: (cover: PlayerStatus['cover']) => void;
  updateCurrentTime: (currentTime: PlayerStatus['currentTime']) => void;
  updateDuration: (duration: PlayerStatus['duration']) => void;
  updateShuffle: (shuffle: PlayerStatus['shuffle']) => void;
  updateRepeat: (loop: PlayerStatus['repeat']) => void;
}