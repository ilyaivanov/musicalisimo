import {v4} from 'uuid';
import * as Immutable from 'immutable';
import {MNode, YoutubeResult} from '../types';

interface Item {
  name: string;
  listeners?: number;
  image?: string;
}

interface Track extends Item {
  duration: number;
}
const mapItem = (item: Item) => ({
  id: v4(),
  text: item.name,
  listeners: item.listeners,
});

export const mapYoutubeItem = (item: YoutubeResult) => ({
  id: v4(),
  text: item.title,
  youtubeId: item.id,
  youtubeTitle: item.title,
  type: 'youtube_video',
});

export const mapArtist = (artist: Item) => {
  const item = mapItem(artist);
  return {
    ...item,
    type: 'artist',
    artistName: item.text,
    artistImage: artist.image,
  };
};

const mapAlbum = (artistNode: any, album: Item) => {
  const item = mapItem(album);
  return {
    ...item,
    type: 'album',
    artistName: artistNode.get('artistName'),
    artistImage: artistNode.get('artistImage'),
    albumName: album.name,
    albumImage: album.image,
  };
};

const mapTrack = (albumNode: any, track: Track) => {
  const item = mapItem(track);
  return {
    ...item,
    type: 'track',
    artistName: albumNode.get('artistName'),
    artistImage: albumNode.get('artistImage'),
    albumName: albumNode.get('albumName'),
    albumImage: albumNode.get('albumImage'),
    duration: track.duration,
    trackName: track.name,
  };
};

const specialNode = (artistNode: any) => {
  const item = mapItem({name: 'Similar'});
  return {
    ...item,
    artistName: artistNode.get('artistName'),
    artistImage: artistNode.get('artistImage'),
    type: 'similar_artist',
    isSpecial: true,
  };
};
const getTopTracksNode = (artistNode: any) => {
  const item = mapItem({name: 'Top tracks'});
  return {
    ...item,
    artistName: artistNode.get('artistName'),
    artistImage: artistNode.get('artistImage'),
    albumName: 'Top 25 tracks',
    albumImage: ' source to image "TOP TRACKS"',
    type: 'artist_top_tracks',
    isSpecial: true,
  };
};

const updateAlbum = (nodes, selectionPath, {tags}) =>
  nodes.updateIn(selectionPath, node => node.merge({tags}));

export default function lastfmReducer(nodes: Immutable.List<MNode>, action: any) {
  if (action.type === 'loaded') {
    let selectedNode = nodes.getIn(action.selectionPath);
    const mappers = {
      artist: (a: any) => a.nodes.map(n => mapArtist(n)),
      album: (a: any) => a.nodes.map(n => mapAlbum(selectedNode, n)),
      track: (a: any) => a.albumDetails.tracks.map(n => mapTrack(selectedNode, n)),
    };
    const firstNodes = action.itemType === 'album' ?
      [specialNode(selectedNode), getTopTracksNode(selectedNode)] :
      [];
    const mappedItems = firstNodes.concat(mappers[action.itemType](action));
    const ns = action.itemType === 'track' ? updateAlbum(nodes, action.selectionPath, action.albumDetails) : nodes;
    return ns.updateIn(action.selectionPath, node => node.merge({child: mappedItems}));
  }

  return nodes;
}