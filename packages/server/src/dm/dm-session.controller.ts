import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DmSessionService } from './dm-session.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { UpdateDmDto } from './dto/update-dm.dto';

@Controller('dm/session')
export class DmSessionController {
  constructor(private readonly dmService: DmSessionService) {}

  @Post()
  create(@Body() createDmDto: CreateDmDto) {
    return this.dmService.create(createDmDto);
  }

  @Get()
  findAll() {
    return this.dmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDmDto: UpdateDmDto) {
    return this.dmService.update(+id, updateDmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dmService.remove(+id);
  }
}
