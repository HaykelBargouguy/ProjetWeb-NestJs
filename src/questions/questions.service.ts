import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = this.questionsRepository.create(createQuestionDto);
    return this.questionsRepository.save(newQuestion);
  }

  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find();
  }

  async findOne(id: number): Promise<Question> {
    return this.questionsRepository.findOneBy({ questionID: id });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    await this.questionsRepository.update(id, updateQuestionDto);
    return this.questionsRepository.findOneBy({ questionID: id });
  }

  async remove(id: number): Promise<void> {
    await this.questionsRepository.delete(id);
  }
}
