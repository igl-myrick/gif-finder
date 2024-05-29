export default class GIFService {
  static getGIFs(requestURL, query) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = requestURL;
      request.addEventListener("loadend", function() {
        const response = JSON.parse(this.responseText);
        if (this.status === 200) {
          resolve([response, query]);
        } else {
          reject([this, response]);
        }
      });
      request.open("GET", url, true);
      request.send();
    });
  }
}