import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (config: ConfigService): any => ({
  type: 'postgres',
  host: config.get<string>('POSTGRES_HOST'),
  port: config.get<number>('POSTGRES_PORT'),
  username: config.get<string>('POSTGRES_USER'),
  password: config.get<string>('POSTGRES_PASSWORD'),
  database: config.get<string>('POSTGRES_DB'),
  autoLoadEntities: true,
  synchronize: false,
});
