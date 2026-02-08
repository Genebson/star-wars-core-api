import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICreateMovieInput } from './interface/create-movie.input.interface';
import { IUpdateMovieInput } from './interface/update-movie.input.interface';
import { IMovieRepository } from './interface/movie.repository.interface';
import { MovieEntity } from './movie.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly httpService: HttpService,
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
    await this.movieRepository.delete(id);
  }

  async syncMovies(): Promise<void> {
    const starWarsApi = `${process.env.STAR_WARS_API}/films`;

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

      const existingMovie = await this.movieRepository.findOne({
        where: { title },
      });

      if (!existingMovie) {
        const movie: MovieEntity = this.movieRepository.create(newMovie);
        await this.movieRepository.save(movie);
      }
    }
  }
}
