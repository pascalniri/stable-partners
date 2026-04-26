import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [EmailsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
