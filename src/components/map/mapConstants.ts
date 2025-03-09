
// Census TIGERweb Services - Using more reliable endpoints
export const TIGERWEB_SERVICES = {
  states: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State/MapServer/0',
  counties: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/County/MapServer/0',
  tracts: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0',
  blockGroups: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/1',
  blocks: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/10',
  zip: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/3'
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
