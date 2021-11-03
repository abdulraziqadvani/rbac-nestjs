import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { Collection } from 'src/collection/schemas/collection.schema';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Collection' })
  parentId: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
