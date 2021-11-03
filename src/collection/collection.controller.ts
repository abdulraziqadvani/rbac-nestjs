import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) { }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  create(@Body() createCollectionDto: CreateCollectionDto): Promise<any> {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  findAll(): Promise<any> {
    return this.collectionService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  findOne(@Param('id') id: string): Promise<any> {
    return this.collectionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto): Promise<any> {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('manager', 'globalmanager')
  remove(@Param('id') id: string): Promise<any> {
    return this.collectionService.remove(id);
  }
}
