import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { PermissionModule } from 'src/permission/permission.module';
import { FriendModule } from 'src/friend/friend.module';
import { EventModule } from 'src/event/event.module';
import { DMModule } from 'src/dm/dm.module';
import { ServerModule } from 'src/server/server.module';
import { ChannelModule } from 'src/channel/channel.module';
import { AttachmentModule } from 'src/attachment/attachment.module';
// Entities
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';
import { Permission } from 'src/permission/permission.entity';
import { FriendRequest, Friend } from 'src/friend/entities';
import { DMMessage, DMSession } from 'src/dm/entities';
import { Server, ServerMember, ServerRole } from 'src/server/entities';
import { Channel, ChannelMessage } from 'src/channel/entities';
import { Attachment } from 'src/attachment/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'lyghj456',
      database: 'onlychat',
      entities: [
        User,
        Role,
        Permission,
        FriendRequest,
        Friend,
        DMMessage,
        DMSession,
        Server,
        ServerMember,
        ServerRole,
        Channel,
        ChannelMessage,
        Attachment,
      ],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    EventModule,
    FriendModule,
    DMModule,
    ServerModule,
    ChannelModule,
    AttachmentModule,
  ],
})
export class AppModule {}
