import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import Fred from 'node-fred';

const app: Application = express();
dotenv.config();

const fred: Fred = new Fred(process.env.FRED_API_KEY ?? '');

const PORT: number = parseInt(process.env.PORT ?? '3000');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', (req: Request, res: Response): void => {
  res.render('home');
});

app.get('/data', async (req: Request, res: Response): Promise<void> => {
  try {
    const series = await fred.series.getObservationsForSeries('SP500');

    // TODO format pulled data

    res.send(series.observations);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}...`);
});
