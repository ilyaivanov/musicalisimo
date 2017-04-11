import { v4 } from 'uuid';
import { lookForAlbums, lookForSimilarArtists, lookForTracks } from "./actions";

export const mapItem = item => ({
  id: v4(),
  text: item.name,
  duration: item.duration,
});

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
    return action.artists.map(ar => ({
      ...mapItem(ar),
      onOpen: function () {
        return lookForAlbums(ar.name, this.id)
      },
    }));
  }

  if (action.type === 'loaded') {
    const target = flattenNodes.find(node => node.id === action.id);
    target.isLoading = false;

    const items = action.items.map(item => ({
      ...mapItem(item),
      onOpen: function () {
        return lookForTracks(target.text, item.name, this.id)
      }
    }));
    const childs = action.itemType === 'albums' ?
      [specialNode(target.text, )].concat(items) :
      items;

    target.child = childs;
    return nodes;
  }
  return nodes;
}