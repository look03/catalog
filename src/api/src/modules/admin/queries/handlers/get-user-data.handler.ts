import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { GetUserDataQuery } from '../impl/get-user-data.query';
import { User } from '../../../auth/entities/user.entity';
import { UserInfo } from '../../interfaces/user.interface';

@QueryHandler(GetUserDataQuery)
export class GetUserDataHandler implements IQueryHandler<GetUserDataQuery> {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  private readonly logger = new Logger('GetUserDataHandler');

  /**
   * Возвращает данные о пользователе.
   * @returns
   */
  async execute(query: GetUserDataQuery): Promise<UserInfo | null> {
    try {
      const userInfo = await this.repo
        .createQueryBuilder('user')
        .select(['user.id', 'user.email'])
        .where('user.id = :userId', { userId: query.userId })
        .getOne();

      if (!userInfo) {
        return null;
      }

      return {
        email: userInfo.email,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get user data',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
