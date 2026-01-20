import { Injectable, Inject } from '@nestjs/common';
import { CreateMovieDto } from '../controller/dto/create-movie.dto';
import { UpdateMovieDto } from '../controller/dto/update-movie.dto';
import { MovieEntity } from '../repository/movie.entity';
import { IMovieRepository } from '../repository/interface/movie.repository.interface';
import { MovieNotFoundError } from './movie.service.error';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private readonly movieRepository: IMovieRepository,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const { title, director, openingCrawl, releaseDate } = createMovieDto;

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

  async updateById(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    await this.findByIdOrThrow(id);

    const { title, director, openingCrawl, releaseDate } = updateMovieDto;

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

  async syncMovies(): Promise<any> {
    return this.movieRepository.syncMovies();
  }
}
