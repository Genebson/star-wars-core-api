import { Injectable, Inject } from '@nestjs/common';
import { CreateMovieDto } from '../controller/dto/create-movie.dto';
import { UpdateMovieDto } from '../controller/dto/update-movie.dto';
import { MovieEntity } from '../repository/movie.entity';
import { IMovieRepository } from '../repository/interface/movie.repository.interface';
import { MovieNotFoundError } from './movie.service.error';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ICreateMovieInput } from '../repository/interface/create-movie.input.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private readonly movieRepository: IMovieRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(movie: CreateMovieDto): Promise<MovieEntity> {
    const { title, director, openingCrawl, releaseDate } = movie;

    return this.movieRepository.create({
      title,
      director,
      openingCrawl,
      releaseDate: new Date(releaseDate),
    });
  }

  async findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.findAll();
  }

  async findByIdOrThrow(id: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new MovieNotFoundError();
    }

    return movie;
  }

  async updateById(id: number, movie: UpdateMovieDto): Promise<MovieEntity> {
    await this.findByIdOrThrow(id);

    const { title, director, openingCrawl, releaseDate } = movie;

    return this.movieRepository.updateById(id, {
      title,
      director,
      openingCrawl,
      ...(releaseDate ? { releaseDate: new Date(releaseDate) } : {}),
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.findByIdOrThrow(id);
    return this.movieRepository.deleteById(id);
  }

  async syncMovies(): Promise<void> {
    const starWarsApi = this.configService.get<string>('star.wars.api');

    const fetch = this.httpService.get(starWarsApi);

    const {
      data: { result: films },
    } = await lastValueFrom(fetch);

    for (const film of films) {
      const { title, release_date, director, opening_crawl } = film.properties;

      const newMovie: ICreateMovieInput = {
        title,
        director,
        releaseDate: new Date(release_date),
        openingCrawl: opening_crawl,
      };

      const existingMovie = await this.movieRepository.findByTitle(title);

      if (!existingMovie) {
        await this.movieRepository.create(newMovie);
      }
    }
  }
}
