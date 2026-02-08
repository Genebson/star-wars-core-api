import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieService } from '../service/movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from '../repository/movie.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/controller/roles/roles.guard';
import { RolesType } from '../../common/controller/roles/enum/roles.enum';
import { MovieErrorFilter } from '../service/movie-error-filter.interceptor';

@ApiTags('Movies')
@Controller('movie')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseFilters(MovieErrorFilter)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseGuards(RolesGuard([RolesType.ADMIN]))
  @ApiBody({ type: CreateMovieDto })
  async create(@Body() movie: CreateMovieDto): Promise<MovieEntity> {
    return await this.movieService.create(movie);
  }

  @Get()
  async findAll(): Promise<MovieEntity[]> {
    return await this.movieService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MovieEntity> {
    return await this.movieService.findByIdOrThrow(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard([RolesType.ADMIN]))
  @ApiBody({ type: UpdateMovieDto })
  async updateById(
    @Param('id') id: string,
    @Body() movie: UpdateMovieDto,
  ): Promise<MovieEntity> {
    return await this.movieService.updateById(+id, movie);
  }

  @Delete(':id')
  @UseGuards(RolesGuard([RolesType.ADMIN]))
  async deleteById(@Param('id') id: string): Promise<void> {
    return await this.movieService.deleteById(+id);
  }

  @Post('sync')
  @UseGuards(RolesGuard([RolesType.ADMIN]))
  async syncMovies(): Promise<void> {
    return await this.movieService.syncMovies();
  }
}
