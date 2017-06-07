import * as _ from 'lodash';
import {requestGet} from './request';

const log = (x: any) => {
  console.log(x);
  return x;
};

export default function findYoutubeVideo(artistName: string, albumName?: string) {
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
}
interface YoutubeVid {
  id: {
    kind: string,
    videoId: string,
  };
  snippet: {
    title: string,
  };
}

function mapVideos(items: YoutubeVid[], searchCriteria: string) {
  const videos = items.filter(i => i.id.kind === 'youtube#video');
  if (_.isEmpty(videos)) {
    throw new Error('Could not find any videos at youtube. Search criteria: ' + JSON.stringify(searchCriteria));
  }
  const firstVideo = videos[0];
  return {
    id: firstVideo.id.videoId,
    title: firstVideo.snippet.title
  };
}