import { MovieEntity } from '../movie.entity';
import { ICreateMovieInput } from './create-movie.input.interface';
import { IUpdateMovieInput } from './update-movie.input.interface';

export interface IMovieRepository {
  findAll(): Promise<MovieEntity[]>;
  findById(id: number): Promise<MovieEntity>;
  findByTitle(title: string): Promise<MovieEntity>;
  create(movie: ICreateMovieInput): Promise<MovieEntity>;
  updateById(id: number, movie: IUpdateMovieInput): Promise<MovieEntity>;
  deleteById(id: number): Promise<void>;
}
