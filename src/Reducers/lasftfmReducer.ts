import {v4} from 'uuid';
import * as Immutable from 'immutable';
import {MNode} from '../types';

interface Item {
  name: string;
}

const mapItem = (item: Item) => ({
  id: v4(),
  text: item.name
});

export const mapArtist = (artist: Item) => {
  const item = mapItem(artist);
  return {
    type: 'artist',
    artistName: item.text,
    ...item,
  };
};

const mapAlbum = (artistName: string, album: Item) => {
  const item = mapItem(album);
  return {
    ...item,
    type: 'album',
    artistName,
    albumName: album.name,
  };
};

const mapTrack = (artistName: string, albumName: string, track: Item) => {
  const item = mapItem(track);
  return {
    ...item,
    type: 'track',
    child: [],
    artistName,
    albumName,
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
      album: (item: Item) => mapAlbum(selectedNode.get('text'), item),
      track: (item: Item) => mapTrack(selectedNode.get('artistName'), selectedNode.get('albumName'), item),
    };
    const firstNodes = action.itemType === 'album' ? [specialNode(selectedNode.get('text'))] : [];
    const mappedItems = firstNodes.concat(action.nodes.map(mappers[action.itemType]));
    return nodes.updateIn(action.selectionPath, node => node.merge({child: mappedItems}));
  }

  return nodes;
}