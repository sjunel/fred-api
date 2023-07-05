async function getData() {
  const url = '/data';
  try {
    const response = await fetch(url);
    const observations = await response.json();
    return observations;
  } catch (error) {
    console.log(error);
  }
}

// const data = await getData();

// temp hard coded data
const data = [
        {
            date: new Date("2013-07-05"),
            value: 1631.89
        },
        {
            date: new Date("2013-07-08"),
            value: 1640.46
        },
        {
            date: new Date("2013-07-08"),
            value: 1640.46
        },
        {
            date: new Date("2013-07-09"),
            value: 1652.32
        },
        {
            date: new Date("2013-07-10"),
            value: 1652.62
        },
];

const plot = Plot.lineY(data, { x: "date", y: "value" }).plot({ y: { grid: true } });

const div = document.querySelector("#myplot");

div.append(plot);
