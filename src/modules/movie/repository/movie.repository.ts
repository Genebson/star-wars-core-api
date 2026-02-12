import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateMovieInput } from './interface/create-movie.input.interface';
import { IUpdateMovieInput } from './interface/update-movie.input.interface';
import { IMovieRepository } from './interface/movie.repository.interface';
import { MovieEntity } from './movie.entity';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.find({
      select: ['id', 'title', 'director', 'openingCrawl', 'releaseDate'],
      order: { id: { direction: 'ASC' } },
    });
  }

  async findById(id: number): Promise<MovieEntity> {
    return this.movieRepository.findOne({
      where: { id },
      select: ['title', 'director', 'openingCrawl', 'releaseDate'],
    });
  }

  async findByTitle(title: string): Promise<MovieEntity> {
    return this.movieRepository.findOne({
      where: { title },
    });
  }

  async create(movie: ICreateMovieInput): Promise<MovieEntity> {
    const { title, director, releaseDate, openingCrawl } = movie;

    const newMovie = new MovieEntity();
    newMovie.title = title;
    newMovie.director = director;
    newMovie.releaseDate = releaseDate;
    newMovie.openingCrawl = openingCrawl;

    return this.movieRepository.save(newMovie);
  }

  async updateById(id: number, movie: IUpdateMovieInput): Promise<MovieEntity> {
    await this.movieRepository.update(id, movie);
    return this.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.movieRepository.softDelete(id);
  }
}
