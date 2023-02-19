import { IsNotEmpty, IsString, ValidateNested } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { StateEntity } from 'src/core/entities';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public state_id: number;
}
