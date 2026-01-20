import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @ApiProperty({
    example: 'Star Wars III',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'George Lucas',
  })
  director: string;

  @IsString()
  @ApiProperty({
    example: 'A long, long time ago in a galaxy far, far away...',
  })
  openingCrawl: string;

  @IsDateString()
  @ApiProperty({
    example: '2005-05-13',
  })
  releaseDate: string;
}
