// import { getFlattenList, getSelectedNodeIndex } from "./nodes";
// import { findAlbums, findArtists, findSimilar, findTracks } from "../services/lastfm";
//
// export const getSelectedNode = getState => {
//   const nodes = getState().search.isFocused ? getState().search.nodes : getState().favorites.nodes;
//   const flatNodes = getFlattenList(nodes);
//   const selectedIndex = getSelectedNodeIndex(flatNodes);
//   return flatNodes[selectedIndex];
// };
//
// export const lookForArtists = (term) => (dispatch) =>
//   findArtists(term)
//     .then(artists => dispatch({ type: 'search_done', artists }));
//
// export const lookForSimilarArtists = (artistName, id) => (dispatch) =>
//   findSimilar(artistName)
//     .then(artists => dispatch({ type: 'loaded', itemType: 'artist', items: artists, id }));
//
// export const lookForAlbums = (artist, id) => (dispatch) =>
//   findAlbums(artist)
//     .then(albums => dispatch({ type: 'loaded', itemType: 'album', id, items: albums }));
//
// export const lookForTracks = (artist, album, id) => (dispatch) =>
//   findTracks(artist, album)
//     .then(info => dispatch({ type: 'loaded', itemType: 'track', id, items: info.tracks }));
