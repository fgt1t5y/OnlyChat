import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from './entities';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private readonly serverMemberRepository: Repository<Server>,
  ) {}

  async findById(serverId: number) {
    return await this.serverMemberRepository.findOneBy({
      id: serverId,
    });
  }
}
