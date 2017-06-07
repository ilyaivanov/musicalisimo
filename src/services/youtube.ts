import * as _ from 'lodash';
import {requestGet} from './request';
import {YoutubeResult} from '../types';

const log = (x: any) => {
  console.log(x);
  return x;
};

export const findYoutubeVideos = (artistName: string, albumName?: string): Promise<YoutubeResult[]> => {
  const q = `${artistName}${albumName ? ' - ' + albumName : ''}`;
  const options = {
    part: 'snippet',
    chart: 'mostPopular',
    key: 'AIzaSyBsCL-zrXWd9S2FKRSDVfz7dOo783LQkLk',
    q,
  };

  return requestGet('https://www.googleapis.com/youtube/v3/search', options)
    .then(log)
    .then(response => mapVideos(response.items, q));
};

export const findYoutubeVideo = (artistName: string, albumName?: string): Promise<YoutubeResult> =>
  findYoutubeVideos(artistName, albumName)
    .then(v => v[0]);

interface YoutubeVid {
  id: {
    kind: string,
    videoId: string,
  };
  snippet: {
    title: string,
  };
}

function mapVideos(items: YoutubeVid[], searchCriteria: string): YoutubeResult[] {
  const videos = items.filter(i => i.id.kind === 'youtube#video');
  if (_.isEmpty(videos)) {
    throw new Error('Could not find any videos at youtube. Search criteria: ' + JSON.stringify(searchCriteria));
  }
  return videos.map(v => ({
    id: v.id.videoId,
    title: v.snippet.title
  }));
}