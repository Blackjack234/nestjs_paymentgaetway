import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as chalk from 'chalk';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;

  app.use(
    bodyParser.raw({
      type: 'application/json', // body parser the data.
    }),
  );
  await app.listen(port);

  const env = configService.get<string>('ENV');
  let url: string;
  if (env === 'dev') {
    const baseUrl = configService.get<string>('BASE_URL') || 'http://localhost';

    url = `${baseUrl}:${port}`;
  } else {
    url = `http://localhost:${port}`;
  }

  //terminal message//

  console.log(
    '\n' + chalk.bgGreen.black.bold(' ✔ PAYMENT APP STARTED ') + '\n',
  );
  console.log(
    chalk.greenBright('🚀 Server is up and running at: ') +
      chalk.cyanBright.underline(url),
  );
  console.log(chalk.yellow('✨ Happy Coding! 💻\n'));
}
bootstrap();
