import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

import { AppModule } from '../../../../app.module';
import { loadFixtures } from '../../../../config/database.loader';
import { join } from 'path';
import { AUTOMATED_TEST_JWT_SECRET } from '../../../common/controller/jwt/jwt.strategy';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { RolesType } from '../../../common/controller/roles/enum/roles.enum';
import { UpdateMovieDto } from '../dto/update-movie.dto';

describe('MovieController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(__dirname, '../../../../config/database.config.ts'),
    );

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  const adminAccessToken = jwt.sign(
    { email: 'user@example.com', role: RolesType.ADMIN },
    AUTOMATED_TEST_JWT_SECRET,
  );

  const regularAccessToken = jwt.sign(
    { email: 'user@example.com', role: RolesType.REGULAR },
    AUTOMATED_TEST_JWT_SECRET,
  );

  describe('Create', () => {
    it('Should create a movie correctly', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Star Wars Episode III',
        director: 'George Lucas',
        openingCrawl: 'A long, long time ago in a galaxy far, far away...',
        releaseDate: '2002-06-12',
      };

      return request(app.getHttpServer())
        .post('/movie')
        .auth(adminAccessToken, { type: 'bearer' })
        .send(createMovieDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toEqual({
            title: createMovieDto.title,
            director: createMovieDto.director,
            releaseDate: new Date(createMovieDto.releaseDate).toISOString(),
            openingCrawl: createMovieDto.openingCrawl,
            updatedAt: null,
            deletedAt: null,
            id: expect.any(Number),
            createdAt: expect.any(String),
          });
        });
    });

    it('Should return an error when trying to create a movie without ADMIN role', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Star Wars Episode III',
        director: 'George Lucas',
        openingCrawl: 'A long, long time ago in a galaxy far, far away...',
        releaseDate: '2002-06-12',
      };

      return request(app.getHttpServer())
        .post('/movie')
        .auth(regularAccessToken, { type: 'bearer' })
        .send(createMovieDto)
        .expect(HttpStatus.FORBIDDEN)
        .then(({ body }) => {
          expect(body.message).toEqual('Forbidden resource');
        });
    });
  });

  describe('Find All', () => {
    it('Should get all movies correctly', async () => {
      return request(app.getHttpServer())
        .get('/movie')
        .auth(regularAccessToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual([
            {
              id: 1,
              title: 'Star Wars Episode I',
              director: 'George Lucas',
              openingCrawl: 'As the war started to end...',
              releaseDate: new Date('1999-02-14 21:00:00').toISOString(),
            },
          ]);
        });
    });
  });

  describe('Get by ID', () => {
    it('Should get a specified movie by ID', async () => {
      const movieId = 1;

      return request(app.getHttpServer())
        .get(`/movie/${movieId}`)
        .auth(regularAccessToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual({
            title: 'Star Wars Episode I',
            director: 'George Lucas',
            openingCrawl: 'As the war started to end...',
            releaseDate: new Date('1999-02-14 21:00:00').toISOString(),
          });
        });
    });

    it('Should return an error if trying to get a non existing movie', async () => {
      const nonExistingMovieId = 7777;

      return request(app.getHttpServer())
        .get(`/movie/${nonExistingMovieId}`)
        .auth(regularAccessToken, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toEqual('Cannot find the requested movie');
        });
    });
  });

  describe('Edit by ID', () => {
    it('Should update a movie correctly with the given ID', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Star Wars Episode III',
        director: 'George Lucas',
        openingCrawl: 'A long, long time ago in a galaxy far, far away...',
        releaseDate: '2002-06-12',
      };

      const movieId = 1;
      return request(app.getHttpServer())
        .patch(`/movie/${movieId}`)
        .auth(adminAccessToken, { type: 'bearer' })
        .send(updateMovieDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual({
            title: updateMovieDto.title,
            director: updateMovieDto.director,
            releaseDate: new Date(updateMovieDto.releaseDate).toISOString(),
            openingCrawl: updateMovieDto.openingCrawl,
          });
        });
    });

    it('Should return an error if trying to update a movie without ADMIN role', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Star Wars Episode III',
        director: 'George Lucas',
        openingCrawl: 'A long, long time ago in a galaxy far, far away...',
        releaseDate: '2002-06-12',
      };

      const movieId = 1;
      return request(app.getHttpServer())
        .patch(`/movie/${movieId}`)
        .auth(regularAccessToken, { type: 'bearer' })
        .send(updateMovieDto)
        .expect(HttpStatus.FORBIDDEN)
        .then(({ body }) => {
          expect(body.message).toEqual('Forbidden resource');
        });
    });
  });

  describe('Delete by ID', () => {
    it('Should delete a movie correctly with the given ID', async () => {
      const movieId = 1;

      return request(app.getHttpServer())
        .delete(`/movie/${movieId}`)
        .auth(adminAccessToken, { type: 'bearer' })
        .expect(HttpStatus.ACCEPTED);
    });

    it('Should return an error if trying to delete a movie without ADMIN role', async () => {
      const movieId = 1;

      return request(app.getHttpServer())
        .patch(`/movie/${movieId}`)
        .auth(regularAccessToken, { type: 'bearer' })
        .expect(HttpStatus.FORBIDDEN)
        .then(({ body }) => {
          expect(body.message).toEqual('Forbidden resource');
        });
    });
  });
});
