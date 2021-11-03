import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @IsString()
  name: string
}
