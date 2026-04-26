import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmailsService } from './modules/emails/emails.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function testEmail() {
  // Load .env from the project root
  dotenv.config({ path: path.resolve(__dirname, '../.env') });

  const app = await NestFactory.createApplicationContext(AppModule);
  const emailsService = app.get(EmailsService);

  console.log('Testing email dispatch...');
  await emailsService.sendThankYou('pascalniri@gmail.com', 'Test User');
  console.log('Test completed. Check console for ✅ or ❌');

  await app.close();
}

testEmail().catch((err) => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
