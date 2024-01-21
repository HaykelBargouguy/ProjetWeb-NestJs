// progress.service.ts

import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';

import {CustomRepositoryCannotInheritRepositoryError, FindManyOptions, FindOneOptions, In, IntegerType, Repository} from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import {Milestone} from "../milestone/entities/milestone.entity";
import {Validation} from "../validations/entities/validation.entity";
import {UsersService} from "../users/users.service";
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../common/crud.service';
import User from '../users/entities/user.entity';
import { Roadmap } from '../roadmaps/entities/roadmap.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';
@Injectable()
export class ProgressService extends CrudService<Progress>{
  constructor(
      @InjectRepository(Progress)
      private progressRepository: Repository<Progress>,
      @InjectRepository(User)
      private userRepository:Repository<User>,
      @InjectRepository(Roadmap)
      private roadmapRepository:Repository<Roadmap>,
      @InjectRepository(Milestone)
      private milestoneRepository:Repository<Milestone>,
      @InjectRepository(Validation)
      private validationRepository:Repository<Validation>
      
  ) {
    super(progressRepository)
  }
  async create(createDto: CreateProgressDto): Promise<Progress> {
    const { roadmapId, userId, percentage } = createDto;

    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const roadmap = await this.roadmapRepository.findOne({ where: { id: roadmapId } });
    if (!user || !roadmap) {
      throw new NotFoundException('User or Roadmap not found.');
    }
    const newProgress = this.progressRepository.create({
      user,
      roadmap,
      percentage,
    });
    return await this.progressRepository.save(newProgress);
    
  }
  async updateProgressByUserAndRoadmap(userId: number, roadmapId: string): Promise<Progress> {
   let validated=0
   const findOneOptionsProgress: FindOneOptions<Progress> = {
      where: { user: { id: userId }, roadmap: { id: roadmapId} },
    };
    const existingProgress = await this.progressRepository.findOne(findOneOptionsProgress);

    if (!existingProgress) {
      throw new NotFoundException(`Progress for User ID ${userId} and Roadmap ID ${roadmapId} not found.`);
    }

    const findManyOptionsMilestone : FindManyOptions<Milestone>={
      where:{roadmap:{id:roadmapId}}
    }
    const milestonesAndCount=await this.milestoneRepository.findAndCount(findManyOptionsMilestone)
    if (!milestonesAndCount) {
      throw new NotFoundException(`Milestones Roadmap ID ${roadmapId} not found.`);
    }
    const milestones=milestonesAndCount[0]
    const count=milestonesAndCount[1]
    for (const milestone of milestones) {
      const milestoneId = milestone.id;
      const findOneOptionsValidation : FindOneOptions<Validation>={
        where:{user:{id:userId},milestone:{id:milestoneId}}
      }
      const validation=await this.validationRepository.findOne(findOneOptionsValidation)
      if(validation){
        if (validation.passed==true){
          validated=validated+1
        }
      }
    }
    const ratio= validated/count
    existingProgress.percentage = Number(ratio.toFixed(1));
    return await this.progressRepository.save(existingProgress);
  }
  async getProgressByUserAndRoadmap(userId:number,roadmapId:string){
    const findOneOptions: FindOneOptions<Progress> = {
      where: { user: { id: userId }, roadmap: { id: roadmapId} },
    };
    const existingProgress = await this.progressRepository.findOne(findOneOptions);
    if (!existingProgress) {
      throw new NotFoundException(`Progress for User ID ${userId} and Roadmap ID ${roadmapId} not found.`);
    }
    return existingProgress.percentage

  }
}