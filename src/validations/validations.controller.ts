import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Req, UseGuards} from '@nestjs/common';
import { ValidationsService } from './validations.service';
import { CreateValidationDto } from './dto/create-validation.dto';
import { ConfirmValidationDto } from './dto/confirm-validation.dto';
import { AuthGuard } from '../Gaurds/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('validations')
export class ValidationsController {
  constructor(private readonly validationsService: ValidationsService) {}

  @Post()
  create(@Body() createValidationDto: CreateValidationDto, @User() user) {
    createValidationDto.userId = user.id;
    const createdValidation = this.validationsService.createValidation(createValidationDto);
    return { message: 'Validation created successfully', validation: createdValidation };
  }

  @UseGuards(AuthGuard)
  @Patch('confirm')
  validate(@Body() confirmValidationDto: ConfirmValidationDto, @User() user) {
    confirmValidationDto.userId = user.id;
    const updatedScore = this.validationsService.calculateAndUpdateScore(confirmValidationDto);
    return { message: 'Validation confirmed successfully', updatedScore };
  }

  @UseGuards(AuthGuard)
  @Get('getData/:milestoneId')
  getValidationByUserAndMilestone(@Param('milestoneId') milestoneId: string, @User() user) {
    return this.validationsService.getValidationByUserAndMilestone(milestoneId, user.id);
  }

  @Get()
  findAll() {
    return  this.validationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
   return  this.validationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.validationsService.remove(+id);
    return { message: 'Validation removed successfully' };
  }
}
