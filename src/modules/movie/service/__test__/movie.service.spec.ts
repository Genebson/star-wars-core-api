import { Test, TestingModule } from '@nestjs/testing';

import { MovieService } from '../movie.service';
import { IMovieRepository } from '../../repository/interface/movie.repository.interface';
import { CreateMovieDto } from '../../controller/dto/create-movie.dto';
import { MovieEntity } from '../../repository/movie.entity';
import { MovieNotFoundError } from '../movie.service.error';
import { UpdateMovieDto } from '../../controller/dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: IMovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: 'MOVIE_REPOSITORY',
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<IMovieRepository>('MOVIE_REPOSITORY');
  });

  const storedMovieRepositoryResponse = {
    id: 1,
    title: 'Star Wars II',
    director: 'George Lucas',
    openingCrawl: '100 years ago...',
    releaseDate: new Date(),
  } as MovieEntity;

  describe('Create', () => {
    it('Should create a movie correctly', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Star Wars III',
        director: 'George Lucas',
        openingCrawl: '100 years ago...',
        releaseDate: '2002-04-04',
      };

      const createMovieRepositoryResponse = {
        ...createMovieDto,
        releaseDate: new Date(createMovieDto.releaseDate),
      } as MovieEntity;

      jest
        .spyOn(movieRepository, 'create')
        .mockResolvedValue(createMovieRepositoryResponse);

      const movieCreated = await movieService.create(createMovieDto);

      expect(movieRepository.create).toHaveBeenCalledWith({
        ...createMovieDto,
        releaseDate: new Date(createMovieDto.releaseDate),
      });
      expect(movieCreated).toEqual(createMovieRepositoryResponse);
    });
  });

  describe('Find all', () => {
    it('Should return a list of all the available movies', async () => {
      jest
        .spyOn(movieRepository, 'findAll')
        .mockResolvedValue([storedMovieRepositoryResponse]);

      const movies = await movieService.findAll();

      expect(movies).toEqual([storedMovieRepositoryResponse]);
      expect(movieRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find by ID', () => {
    it('Should return the specified movie correctly', async () => {
      jest
        .spyOn(movieRepository, 'findById')
        .mockResolvedValue(storedMovieRepositoryResponse);

      const movie = await movieService.findByIdOrThrow(1);

      expect(movieRepository.findById).toHaveBeenCalledWith(1);
      expect(movie).toEqual(storedMovieRepositoryResponse);
    });

    it('Should return an error if there is no stored movie with the given ID', async () => {
      jest.spyOn(movieRepository, 'findById').mockResolvedValue(undefined);

      try {
        await movieService.findByIdOrThrow(1);
      } catch (err) {
        expect(err).toBeInstanceOf(MovieNotFoundError);
        expect(movieRepository.findById).toHaveBeenCalledWith(1);
      }
    });
  });

  describe('Update by ID', () => {
    it('Should update a movie correctly', async () => {
      jest
        .spyOn(movieRepository, 'findById')
        .mockImplementationOnce(() =>
          Promise.resolve(storedMovieRepositoryResponse),
        );

      const updateMovieDto: UpdateMovieDto = {
        title: 'Star Wars II',
        openingCrawl: '100 years ago...',
        director: 'George Lucas',
      };

      jest
        .spyOn(movieRepository, 'updateById')
        .mockResolvedValue(storedMovieRepositoryResponse);

      const movieUpdated = await movieService.updateById(1, updateMovieDto);

      expect(movieUpdated).toEqual(storedMovieRepositoryResponse);
      expect(movieRepository.updateById).toHaveBeenCalledWith(
        1,
        updateMovieDto,
      );
    });

    it('Should throw an error if trying to update a non existing movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Star Wars II',
        openingCrawl: '100 years ago...',
        director: 'George Lucas',
      };

      try {
        await movieService.updateById(1, updateMovieDto);
      } catch (err) {
        expect(err).toBeInstanceOf(MovieNotFoundError);
        expect(movieRepository.updateById).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Delete by ID', () => {
    it('Should throw an error if trying to delete a non-existing movie', async () => {
      jest
        .spyOn(movieRepository, 'deleteById')
        .mockImplementationOnce(() => Promise.resolve());

      try {
        await movieService.deleteById(1);
      } catch (err) {
        expect(err).toBeInstanceOf(MovieNotFoundError);
        expect(movieRepository.deleteById).toHaveBeenCalledTimes(0);
      }
    });

    it('Should delete a movie with the given ID', async () => {
      jest
        .spyOn(movieRepository, 'findById')
        .mockImplementationOnce(() =>
          Promise.resolve(storedMovieRepositoryResponse),
        );

      jest
        .spyOn(movieRepository, 'deleteById')
        .mockImplementationOnce(() => Promise.resolve());

      await movieService.deleteById(1);

      expect(movieRepository.deleteById).toHaveBeenCalledWith(1);
    });
  });
});
