import {requestGet} from './request';

// tslint:disable-next-line
let api_key = '185032d80f1827034396b9acfab5a79f';
let format = 'json';
let url = `https://ws.audioscrobbler.com/2.0`;

export function findArtists(term: string) {
  console.log(`last.fm search request for ${term}`);
  let method = 'artist.search';
  return requestGet(url, {method, api_key, format, artist: term})
    .then(response => response.results.artistmatches.artist.map(mapItem));
    // .then(artists => removeInvalidData(artists, 'artists'));
}

export function findAlbums(artistName: string) {
  console.log(`last.fm albums request for ${artistName}`);
  let method = 'artist.getTopAlbums';
  return requestGet(url, {method, api_key, format, artist: artistName})
    .then(response => response.topalbums.album.map(mapItem));
    // .then(albums => removeInvalidData(albums, 'albums'));
}

export function findInfo(artistName: string) {
  console.log(`last.fm getInfo request for ${artistName}`);
  let method = 'artist.getInfo';
  return requestGet(url, {method, api_key, format, artist: artistName})
    .then(response => mapInfo(response.artist));
}

export function findSimilar(artistName: string) {
  console.log(`last.fm getSimilar request for ${artistName}`);
  let method = 'artist.getSimilar';
  return requestGet(url, {method, api_key, format, artist: artistName, limit: 25})
    .then(response => response.similarartists.artist.map(mapItem));
}

export function findTracks(artistName: string, albumName: string) {
  console.log(`last.fm tracks request for ${artistName} - ${albumName}`);
  let method = 'album.getInfo';
  return requestGet(url, {method, api_key, format, artist: artistName, album: albumName})
    .then(response => mapAlbumInfo(response.album));
}

function mapItem(item: any) {
  return {
    name: item.name,
    listeners: item.listeners || item.playcount,
    id: item.mbid,
    image: getImage(item.image)
  };
}
const tagsFilter = tag => tag.toLowerCase().indexOf('i own') === -1;
function mapAlbumInfo(albumInfo: any) {
  return {
    tracks: albumInfo.tracks.track.map(mapTrack),
    name: albumInfo.name,
    artistName: albumInfo.artist,
    tags: albumInfo.tags.tag.map(t => t.name).filter(tagsFilter).slice(0, 2),
    image: getImage(albumInfo.image)
  };
}
function getImage(images: any[] = []) {
  let large = images.filter(i => i.size === 'medium');
  return large.length > 0 ? large[0]['#text'] : null;
}

function mapTrack(track: any) {
  return {
    name: track.name,
    id: track.url,
    duration: track.duration
  };
}
function mapInfo(info: any) {
  return {
    name: info.name,
    id: info.mbid,
    image: info.image[2]['#text'],
    tags: info.tags.tag.map((tag: any) => tag.name),
    similar: info.similar.artist.map((similar: any) => {
      let item = mapItem(similar);
      item.id = similar.url;
      return item;
    }),
  };
}

// function removeInvalidData(items: any[], setName: string, options: any = {}) {
//   let itemsWithId = items.filter(a => a.id);
//
//   // if (itemsWithId.length < items.length) {
//   //   console.log(`ignoring ${items.length - itemsWithId.length} ${setName} without id`);
//   // }
//
//   let itemsWithImage = itemsWithId;
//
//   if (!options.keepItemsWithoutImage) {
//     itemsWithImage = itemsWithId.filter(a => a.image);
//     if (itemsWithImage.length < itemsWithId.length) {
//       console.log(`ignoring ${itemsWithId.length - itemsWithImage.length} ${setName} without image`);
//     }
//   }
//
//   // let duplicated = getDuplicated(itemsWithImage, 'id');
//   // if (duplicated) {
//   //   console.log(`Found duplicated ${setName}\r\n` + duplicated);
//   //   console.log('Taking the first artist by id');
//   //   itemsWithImage = filterOutDuplicatedBy(itemsWithImage, 'id');
//   // }
//   return itemsWithImage;
// }

// function getDuplicated(items: any[], targetPropertyName: string) {
//   return _
//     .chain(items)
//     .groupBy(item => item[targetPropertyName])
//     .toPairs()
//     .filter(pair => pair[1].length > 1)
//     .map(pair => pair[0] + ' : [' + pair[1].map(i => i.name).join(', ') + ']')
//     .join('\r\n')
//     .value();
// }
//
// function filterOutDuplicatedBy(items: any[], propertyName: string) {
//   return _
//     .chain(items)
//     .groupBy(item => item[propertyName])
//     .toPairs()
//     .map(pair => pair[1][0])
//     .value();
// }