import isEmpty  from 'lodash/isEmpty';
import { requestGet } from './request';

const log = x => {
  console.log(x);
  return x;
};

export default function findYoutubeVideo(artistName, albumName) {
  const q = `${artistName} - ${albumName}`;
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

function mapVideos(items, searchCriteria) {
  const videos = items.filter(i => i.id.kind === 'youtube#video');
  if (isEmpty(videos)) {
    throw new Error('Could not find any videos at youtube. Search criteria: ' + JSON.stringify(searchCriteria))
  }
  const firstVideo = videos[0];
  return {
    id: firstVideo.id.videoId,
    title: firstVideo.snippet.title
  }
}