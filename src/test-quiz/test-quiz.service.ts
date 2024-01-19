import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { CreateTestQuizDto } from './dto/create-test-quiz.dto';
import { UpdateTestQuizDto } from './dto/update-test-quiz.dto';
import { TestQuiz } from '../test-quiz/entities/test-quiz.entity';
import { Question } from '../questions/entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class TestQuizService {
  constructor(
      @InjectRepository(TestQuiz)
      private readonly testQuizRepository: Repository<TestQuiz>,
      @InjectRepository(Question)
      private readonly questionRepository: Repository<Question>, 

  ) {}

  async createQuizIfNotExists(title: string): Promise<TestQuiz> {
    let quiz = await this.testQuizRepository.findOneBy({ title });
    if (!quiz) {
      quiz = this.testQuizRepository.create({ title });
      await this.testQuizRepository.save(quiz);
    }
    return quiz;
  }

  async addQuestionToQuiz(quiz: TestQuiz, questionData: any): Promise<Question> {
    const question = this.questionRepository.create({
      content: questionData.content,
      options: questionData.options,
      correctOption: questionData.correctOption,
      testQuiz: quiz
    });

    return this.questionRepository.save(question);
  }

  async create(createQuizDto: CreateTestQuizDto): Promise<TestQuiz> {
    const quiz = this.testQuizRepository.create(createQuizDto);
    return this.testQuizRepository.save(quiz);
  }

  async findAll(): Promise<TestQuiz[]> {
    return this.testQuizRepository.find();
  }

  async findOne(id: string): Promise<TestQuiz> {
    return this.testQuizRepository.findOneBy({ quizID: id });
  }

  async update(id: string, updateTestQuizDto: UpdateTestQuizDto): Promise<TestQuiz> {
    await this.testQuizRepository.update(id, updateTestQuizDto);
    return this.testQuizRepository.findOneBy({ quizID: id });
  }

  async remove(id:string): Promise<void> {
    await this.testQuizRepository.delete(id);
  }


  async seedTestQuizzes() {
    const filePath = path.join(__dirname, '../../data/test_quiz.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const quizData = JSON.parse(rawData);

    for (const quiz of quizData) {
      const testQuiz = this.testQuizRepository.create(quiz);
      await this.testQuizRepository.save(testQuiz);
    }
  }

}