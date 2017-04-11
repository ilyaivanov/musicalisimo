import { v4 } from 'uuid';
import { lookForAlbums, lookForSimilarArtists, lookForTracks } from "./actions";

const mapItem = item => ({
  id: v4(),
  text: item.name,
  duration: item.duration,
});

const mapArtist = artist => {
  const item = mapItem(artist);
  return {
    ...item,
    onOpen: () => lookForAlbums(item.text, item.id)
  };
};

const mapAlbum = (artist, album) => {
  const item = mapItem(album);
  return {
    ...item,
    onOpen: () => lookForTracks(artist.text, item.text, item.id)
  };
};

const specialNode = (artistName) => ({
  id: v4(),
  text: 'Similar',
  isSpecial: true,
  onOpen: function () {
    return lookForSimilarArtists(artistName, this.id)
  }
});

export default function lastfmReducer(nodes, flattenNodes, action) {
  if (action.type === 'search_done') {
    return action.artists.map(mapArtist);
  }

  if (action.type === 'loaded') {
    const target = flattenNodes.find(node => node.id === action.id);
    target.isLoading = false;

    const items = action.items.map(item => mapAlbum(target, item));
    const childs = action.itemType === 'album' ?
      [specialNode(target.text, )].concat(items) :
      items;

    target.child = childs;
    return nodes;
  }
  return nodes;
}