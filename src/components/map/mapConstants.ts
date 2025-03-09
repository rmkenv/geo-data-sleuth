
// Census TIGERweb Services
export const TIGERWEB_SERVICES = {
  states: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1',
  counties: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/3',
  tracts: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/2',
  blockGroups: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/3',
  blocks: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/10'
};

export const GEOGRAPHY_LEVELS = [
  { id: 'state', name: 'States', service: TIGERWEB_SERVICES.states },
  { id: 'county', name: 'Counties', service: TIGERWEB_SERVICES.counties },
  { id: 'tract', name: 'Census Tracts', service: TIGERWEB_SERVICES.tracts },
  { id: 'blockGroup', name: 'Block Groups', service: TIGERWEB_SERVICES.blockGroups },
  { id: 'block', name: 'Census Blocks', service: TIGERWEB_SERVICES.blocks }
];

// Census Geocoder Services
export const CENSUS_GEOCODER = {
  onelineAddress: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
  address: 'https://geocoding.geo.census.gov/geocoder/locations/address',
  coordinates: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
  benchmark: '2020',
  vintage: '2020'
};
