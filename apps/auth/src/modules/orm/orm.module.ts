import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import options from '../../mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUri = configService.get<string>('DATABASE_URI');
        return {
          ...options,
          clientUrl: databaseUri,
        };
      },
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
