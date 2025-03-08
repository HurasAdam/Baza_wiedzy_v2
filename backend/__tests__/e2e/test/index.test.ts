import { describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import { MissingArgError } from '../../../src/errors';
import { createAccessToken, createCookie } from '../../utils/index.js';
import { app } from '../../utils/setup.js';
import type { IFullError } from '../../../src/types';

describe('Get one article', () => {
  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing article id', async () => {
        const target = new MissingArgError('articleId');

        const res = await supertest(app)
          .get('/articles/trashed')
          .set('Cookie', createCookie('accessToken', createAccessToken()))
          .send();

        const body = res.body as IFullError;

        expect(body.message).toEqual(target.message);
        expect(body.errorCode).toEqual(target.errorCode);
        expect(res.status).toEqual(target.statusCode);
      });
    });

    // describe('Incorrect data', () => {
    // });
  });

  // describe('Should pass', () => {
  // });
});
