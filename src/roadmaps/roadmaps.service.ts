// roadmap.service.ts

import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import {Milestone} from "../milestone/entities/milestone.entity";
import {User} from "../users/entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../common/crud.service';
import * as fs from 'fs';
import * as path from 'path'; 

@Injectable()
export class RoadmapService extends CrudService<Roadmap> {
  constructor(
      @InjectRepository(Roadmap)
      private roadmapRepository: Repository<Roadmap>,
  ) {
    super(roadmapRepository)
  }


  async DeleteRoadmap(id: string): Promise<string> {
    const roadmap = await this.roadmapRepository.findOne({ where: { id } });

    if (!roadmap) {
        return `Roadmap with ID ${id} does not exist.`;
    }

    await this.roadmapRepository.delete(id);
    return `Roadmap with ID ${id} has been successfully deleted.`;
  }


  async seedRoadmaps() {
    const filePath = path.join(__dirname, '../../data/roadmap.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const roadmapData = JSON.parse(rawData);

    for (const roadmap of roadmapData) {
      const roadMap = this.roadmapRepository.create(roadmap);
      await this.roadmapRepository.save(roadMap);
    }
  }

}
