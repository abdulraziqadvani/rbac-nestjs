import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

import { Collection, CollectionDocument } from './schemas/collection.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>
  ) {
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<any> {
    const collection = new this.collectionModel(createCollectionDto);
    await collection.save();

    return collection.toObject();
  }

  async findAll(): Promise<any> {
    return await this.collectionModel.find();
  }

  async findOne(id: string): Promise<any> {
    return await this.collectionModel.findById(id);
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto): Promise<any> {
    return await this.collectionModel.findByIdAndUpdate(id, updateCollectionDto).lean();
  }

  async remove(id: string): Promise<any> {
    await this.collectionModel.deleteOne({ _id: id });
    return true;
  }
}
