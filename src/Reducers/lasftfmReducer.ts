import {v4} from 'uuid';
import * as Immutable from 'immutable';
import {MNode, YoutubeResult} from '../types';

interface Item {
  name: string;
  image?: string;
}

const mapItem = (item: Item) => ({
  id: v4(),
  text: item.name,
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
  console.log(album.image);
  return {
    ...item,
    type: 'album',
    artistName: artistNode.get('artistName'),
    artistImage: artistNode.get('artistImage'),
    albumName: album.name,
    albumImage: album.image,
  };
};

const mapTrack = (albumNode: any, track: Item) => {
  const item = mapItem(track);
  return {
    ...item,
    type: 'track',
    artistName: albumNode.get('artistName'),
    artistImage: albumNode.get('artistImage'),
    albumName: albumNode.get('albumName'),
    albumImage: albumNode.get('albumImage'),
    child: [],
    trackName: track.name,
  };
};

const specialNode = (artistName: string) => {
  const item = mapItem({name: 'Similar'});
  return {
    ...item,
    artistName,
    type: 'similar_artist',
    isSpecial: true,
  };
};

export default function lastfmReducer(nodes: Immutable.List<MNode>, action: any) {
  if (action.type === 'loaded') {
    let selectedNode = nodes.getIn(action.selectionPath);
    const mappers = {
      artist: (item: Item) => mapArtist(item),
      album: (item: Item) => mapAlbum(selectedNode, item),
      track: (item: Item) => mapTrack(selectedNode, item),
    };
    const firstNodes = action.itemType === 'album' ? [specialNode(selectedNode.get('artistName'))] : [];
    const mappedItems = firstNodes.concat(action.nodes.map(mappers[action.itemType]));
    return nodes.updateIn(action.selectionPath, node => node.merge({child: mappedItems}));
  }

  return nodes;
}