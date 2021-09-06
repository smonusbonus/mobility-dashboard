const MAX_DISPLAY_LENGTH = 10;
const REFRESH_INTERVAL_MS = 30000;
const DATA_SERVICE_BASE_URL = "https://kvb-api.herokuapp.com/";

const stations = [
  {
    id: 317,
    walkingTime: 8,
    name: "Amsterdamer Str./Gürtel",
  },
  {
    id: 314,
    walkingTime: 8,
    name: "Boltensternstr.",
  },
  {
    id: 319,
    walkingTime: 3,
    name: "Riehler Gürtel",
  },
];

module.exports = {
  MAX_DISPLAY_LENGTH,
  REFRESH_INTERVAL_MS,
  DATA_SERVICE_BASE_URL,
  stations,
};
