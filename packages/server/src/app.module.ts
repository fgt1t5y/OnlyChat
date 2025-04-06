import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Role } from './role/role.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/permission.entity';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'lyghj456',
      database: 'onlychat',
      entities: [User, Role, Permission],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    WebsocketModule,
  ],
})
export class AppModule {}
