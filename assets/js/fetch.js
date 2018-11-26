import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import { fetch } from 'whatwg-fetch';

const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export default function(url, options) {
  return abortableFetch(url, {
    method: 'GET',
    credentials: 'include',
    ...options
  })
    .then(checkStatus)
}

export class Fetch {
  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.controller = new window.AbortController();
    this.signal = this.controller.signal;
    this.status = 'UNSENT';
  }

  send() {
    this.status = 'LOADING';
    return new Promise((resolve, reject) => {
      abortableFetch(this.url, { method: 'GET', signal: this.signal, ...this.options })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            this.status = 'DONE';
            resolve(response);
          } else {
            this.status = 'DONE';
            reject(response);
          }
        })
        .catch(error => {
          this.status = 'DONE';
          reject(error);
        });
    });
  }

  abort() {
    this.controller.abort();
  }
}
