import { describe, expect, it } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../utils/setup'

describe('Debug get all', () => {
  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`No data in database`, async () => {
        const res = await supertest(app).get(`/articles/trashed`).send();

        console.log('res.body')
        console.log(res.body)

        expect(res.status).toEqual(204)
      });
    });

    //describe('Incorrect data', () => {
    //});
  });

  //describe('Should pass', () => {
  //});
});
