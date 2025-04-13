import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMSession } from './entities';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class DMSessionService {
  constructor(
    @InjectRepository(DMSession)
    private readonly dmSessionRepository: Repository<DMSession>,
  ) {}

  async findAll(userId: number): Promise<User[]> {
    const friends = await this.dmSessionRepository.find({
      relations: {
        userB: true,
      },
      where: {
        userAId: userId,
      },
    });

    return friends.map((item) => item.userB);
  }

  async exist(userAId: number, userBId: number) {
    return await this.dmSessionRepository.existsBy({
      userAId,
      userBId,
    });
  }

  async create(userAId: number, userBId: number): Promise<DMSession> {
    const dmSession = this.dmSessionRepository.create({
      userAId: userAId,
      userBId: userBId,
      isOpen: true,
    });

    return await this.dmSessionRepository.save(dmSession);
  }

  async updateIsOpen(userAId: number, userBId: number, isOpen: boolean) {
    await this.dmSessionRepository.update(
      { userAId, userBId },
      {
        isOpen,
      },
    );
  }
}
