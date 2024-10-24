import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = 3900;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
      .setTitle('Diffiehelman')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .addApiKey(
          {
            type: 'apiKey',
            name: 'public_key',
            in: 'header',
            description: 'Enter your public token',
          },
          'public_key',
      )
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      // docExpansion: 'none',
      // explorer: true,
    }
  });
  await app.listen( port);
}
bootstrap().then(() => {
  console.log('http://localhost:'+port)
});
