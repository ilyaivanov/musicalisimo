interface Base {
  mbid: string;
}

interface Artist extends Base {
  name: string;
  image: string;
}

interface Album extends Base {
  name: string;
  image: string;
}

interface Track extends Base {
  name: string;
}