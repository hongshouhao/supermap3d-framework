import axios from 'axios';
export function proxy(url, callback) {
  return axios.get(url).then(function (response) {
    if (callback) {
      callback(response.data);
    }

    var blob = new Blob([JSON.stringify(response.data)], {
      type: 'application/json',
    });

    let url = window.URL.createObjectURL(blob);
    return url;
  });
}
