import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsArray, IsString } from "class-validator";

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsString()
  name: string

  @IsArray()
  collectionIds: string[]
}
