import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerMember } from './entities';

@Injectable()
export class ServerMemberService {
  constructor(
    @InjectRepository(ServerMember)
    private readonly serverMemberRepository: Repository<ServerMember>,
  ) {}

  async findAll(serverId: number) {
    return await this.serverMemberRepository.find({
      relations: {
        user: true,
      },
      where: {
        serverId: serverId,
      },
    });
  }
}
