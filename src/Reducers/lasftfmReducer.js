import { v4 } from 'uuid';

const mapItem = item => ({
  id: v4(),
  text: item.name
});

const mapArtist = artist => {
  const item = mapItem(artist);
  return {
    ...item,
  };
};

const mapAlbum = (artistName, album) => {
  const item = mapItem(album);
  return {
    ...item,
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

export default function lastfmReducer(nodes, flattenNodes, action) {
  if (action.type === 'search_done') {
    return action.artists.map(mapArtist);
  }

  if (action.type === 'loaded') {
    const target = flattenNodes.find(node => node.id === action.id);
    target.isLoading = false;

    const mappers = {
      artist: item => mapArtist(item),
      album: item => mapAlbum(target.text, item),
      track: item => mapTrack(target.artistName, target.text, item),
    };

    const items = action.items.map(mappers[action.itemType]);

    const childs = action.itemType === 'album' ?
      [specialNode(target.text,)].concat(items) :
      items;

    target.child = childs;
    return nodes;
  }
  return nodes;
}