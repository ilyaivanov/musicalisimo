import * as Immutable from 'immutable';

// level of types:

// 1. services responses - POJOs that have key properties to work on Response from Backend
// 2. core state - Immutable.js based arrays of records.
// 3. components and containers

// x. util state definitions: actions, functions, intermediate types,

export type Dispatch<T> = (t: T) => void;

export interface MNode {
  id: string;
  type: string;
  child: MNode[];
  tags?: string[];
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
  filter: string;
}

export interface Action {
  type: string;
}

export type Path = (number | string)[];

export type GetState = () => AppState;