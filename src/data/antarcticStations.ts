import type { Station } from '../types/navigation';

export const ANTARCTIC_STATIONS: Station[] = [
  {
    id: 'MAITRI',
    name: 'Maitri Research Station',
    country: 'India',
    countryCode: 'IN',
    lat: -70.767,
    lng: 11.733,
    type: 'RESEARCH_STATION',
    establishedYear: 1989,
    population: { summer: 65, winter: 25 },
    iceShelfOrCoast: 'Schirmacher Oasis, Queen Maud Land',
    description: "India's second permanent research station in Antarctica, located in the ice-free rocky plateau of Schirmacher Oasis. Critical hub for Indian Antarctic Expeditions (NCPOR)."
  },
  {
    id: 'BHARATI',
    name: 'Bharati Research Station',
    country: 'India',
    countryCode: 'IN',
    lat: -69.407,
    lng: 76.191,
    type: 'RESEARCH_STATION',
    establishedYear: 2012,
    population: { summer: 72, winter: 23 },
    iceShelfOrCoast: 'Larsemann Hills, Prydz Bay',
    description: "State-of-the-art energy-efficient Indian polar research station constructed from 134 prefabricated shipping containers. Specialized in oceanography, glaciology, and satellite telemetry."
  },
  {
    id: 'MCMURDO',
    name: 'McMurdo Station',
    country: 'United States',
    countryCode: 'US',
    lat: -77.846,
    lng: 166.668,
    type: 'RESEARCH_STATION',
    establishedYear: 1956,
    population: { summer: 1000, winter: 250 },
    iceShelfOrCoast: 'Ross Island, Ross Sea',
    description: "The largest research station in Antarctica, serving as the logistics hub for the US Antarctic Program and the gateway to the South Pole."
  },
  {
    id: 'ROTHERA',
    name: 'Rothera Research Station',
    country: 'United Kingdom',
    countryCode: 'GB',
    lat: -67.570,
    lng: -68.125,
    type: 'RESEARCH_STATION',
    establishedYear: 1975,
    population: { summer: 130, winter: 22 },
    iceShelfOrCoast: 'Adelaide Island, Antarctic Peninsula',
    description: "British Antarctic Survey principal logistics and research hub, equipped with the Biscoe Wharf and a 900m crushed rock runway."
  },
  {
    id: 'CASEY',
    name: 'Casey Station',
    country: 'Australia',
    countryCode: 'AU',
    lat: -66.282,
    lng: 110.528,
    type: 'RESEARCH_STATION',
    establishedYear: 1969,
    population: { summer: 110, winter: 20 },
    iceShelfOrCoast: 'Wilkes Land, East Antarctica',
    description: "Australian Antarctic Division station located in the Windmill Islands. Key hub for glaciology and deep ice core drilling operations."
  },
  {
    id: 'HALLEY_VI',
    name: 'Halley VI Research Station',
    country: 'United Kingdom',
    countryCode: 'GB',
    lat: -75.583,
    lng: -25.500,
    type: 'RESEARCH_STATION',
    establishedYear: 2012,
    population: { summer: 70, winter: 0 },
    iceShelfOrCoast: 'Brunt Ice Shelf, Weddell Sea',
    description: "World's first relocatable research station mounted on hydraulic legs with giant skis to avoid rifting hazards on the Brunt Ice Shelf."
  },
  {
    id: 'NEUMAYER_III',
    name: 'Neumayer Station III',
    country: 'Germany',
    countryCode: 'DE',
    lat: -70.674,
    lng: -8.274,
    type: 'RESEARCH_STATION',
    establishedYear: 2009,
    population: { summer: 60, winter: 9 },
    iceShelfOrCoast: 'Ekström Ice Shelf, Atka Bay',
    description: "Alfred Wegener Institute research center elevated on 16 hydraulic pillars above the drifting ice shelf."
  },
  {
    id: 'TROLL',
    name: 'Troll Research Station',
    country: 'Norway',
    countryCode: 'NO',
    lat: -72.012,
    lng: 2.533,
    type: 'RESEARCH_STATION',
    establishedYear: 1990,
    population: { summer: 45, winter: 8 },
    iceShelfOrCoast: 'Jutulsessen Nunatak, Queen Maud Land',
    description: "Norwegian polar station situated 235 km from the coast on solid rock with a 3,000m blue-ice runway."
  }
];

export const GATEWAY_PORTS: Station[] = [
  {
    id: 'PORT_CAPE_TOWN',
    name: 'Port of Cape Town',
    country: 'South Africa',
    countryCode: 'ZA',
    lat: -33.905,
    lng: 18.428,
    type: 'PORT',
    iceShelfOrCoast: 'Table Bay, Atlantic Ocean',
    description: "Primary logistical departure port for Indian (Maitri/Bharati), German, and Scandinavian Antarctic expeditions."
  },
  {
    id: 'PORT_PUNTA_ARENAS',
    name: 'Punta Arenas Gateway',
    country: 'Chile',
    countryCode: 'CL',
    lat: -53.163,
    lng: -70.917,
    type: 'PORT',
    iceShelfOrCoast: 'Strait of Magellan',
    description: "Principal southern South America gateway for Antarctic Peninsula and Weddell Sea vessel departures."
  },
  {
    id: 'PORT_HOBART',
    name: 'Port of Hobart',
    country: 'Australia',
    countryCode: 'AU',
    lat: -42.882,
    lng: 147.327,
    type: 'PORT',
    iceShelfOrCoast: 'Derwent River, Southern Ocean',
    description: "Main Australian and French gateway port for expeditions to East Antarctica, Prydz Bay, and Ross Sea."
  },
  {
    id: 'PORT_USHUAIA',
    name: 'Port of Ushuaia',
    country: 'Argentina',
    countryCode: 'AR',
    lat: -54.807,
    lng: -68.307,
    type: 'PORT',
    iceShelfOrCoast: 'Beagle Channel, Tierra del Fuego',
    description: "Southernmost commercial port in the world, heavily utilized for polar research and expedition logistics."
  }
];
