export declare module SearchResponse {

  export interface Image {
    '#text': string;
    size: string;
  }

  export interface Artist {
    name: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    image: Image[];
  }

  export interface Artistmatches {
    artist: Artist[];
  }

  export interface Results {
    artistmatches: Artistmatches;
  }

  export interface RootObject {
    results: Results;
  }

}

export declare module AlbumsResponse {

  export interface Artist {
    name: string;
    mbid: string;
    url: string;
  }

  export interface Image {
    '#text': string;
    size: string;
  }

  export interface Album {
    name: string;
    playcount: number;
    mbid: string;
    url: string;
    artist: Artist;
    image: Image[];
  }

  export interface Topalbums {
    album: Album[];
  }

  export interface RootObject {
    topalbums: Topalbums;
  }

}

export declare module TracksResponse {

  export interface Image {
    '#text': string;
    size: string;
  }

  export interface Attr {
    rank: string;
  }

  export interface Streamable {
    '#text': string;
    fulltrack: string;
  }

  export interface Artist {
    name: string;
    mbid: string;
    url: string;
  }

  export interface Track {
    name: string;
    url: string;
    duration: string;
    '@attr': Attr;
    streamable: Streamable;
    artist: Artist;
  }

  export interface Tracks {
    track: Track[];
  }

  export interface Tags {
    tag: any[];
  }

  export interface Album {
    name: string;
    artist: string;
    mbid: string;
    url: string;
    image: Image[];
    listeners: string;
    playcount: string;
    tracks: Tracks;
    tags: Tags;
  }

  export interface RootObject {
    album: Album;
  }

}

