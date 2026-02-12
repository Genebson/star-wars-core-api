import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the movie',
  })
  id: number;

  @ApiProperty({
    example: 'Star Wars III',
  })
  title: string;

  @ApiProperty({
    example: 'George Lucas',
  })
  director: string;

  @ApiProperty({
    example: 'A long, long time ago in a galaxy far, far away...',
  })
  openingCrawl: string;

  @ApiProperty({
    example: '2005-05-13',
    description: 'Movie release date',
  })
  releaseDate: Date;
}
