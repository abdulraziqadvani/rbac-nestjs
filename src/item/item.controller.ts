import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  create(@Body() createItemDto: CreateItemDto): Promise<any> {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  findAll(): Promise<any> {
    return this.itemService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  findOne(@Param('id') id: string): Promise<any> {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<any> {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  remove(@Param('id') id: string): Promise<any> {
    return this.itemService.remove(id);
  }
}
