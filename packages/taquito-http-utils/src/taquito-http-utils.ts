import { STATUS_CODE } from './status_code';

export * from './status_code';

const defaultTimeout = 30000;

interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  timeout?: number;
  query?: { [key: string]: any };
}

export class HttpResponseError implements Error {
  public name = 'HttpResponse';

  constructor(
    public message: string,
    public status: STATUS_CODE,
    public statusText: string,
    public body: string
  ) {}
}

export class HttpBackend {
  private serialize(obj?: { [key: string]: any }) {
    if (!obj) {
      return '';
    }

    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p) && obj[p]) {
        const prop = typeof obj[p].toJSON === 'function' ? obj[p].toJSON() : obj[p];
        // query arguments can have no value so we need some way of handling that
        // example https://domain.com/query?all
        if (prop === null) {
          str.push(encodeURIComponent(p));
          continue;
        }
        // another use case is multiple arguments with the same name
        // they are passed as array
        if (Array.isArray(prop)) {
          prop.forEach(item => {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(item));
          });
          continue;
        }
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(prop));
      }
    }
    const serialized = str.join('&');
    if (serialized) {
      return `?${serialized}`;
    } else {
      return '';
    }
  }

  private createXHR(): XMLHttpRequest {
    // tslint:disable: strict-type-predicates
    if (
      typeof process !== 'undefined' &&
      process.versions != null &&
      process.versions.node != null
      // tslint:enable: strict-type-predicates
    ) {
      const NodeXHR = require('xhr2-cookies').XMLHttpRequest;
      const request = new NodeXHR();
      return request;
    } else {
      return new XMLHttpRequest();
    }
  }

  /**
   *
   * @param options contains options to be passed for the HTTP request (url, method and timeout)
   */
  createRequest<T>({ url, method, timeout, query }: HttpRequestOptions, data?: {}) {
    return new Promise<T>((resolve, reject) => {
      const request = this.createXHR();
      request.open(method || 'GET', `${url}${this.serialize(query)}`);
      request.setRequestHeader('Content-Type', 'application/json');
      request.timeout = timeout || defaultTimeout;
      request.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          try {
            resolve(JSON.parse(request.response));
          } catch (ex) {
            reject(new Error(`Unable to parse response: ${request.response}`));
          }
        } else {
          reject(
            new HttpResponseError(
              `Http error response: (${this.status}) ${request.response}`,
              this.status as STATUS_CODE,
              request.statusText,
              request.response
            )
          );
        }
      };

      request.ontimeout = function() {
        reject(new Error(`Request timed out after: ${request.timeout}ms`));
      };

      request.onerror = function() {
        reject(
          new HttpResponseError(
            `Http error response: (${this.status}) ${request.response}`,
            this.status as STATUS_CODE,
            request.statusText,
            request.response
          )
        );
      };

      if (data) {
        const dataStr = JSON.stringify(data);
        request.send(dataStr);
      } else {
        request.send();
      }
    });
  }
}
