interface ReleaseGroup {
  'secondary-type-ids': string[];
  title: string;
  'secondary-types': string[];
  'primary-type-id': string;
  id: string;
  'primary-type': string;
  disambiguation: string;
  'first-release-date': string;
}

export interface MusicbrainzAlbumsResponse {
  'release-group-offset': number;
  'release-groups': ReleaseGroup[];
  'release-group-count': number;
}

export interface Area {
  id: string;
  name: string;
  'sort-name': string;
}

export interface LifeSpan {
  begin: string;
  ended?: any;
}

export interface Tag {
  count: number;
  name: string;
}

export interface Artist {
  id: string;
  type: string;
  score: string;
  name: string;
  'sort-name': string;
  country: string;
  area: Area;
  disambiguation: string;
  'life-span': LifeSpan;
  gender: string;
  tags: Tag[];
}

export interface ArtistSearchResult {
  created: Date;
  count: number;
  offset: number;
  artists: Artist[];
}

