import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { Item, ItemSchema } from './schemas/item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    GroupModule
  ],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
