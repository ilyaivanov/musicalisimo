import { v4 } from 'uuid';
import { fromJS } from 'immutable';

const mapItem = item => ({
  id: v4(),
  text: item.name
});

const mapArtist = artist => {
  const item = mapItem(artist);
  return {
    type: 'artist',
    ...item,
  };
};

const mapAlbum = (artistName, album) => {
  const item = mapItem(album);
  return {
    ...item,
    type: 'album',
    artistName,
    albumName: album.name,
  };
};

const mapTrack = (artistName, albumName, track) => {
  const item = mapItem(track);
  return {
    ...item,
    artistName,
    albumName,
    trackName: track.name,
  };
};

const specialNode = (artistName) => {
  const item = mapItem({ name: 'Similar' });
  return {
    ...item,
    artistName,
    isSpecial: true,
  }
};

export default function lastfmReducer(nodes, action) {
  if (action.type === 'search_done') {
    return fromJS(action.artists.map(mapArtist));
  }
  //
  if (action.type === 'loaded') {
    let selectedNode = nodes.getIn(action.selectionPath);
    const mappers = {
      artist: item => mapArtist(item),
      album: item => mapAlbum(selectedNode.get('text'), item),
      track: item => mapTrack(selectedNode.get('artistName'), selectedNode.get('albumName'), item),
    };
    console.log(action.nodes);
    const mappedItems = action.nodes.map(mappers[action.itemType]);
    return nodes.updateIn(action.selectionPath, node => node.merge({ child: mappedItems }));
  }

  return nodes;
}