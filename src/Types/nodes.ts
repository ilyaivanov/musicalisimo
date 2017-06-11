interface Base {
  id: string;
}

interface ArtistNode extends Base {
  type: 'artist';
  text: string;
  image: string;
  info: Artist;
}

interface AlbumNode extends Base {
  type: 'album';
  text: string;
  image: string;
  info: Album;
}

interface TrackNode extends Base {
  type: 'track';
  text: string;
  info: Track;
}

interface SimilarArtistsNode extends Base {
  type: 'similar_artists';
  text: string;
}

export type Node = ArtistNode | AlbumNode | TrackNode | SimilarArtistsNode;