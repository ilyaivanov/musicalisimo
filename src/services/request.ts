let createRequest = () => new XMLHttpRequest();

export function stringifyOptions(options: {}) {
  let res: string[] = [];

  for (let key of Object.keys(options)) {
    res.push(key + '=' + options[key]);
  }
  return res.join('&');
}

type f = (a: any) => void;

export function requestGet(url: string, options: {} = {}) {
  return new Promise(function (resolve: f, reject: f) {
    let xhr = createRequest();
    xhr.open('GET', url + '?' + stringifyOptions(options));

    xhr.onload = function () {
      const that: any = this;
      if (that.status >= 200 && that.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: that.status,
          statusText: xhr.statusText
        });
      }
    };

    xhr.onerror = function () {
      const that: any = this;
      reject({
        status: that.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}
