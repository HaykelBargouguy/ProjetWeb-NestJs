import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { RoadmapService } from './roadmaps.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';

@Controller('roadmaps')
export class RoadmapsController {
  constructor(private readonly roadmapsService: RoadmapService) {}

  @Post()
  create(@Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapsService.create(createRoadmapDto);
  }


@Get()
  findAll() {
    return this.roadmapsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.roadmapsService.findOne(id);
  }

  @Delete(':id')
    async remove(@Param('id') id: string) {
      return await this.roadmapsService.remove(id);
    }
  /*
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
      return this.roadmapsService.update(+id, updateRoadmapDto);
    }
  */
    // Remove the duplicate remove function
}
