
// Updated TIGERweb Services URLs - Using corrected endpoints
export const TIGERWEB_SERVICES = {
  states: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/84',
  counties: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/86',
  tracts: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/28',
  blockGroups: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/32',
  blocks: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/26',
  zip: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/26'
};

export const GEOGRAPHY_LEVELS = [
  { id: 'state', name: 'States', service: TIGERWEB_SERVICES.states },
  { id: 'county', name: 'Counties', service: TIGERWEB_SERVICES.counties },
  { id: 'tract', name: 'Census Tracts', service: TIGERWEB_SERVICES.tracts },
  { id: 'blockGroup', name: 'Block Groups', service: TIGERWEB_SERVICES.blockGroups },
  { id: 'block', name: 'Census Blocks', service: TIGERWEB_SERVICES.blocks },
  { id: 'zip', name: 'ZIP Codes', service: TIGERWEB_SERVICES.zip }
];

// Census Geocoder Services
export const CENSUS_GEOCODER = {
  onelineAddress: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
  address: 'https://geocoding.geo.census.gov/geocoder/locations/address',
  coordinates: 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates',
  benchmark: '2020',
  vintage: '2020',
  key: '33ff48a144036b88ae3dcec421c8bdf908501554'
};

// Fallback GeoJSON sources
export const FALLBACK_GEOJSON = {
  states: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
  counties: 'https://raw.githubusercontent.com/deldersveld/topojson/master/counties/us-counties.json',
  tracts: 'https://raw.githubusercontent.com/plotly/datasets/master/minoritymajority.json'
};
