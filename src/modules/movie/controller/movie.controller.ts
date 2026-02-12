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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../common/controller/roles/roles.guard';
import { RolesType } from '../../common/controller/roles/enum/roles.enum';
import { MovieErrorFilter } from '../service/movie-error-filter.interceptor';
import { MovieResponseDto } from './dto/create-movie.response.dto';

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
  @ApiCreatedResponse({
    type: MovieResponseDto,
    description: 'Movie successfully created',
  })
  async create(@Body() movie: CreateMovieDto): Promise<MovieResponseDto> {
    return await this.movieService.create(movie);
  }

  @Get()
  @ApiOkResponse({
    type: MovieResponseDto,
  })
  async findAll(): Promise<MovieResponseDto[]> {
    return await this.movieService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: MovieResponseDto })
  async findById(@Param('id') id: string): Promise<MovieResponseDto> {
    return await this.movieService.findByIdOrThrow(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard([RolesType.ADMIN]))
  @ApiBody({ type: UpdateMovieDto })
  @ApiOkResponse({
    type: MovieResponseDto,
    description: 'Movie successfully updated',
  })
  async updateById(
    @Param('id') id: string,
    @Body() movie: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
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
