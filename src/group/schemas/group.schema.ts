import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { Collection } from 'src/collection/schemas/collection.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Collection' })
  collectionIds: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
