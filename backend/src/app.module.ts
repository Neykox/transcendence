import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two_fa/two_fa.module';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'db_postgres',
            port: 5432,
            username: 'utilisateur',
            password: 'motdepasse',
            database: 'basededonnee',
            entities: [User],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        AuthModule,
        TwoFaModule],
})
export class AppModule {}