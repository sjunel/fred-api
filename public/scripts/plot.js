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

const data = await getData();

const plot = Plot.lineY(data, { x: "date", y: "value" }).plot({ y: { grid: true } });

const div = document.querySelector("#myplot");

div.append(plot);
