import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('globalmanager')
  create(@Body() createGroupDto: CreateGroupDto): Promise<any> {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('globalmanager')
  findAll(): Promise<any> {
    return this.groupService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('globalmanager')
  findOne(@Param('id') id: string): Promise<any> {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('globalmanager')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<any> {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('globalmanager')
  remove(@Param('id') id: string): Promise<any> {
    return this.groupService.remove(id);
  }
}
