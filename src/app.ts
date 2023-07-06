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
    // TODO check error for static type checking with wrapper
    // Argument of type 'ObservationInfo' is not assignable to parameter of type 'string'
    // const series = await fred.series.getObservationsForSeries('SP500');

    // temp workaround, directly pull data
    const URL = `https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=${process.env.FRED_API_KEY}&file_type=json`;
    const response = await fetch(URL);
    const series = await response.json(); // res body parsed as json, returns js obj

    // TODO Add edge cases
    let data = series.observations.map((obj: any) => {
// date in valid YYYY-MM-DD str format, can convert to date obj, else remove
// new Date constructor throws error

// value is valid numeric string, can convert to number, else remove 
// "." is invalid
// Number constuctor throws error

      const newObj: { date: Date, value: number } = {
        date: new Date(obj.date),
        value: Number(obj.value) || 0
      };

      return newObj;
    });

    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}...`);
});
