export interface MNode {
  id: string;
  type: string;
  child: MNode[];
  isSelected: boolean;
  isEditing: boolean;
  isSpecial: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  isHidden: boolean;
  text: string;
}

export interface AppState {
  search: any;
  favorites: any;
}

export interface Action {
  type: string;
}

export type Path = (number | string)[];

export type GetState = () => AppState;