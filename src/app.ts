import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import Fred from 'node-fred';

const app: Application = express();
dotenv.config();

const fred: Fred = new Fred(process.env.FRED_API_KEY ?? '');

const PORT: number = parseInt(process.env.PORT ?? '3000');

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO check error for static type checking with wrapper
    // const series = await fred.series.getObservationsForSeries('SP500');

    // temp workaround, directly pull data
    const URL = `https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=${process.env.FRED_API_KEY}&file_type=json`;
    const response = await fetch(URL);
    const series = await response.json();

    // TODO check error for dynamic import() within commmonjs
    // const plot = Plot.plot({
    //   marks: [
    //     Plot.lineY(series.observations, { x: 'date', y: 'value' })
    //   ]
    // });

    // TODO temp workaround to load charting lib via CDN
    res.render('home', { data: JSON.stringify(series.observations) });
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}...`);
});
