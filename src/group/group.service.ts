import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto, UpdateGroupDto } from './dto';

import { Group, GroupDocument } from './schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>
  ) {
  }

  async create(createGroupDto: CreateGroupDto): Promise<any> {
    const group = new this.groupModel(createGroupDto);
    await group.save();

    return group.toObject();
  }

  async findAll(): Promise<any> {
    return await this.groupModel.find();
  }

  async findOne(id: string): Promise<any> {
    return await this.groupModel.findById(id);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<any> {
    return await this.groupModel.findByIdAndUpdate(id, updateGroupDto).lean();
  }

  async remove(id: string): Promise<any> {
    await this.groupModel.deleteOne({ _id: id });
    return true;
  }

  async getGroupByIds(groupId: string[]): Promise<any> {
    const groups = await this.groupModel.find({ _id: { $in: groupId } });
    return groups;
  }
}
