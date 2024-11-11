import { IsOptional, IsString } from 'class-validator';

export class FilterItemsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
