const R = require("ramda");

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const MAX_DISPLAY_LENGTH = 20;

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

const getStationName = id => {
  const station = stations.find(station => station.id === id);
  return station ? station.name : "";
};

const fetchDepartureDates = stationId => {
  const url = `http://127.0.0.1:5000/stations/${stationId}/departures/`;
  return fetch(url)
    .then(data => data.json())
    .then(departures =>
      departures.map(dep =>
        Object.assign(dep, {
          wait_time: parseInt(dep.wait_time, 10),
          station_name: getStationName(stationId)
        })
      )
    );
};

const addRowToDepartureTable = departures => {
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
    stationNameCell.innerText = departure.station_name;
    row.appendChild(stationNameCell);

    const waitTimeCell = document.createElement("td");
    waitTimeCell.innerText = departure.wait_time + " min";
    row.appendChild(waitTimeCell);

    departureTable.appendChild(row);
  });
};

const promisedDepartures = stations.map(station =>
  fetchDepartureDates(station.id)
);

Promise.all(promisedDepartures)
  .then(departures => R.flatten(departures))
  .then(departures => {
    const sortedDepartures = departures.sort((a, b) =>
      a.wait_time > b.wait_time ? 1 : -1
    );
    addRowToDepartureTable(sortedDepartures.slice(0, MAX_DISPLAY_LENGTH));
  })
  .catch(err => console.log(`failed to fetch data for station. ${err}`));
