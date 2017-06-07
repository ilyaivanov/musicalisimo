import * as Immutable from 'immutable';

export interface MNode {
  id: string;
  type: string;
  child: MNode[];
  listeners?: number;
  duration?: number;
  isSelected: boolean;
  isContext: boolean;
  isEditing: boolean;
  isSpecial: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  isHidden: boolean;
  image: string;
  text: string;
}

export interface Tab {
  isFocused: boolean;
  nodes: Immutable.List<MNode>;
}

export interface YoutubeResult {
  id: string;
  title: string;
}

export interface AppState {
  search: Tab;
  favorites: Tab;
}

export interface Action {
  type: string;
}

export type Path = (number | string)[];

export type GetState = () => AppState;