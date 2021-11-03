import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
    GroupModule
  ],
  controllers: [CollectionController],
  providers: [CollectionService]
})
export class CollectionModule {}
