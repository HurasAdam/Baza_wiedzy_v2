import { afterAll, beforeAll } from '@jest/globals';
import http from 'http'
import server from '../../src/server/index'
import express from 'express'

  const app = express()
  let httpServer: http.Server | undefined

beforeAll(async () => {
  httpServer = server(app)
});

afterAll(async () => {
  httpServer?.close()
});

export { app, httpServer };
