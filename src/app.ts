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
    // const series = await fred.series.getObservationsForSeries('SP500');

    // temp workaround, directly pull data
    const URL = `https://api.stlouisfed.org/fred/series/observations?series_id=SP500&api_key=${process.env.FRED_API_KEY}&file_type=json`;
    const response = await fetch(URL);
    const series = await response.json();

    let data = series.observations.filter((obj: any) => {
      function isValidDate(dateStr: string) {
        const REGEX = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateStr.match(REGEX)) return false;  // Invalid YYYY-MM-DD str format

        let date = new Date(dateStr);
        let dateNum = date.getTime();
        if (!dateNum && dateNum !== 0) return false; // Invalid date, NaN value

        return date.toISOString().slice(0, 10) === dateStr; // Valid day? e.g. not leap day
      };

      function isValidVal(valStr: string) {
        const REGEX = /^\d*(\.\d{1,2})?$/;

        return valStr.match(REGEX); // Valid str format?
      };

      return isValidDate(obj.date) && isValidVal(obj.value);
    });

    let formattedData = data.map((obj: any) => {
      const newObj: { date: Date, value: number } = {
        date: new Date(obj.date),
        value: Number(obj.value)
      };

      return newObj;
    });

    res.send(formattedData);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, (): void => {
  console.log(`Listening on port ${PORT}...`);
});
