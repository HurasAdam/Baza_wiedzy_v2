import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Mongo from '../../../src/connections/mongoose/index.js';
import {
  ElementTooShortError,
  IncorrectArgLengthError,
  IncorrectArgTypeError,
  MissingArgError,
} from '../../../src/errors/index.js';
import CreateArticlesDto from '../../../src/modules/article/subModules/create/dto.js';
import createArticles from '../../../src/modules/article/subModules/create/index.js';
import State from '../../../src/tools/state.js';
import fakeData from '../../utils/fakeData/index.json';
import { generateRandomName } from '../../utils/index.js';
import type { ICreateArticleDto } from '../../../src/modules/article/subModules/create/types.js';
import type { IFullError } from '../../../src/types/errors.js';

describe('Create article', () => {
  const baseDto: ICreateArticleDto = {
    title: 'title',
    employeeDescription: 'E Desc',
    tags: [fakeData.data.tags[0]!.id],
    clientDescription: 'C Desc',
    product: fakeData.data.products[0]!.id,
    userId: fakeData.data.users[0]!.id,
  };

  beforeAll(async () => {
    State.mongo = new Mongo();
    await State.mongo.init();
  });

  afterAll(() => {
    State.mongo.disconnect();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing title', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('title');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        delete data.title;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Missing employeeDescription', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('employeeDescription');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        delete data.employeeDescription;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Missing tags', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('tags');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        delete data.tags;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Missing clientDescription', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('clientDescription');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        delete data.clientDescription;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Missing product', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('product');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        delete data.product;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Missing userId', async () => {
        let error: IFullError | undefined = undefined;
        const target = new MissingArgError('userId');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        delete data.userId;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it('Title is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('title should be a string');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.title = 2 as unknown as string;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Title is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('title', 4, 90);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.title = '1';

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Title is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('title', 4, 90);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.title = generateRandomName(91);

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('EmployeeDescription is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('employeeDescription should be a string');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.employeeDescription = 2 as unknown as string;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('EmployeeDescription is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('employeeDescription', 6, 9000);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.employeeDescription = '1';

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('EmployeeDescription is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('employeeDescription', 6, 9000);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.employeeDescription = generateRandomName(9001);

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('ClientDescription is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('clientDescription should be a string');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.clientDescription = 2 as unknown as string;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('ClientDescription is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('clientDescription', 6, 9000);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.clientDescription = '1';

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('ClientDescription is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgLengthError('clientDescription', 6, 9000);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.clientDescription = generateRandomName(9001);

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Tags is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('tags should be array');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.tags = 2 as unknown as string[];

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Tags is string', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('tags should be array');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.tags = '2' as unknown as string[];

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Tags has no elements', async () => {
        let error: IFullError | undefined = undefined;
        const target = new ElementTooShortError('tags', 1);

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.tags = [];

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Product is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('product should be a string');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.product = 2 as unknown as string;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Product is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('product should be objectId');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.product = '1';

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('Product is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('product should be objectId');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.product = generateRandomName(25);

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('User is number', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be a string');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.userId = 2 as unknown as string;

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('User is too short', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be objectId');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.userId = '1';

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });

      it('User is too long', async () => {
        let error: IFullError | undefined = undefined;
        const target = new IncorrectArgTypeError('userId should be objectId');

        const data = structuredClone<Partial<ICreateArticleDto>>(baseDto);
        data.userId = generateRandomName(25);

        try {
          const dto = new CreateArticlesDto(data as ICreateArticleDto);
          await createArticles(dto);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error?.message).toEqual(target.message);
      });
    });
  });

  describe('Should pass', () => {
    it('Pass', async () => {
      const dto = new CreateArticlesDto(baseDto);
      const data = await createArticles(dto);

      expect(fakeData.data.article[0]!._id).not.toBeNull();
      expect(fakeData.data.article[0]!.title).toEqual(data.title);
      expect(fakeData.data.article[0]!.employeeDescription).toEqual(data.employeeDescription);
      expect(fakeData.data.article[0]!.clientDescription).toEqual(data.clientDescription);
      expect(fakeData.data.article[0]!.product.toString()).toEqual(data.product.toString());
      expect(fakeData.data.article[0]!.createdBy.toString()).toEqual(data.createdBy.toString());
      expect(fakeData.data.article[0]!.viewsCounter.toString()).toEqual(data.viewsCounter.toString());
      expect(fakeData.data.article[0]!.isTrashed).toEqual(data.isTrashed);
      expect(fakeData.data.article[0]!.isVerified).toEqual(data.isVerified);
    });
  });
});
