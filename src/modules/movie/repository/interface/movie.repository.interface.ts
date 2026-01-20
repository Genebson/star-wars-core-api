import { MovieEntity } from '../movie.entity';
import { ICreateMovieInput } from './create-movie.input.interface';
import { IUpdateMovieInput } from './update-movie.input.interface';

export interface IMovieRepository {
  findAll(): Promise<MovieEntity[]>;
  findById(id: number): Promise<MovieEntity>;
  create(movieData: ICreateMovieInput): Promise<MovieEntity>;
  updateById(id: number, movieData: IUpdateMovieInput): Promise<MovieEntity>;
  deleteById(id: number): Promise<void>;
  syncMovies(): Promise<MovieEntity[]>;
}
