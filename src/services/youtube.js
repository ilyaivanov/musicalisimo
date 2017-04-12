import {requestGet} from './request';

export default function findYoutubeVideo(artistName, albumName) {
  var options = {
    part: 'snippet',
    chart: 'mostPopular',
    key: 'AIzaSyBsCL-zrXWd9S2FKRSDVfz7dOo783LQkLk',
    q: `${artistName} - ${albumName}`
  };

  return requestGet('https://www.googleapis.com/youtube/v3/search', options)
    .then(response => mapVideo(response.items[0]));
}

function mapVideo(video) {
  return {
    id: video.id.videoId,
    title: video.snippet.title
  }
}