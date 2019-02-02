// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const stationIdAmsterdamerStr = 317;

const stations = [
  {
    id: 317,
    walkingTime: 8,
    name: "Amsterdamer Str./Gürtel"
  },
  {
    id: 314,
    walkingTime: 8,
    name: "Boltensternstr."
  },
  {
    id: 319,
    walkingTime: 3,
    name: "Riehler Gürtel"
  }
];

const fetchDepartureDates = stationId => {
  const url = `http://127.0.0.1:5000/stations/${stationIdAmsterdamerStr}/departures/`;
  return fetch(url).then(data => data.json());
};

const addRowToDepartureTable = (departures, stationName) => {
  const departureTable = document.querySelector("#departure-table");
  departures.forEach(departure => {
    const row = document.createElement("tr");

    const lineCell = document.createElement("td");
    lineCell.innerText = departure.line_id;
    row.appendChild(lineCell);

    const directionCell = document.createElement("td");
    directionCell.innerText = departure.direction;
    row.appendChild(directionCell);

    const stationNameCell = document.createElement("td");
    stationNameCell.innerText = stationName;
    row.appendChild(stationNameCell);

    const waitTimeCell = document.createElement("td");
    waitTimeCell.innerText = departure.wait_time + " min";
    row.appendChild(waitTimeCell);

    departureTable.appendChild(row);
  });
};

stations.forEach(station => {
  fetchDepartureDates(station.id)
    .then(departures => addRowToDepartureTable(departures, station.name))
    .catch(() =>
      console.log(`failed to fetch data for station with id ${station.id}`)
    );
});
