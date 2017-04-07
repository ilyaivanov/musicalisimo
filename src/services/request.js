let createRequest = () => new XMLHttpRequest();

export function stringifyOptions(options) {
  let res = [];

  for (let key of Object.keys(options)) {
    res.push(key + '=' + options[key]);
  }
  return res.join('&');
}

export function requestGet(url, options = {}) {
  return new Promise(function (resolve, reject) {
    let xhr = createRequest();
    xhr.open('GET', url + '?' + stringifyOptions(options));

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

//used in unit testing to mock real APIs
//found no other suitable options yet
export function setRequestCreator(creator){
  createRequest = creator;
}