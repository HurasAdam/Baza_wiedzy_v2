import { afterAll, beforeAll } from '@jest/globals';
import express from 'express';
import server from '../../src/connections/server/index';
import type http from 'http';

const app = express();
let httpServer: http.Server | undefined;

beforeAll(() => {
  httpServer = server(app);
});

afterAll(() => {
  httpServer?.close();
});

export { app, httpServer };
