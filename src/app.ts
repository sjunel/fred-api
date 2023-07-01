import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import Fred from 'node-fred';

const app: Application = express();
dotenv.config();
const fred: Fred = new Fred(process.env.FRED_API_KEY ?? '');

const PORT: number = parseInt(process.env.PORT ?? '3000');

app.use('/', (req: Request, res: Response): void => {
  res.send('Hello world!');
});

app.listen(PORT, ():void => {
  console.log(`Listening on port ${PORT}...`);
});
