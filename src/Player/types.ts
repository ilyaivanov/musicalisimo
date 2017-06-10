import {Path, YoutubeResult} from '../types';

export module ActionNames {
  export const PLAY = 'play';
  export const PLAY_LOADED = 'play_loaded';
}

interface PlayAction {
  type: 'play';
  trackToPlayPath: Path;
  currentTrackPath: Path;
  node: any;
}

interface PlayLoadedAction {
  type: 'play_loaded';
  video: YoutubeResult;
}

export type PlayerActions = PlayAction | PlayLoadedAction;

interface PlayerStateInt {
  currentArtist: string;
  currentAlbum: string;
  currentTrack: string;
  artistImage: string;
  albumImage: string;
  video: YoutubeResult;
}

export type PlayerState = Partial<PlayerStateInt>;
