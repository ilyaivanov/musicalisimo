import * as _ from 'lodash';
import {ArtistSearchResult, MusicbrainzAlbumsResponse} from '../Types/generated';
import {ResponseItem} from './lastfm';
import {requestGet} from './request';

const url = (entity: string) =>
  `http://musicbrainz.org/ws/2/${entity}`;

const log = (e) => {
  console.log(e);
  return e;
};

export interface Artist {
  name: string;
  mbid: string;
  disambiguation: string;
}
export interface Album {
  name: string;
  year: number;
}
const mapped = (gr: MusicbrainzAlbumsResponse): ResponseItem[] =>
  _.chain(gr['release-groups'])
    .map(g => ({
      name: g.title,
      year: +g['first-release-date'].slice(0, 4),
    }))
    .orderBy('year')
    .reverse()
    .value() as any;

export function findAlbumsById(id: string): Promise<ResponseItem[]> {
  console.log(`musicbrainz albums request for ${id}`);
  return requestGet(url('release-group'), {
    artist: id,
    type: 'album',
    fmt: 'json'
  })
    .then(x => mapped(x))
    .then(log);
}

export interface ArtistInfo {
  name: string;
  mbid: string;
  disambiguation: string;
}
// http://musicbrainz.org/ws/2/artist/?query=artist:asura&fmt=json
export const findArtists = (term: string): Promise<ArtistInfo[]> => {
  console.log(`musicbrainz artist search for ${term}`);
  return requestGet(url('artist'), {query: `artist:${term}`, fmt: 'json'})
    .then((response: ArtistSearchResult) =>
      _.chain(response.artists)
        .map(a => ({
          name: a.name,
          mbid: a.id,
          disambiguation: a.disambiguation,
        }))
        .value()
    );

};