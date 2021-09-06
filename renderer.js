const R = require("ramda");
const {
  MAX_DISPLAY_LENGTH,
  REFRESH_INTERVAL_MS,
  DATA_SERVICE_BASE_URL,
  stations,
} = require("./config");

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const getStationById = (id) => {
  return stations.find((station) => station.id === id);
};

const getStationName = (id) => {
  const station = getStationById(id);
  return station ? station.name : "";
};

const getStationWalkingTime = (id) => {
  const station = getStationById(id);
  return station ? station.walkingTime : "";
};

const fetchDepartureDates = (stationId) => {
  const url = `${DATA_SERVICE_BASE_URL}/stations/${stationId}/departures/`;
  return fetch(url)
    .then((data) => data.json())
    .then((departures) =>
      departures.map((dep) =>
        Object.assign(dep, {
          wait_time: parseInt(dep.wait_time, 10),
          station_name: getStationName(stationId),
          station_id: stationId,
        })
      )
    );
};

const addHeaderRowToDepartureTable = (departureTable) => {
  const headerRow = document.createElement("tr");
  headerRow.classList = "header-row";

  const lineCell = document.createElement("th");
  lineCell.innerText = "Linie";
  lineCell.classList = "line";
  headerRow.appendChild(lineCell);

  const directionCell = document.createElement("th");
  directionCell.innerText = "Richtung";
  directionCell.classList = "direction";
  headerRow.appendChild(directionCell);

  const stationNameCell = document.createElement("th");
  stationNameCell.innerText = "Station";
  stationNameCell.classList = "station-name";
  headerRow.appendChild(stationNameCell);

  const departureTimeCell = document.createElement("th");
  departureTimeCell.innerText = "Abfahrt";
  departureTimeCell.classList = "wait-time";
  headerRow.appendChild(departureTimeCell);

  departureTable.appendChild(headerRow);
};

const addRowToDepartureTable = (departures) => {
  const departureTable = document.querySelector("#departure-table");
  // reset old table data
  departureTable.innerHTML = "";
  addHeaderRowToDepartureTable(departureTable);

  departures.forEach((departure) => {
    const row = document.createElement("tr");

    const lineCell = document.createElement("td");
    lineCell.innerText = departure.line_id;
    lineCell.classList = "line";
    row.appendChild(lineCell);

    const directionCell = document.createElement("td");
    directionCell.innerText = departure.direction;
    directionCell.classList = "direction";
    row.appendChild(directionCell);

    const stationNameCell = document.createElement("td");
    stationNameCell.innerText = departure.station_name;
    stationNameCell.classList = "station-name";
    row.appendChild(stationNameCell);

    const waitTimeCell = document.createElement("td");
    waitTimeCell.innerText = departure.wait_time + " Min";
    waitTimeCell.classList = "wait-time";
    row.appendChild(waitTimeCell);

    departureTable.appendChild(row);
  });
};

const filterBelowWalkingTime = (departures) => {
  return departures.filter((dep) => {
    const stationWalkingTime = getStationWalkingTime(dep.station_id);
    return stationWalkingTime > dep.wait_time ? false : true;
  });
};

const refreshDepartureDates = () => {
  const promisedDepartures = stations.map((station) =>
    fetchDepartureDates(station.id)
  );

  Promise.all(promisedDepartures)
    .then((departures) => R.flatten(departures))
    .then(filterBelowWalkingTime)
    .then((departures) => {
      const sortedDepartures = departures.sort((a, b) =>
        a.wait_time > b.wait_time ? 1 : -1
      );
      addRowToDepartureTable(sortedDepartures.slice(0, MAX_DISPLAY_LENGTH));
    })
    .catch((err) => console.log(`failed to fetch data for station. ${err}`));
};

// fill table initially
refreshDepartureDates();

// fill table every 30s
setInterval(() => {
  refreshDepartureDates();
}, REFRESH_INTERVAL_MS);
