import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.setGlobalPrefix('api')
  app.enableCors();
  await app.listen(PORT, () => console.log(`sever started on port ${PORT}`));
}

bootstrap();
