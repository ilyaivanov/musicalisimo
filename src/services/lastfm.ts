import {requestGet} from './request';
import {usingLastfm} from '../featureFlags';
import {findAlbumsById, findArtistsMusicbrainz} from './musicbrainz';

// tslint:disable-next-line
let api_key = '185032d80f1827034396b9acfab5a79f';
let format = 'json';
let url = `https://ws.audioscrobbler.com/2.0`;

interface Image {
  size: string;
  '#text': string;
}
export interface ResponseItem {
  name: string;
  listeners?: number;
  playcount?: number;
}

const mapItem = (item: ResponseItem) => ({
  name: item.name,
  listeners: item.listeners || item.playcount,
});

export const findArtistsLastfm = (term: string): Promise<ResponseItem> => {
  console.log(`last.fm search request for ${term}`);
  let method = 'artist.search';
  return requestGet(url, {method, api_key, format, artist: term})
    .then(response => response.results.artistmatches.artist.map(mapItem));
};

export const findArtists: Function = usingLastfm ? findArtistsLastfm : findArtistsMusicbrainz;

export function findAlbumsLastfm(artistName: string) {
  console.log(`last.fm albums request for ${artistName}`);
  let method = 'artist.getTopAlbums';
  return requestGet(url, {method, api_key, format, artist: artistName})
    .then(response => response.topalbums.album.map(mapItem));
}
export function findAlbums(artistNode: any) {
  const artistName = artistNode.get('artistName');
  if (usingLastfm) {
    return findAlbumsLastfm(artistName);
  } else {
    const id = artistNode.get('artist').get('id');
    return findAlbumsById(id);
  }
}

export function findSimilar(artistName: string) {
  console.log(`last.fm getSimilar request for ${artistName}`);
  let method = 'artist.getSimilar';
  return requestGet(url, {method, api_key, format, artist: artistName, limit: 25})
    .then(response => response.similarartists.artist.map(mapItem));
}

export function findTopTracks(artistName: string) {
  console.log(`last.fm getSimilar request for ${artistName}`);
  let method = 'artist.getTopTracks';
  return requestGet(url, {method, api_key, format, artist: artistName, limit: 25})
    .then(response => response.toptracks.track.map(mapItem));
}

export function findTracks(artistName: string, albumName: string) {
  console.log(`last.fm tracks request for ${artistName} - ${albumName}`);
  let method = 'album.getInfo';
  return requestGet(url, {method, api_key, format, artist: artistName, album: albumName})
    .then(response => mapAlbumInfo(response.album));
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
function getImage(images: Image[] = []): string {
  let large = images.filter(i => i.size === 'medium');
  return large.length > 0 ? large[0]['#text'] : '';
}

function mapTrack(track: any) {
  return {
    name: track.name,
    id: track.url,
    duration: track.duration
  };
}