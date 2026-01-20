import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Star Wars III',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'George Lucas',
  })
  director?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'A long, long time ago in a galaxy far, far away...',
  })
  openingCrawl?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: '2005-05-13',
  })
  releaseDate?: string;
}
