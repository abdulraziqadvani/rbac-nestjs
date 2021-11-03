import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto, UpdateItemDto } from './dto';

import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>
  ) {
  }

  /**
   * Creates Item.
   * @param createItemDto - Item Object to be created.
   * @returns Returns created data.
   */
  async create(createItemDto: CreateItemDto): Promise<any> {
    const item = new this.itemModel(createItemDto);
    await item.save();

    return item.toObject();
  }

  /**
   * Finds all Items created.
   * @returns All items data.
   */
  async findAll(): Promise<any> {
    return await this.itemModel.find();
  }

  /**
   * Finds a specific item based on ID Provided.
   * @param id - ID based on which data needed.
   * @returns Returns data of a item.
   */
  async findOne(id: string): Promise<any> {
    return await this.itemModel.findById(id);
  }

  /**
   * Updated Item.
   * @param id - Item Object ID to be updated.
   * @param updateItemDto - Item Object to be updated.
   * @returns Returns updated data.
   */
  async update(id: string, updateItemDto: UpdateItemDto): Promise<any> {
    return await this.itemModel.findByIdAndUpdate(id, updateItemDto).lean();
  }

  /**
   * Removes a specific item from a Database.
   * @param id - Item ID based on which data needs to be removed.
   * @returns Returns true boolean.
   */
  async remove(id: string): Promise<any> {
    await this.itemModel.deleteOne({ _id: id });
    return true;
  }

  /**
   * Gets Items based on `collectionIds` provided in param.
   * @param collectionIds - Ids of a Collection.
   * @returns Items records.
   */
  async getCollectionItems(collectionIds: string[]): Promise<any> {
    const items = await this.itemModel.find({ parentId: { $in: collectionIds } });
    return items;
  }
}
