import type Mongo from '../connections/mongoose/index.js';
import type http from 'http';

export default class State {
  private static _mongo: Mongo | undefined = undefined;
  private static _server: http.Server | undefined = undefined;

  static get mongo(): Mongo {
    return this._mongo!;
  }

  static set mongo(val: Mongo) {
    this._mongo = val;
  }

  static get server(): http.Server {
    return this._server!;
  }

  static set server(val: http.Server) {
    this._server = val;
  }
}
