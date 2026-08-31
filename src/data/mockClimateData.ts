export interface DecadalExtentPoint {
  year: number;
  maxExtentMillionKm2: number;
  minExtentMillionKm2: number;
  meanAnomalyMillionKm2: number;
}

export const DECADAL_SEA_ICE_EXTENT: DecadalExtentPoint[] = [
  { year: 1980, maxExtentMillionKm2: 19.1, minExtentMillionKm2: 3.1, meanAnomalyMillionKm2: +0.22 },
  { year: 1985, maxExtentMillionKm2: 18.9, minExtentMillionKm2: 2.9, meanAnomalyMillionKm2: +0.08 },
  { year: 1990, maxExtentMillionKm2: 19.2, minExtentMillionKm2: 3.3, meanAnomalyMillionKm2: +0.31 },
  { year: 1995, maxExtentMillionKm2: 19.0, minExtentMillionKm2: 3.2, meanAnomalyMillionKm2: +0.15 },
  { year: 2000, maxExtentMillionKm2: 19.4, minExtentMillionKm2: 3.0, meanAnomalyMillionKm2: +0.38 },
  { year: 2005, maxExtentMillionKm2: 19.3, minExtentMillionKm2: 2.8, meanAnomalyMillionKm2: +0.24 },
  { year: 2010, maxExtentMillionKm2: 19.6, minExtentMillionKm2: 3.1, meanAnomalyMillionKm2: +0.45 },
  { year: 2014, maxExtentMillionKm2: 20.1, minExtentMillionKm2: 3.7, meanAnomalyMillionKm2: +1.10 }, // Record High
  { year: 2018, maxExtentMillionKm2: 18.2, minExtentMillionKm2: 2.3, meanAnomalyMillionKm2: -0.62 },
  { year: 2022, maxExtentMillionKm2: 18.1, minExtentMillionKm2: 1.9, meanAnomalyMillionKm2: -1.05 },
  { year: 2023, maxExtentMillionKm2: 16.9, minExtentMillionKm2: 1.79, meanAnomalyMillionKm2: -2.35 }, // Record Low
  { year: 2024, maxExtentMillionKm2: 17.1, minExtentMillionKm2: 1.85, meanAnomalyMillionKm2: -1.98 },
  { year: 2025, maxExtentMillionKm2: 17.3, minExtentMillionKm2: 1.92, meanAnomalyMillionKm2: -1.72 },
  { year: 2026, maxExtentMillionKm2: 17.5, minExtentMillionKm2: 2.05, meanAnomalyMillionKm2: -1.54 }
];

export interface CalvingEvent {
  id: string;
  name: string;
  sourceShelf: string;
  year: number;
  initialSizeKm2: number;
  initialMassGt: number;
  fate: string;
}

export const HISTORIC_CALVING_EVENTS: CalvingEvent[] = [
  { id: 'B15', name: 'Iceberg B-15', sourceShelf: 'Ross Ice Shelf', year: 2000, initialSizeKm2: 11000, initialMassGt: 3000, fate: 'Largest recorded iceberg in history; fragmented over 20 years across Southern Ocean.' },
  { id: 'A68', name: 'Iceberg A-68', sourceShelf: 'Larsen C Ice Shelf', year: 2017, initialSizeKm2: 5800, initialMassGt: 1000, fate: 'Drifted through Weddell Sea into Scotia Sea; disintegrated near South Georgia in 2021.' },
  { id: 'A76', name: 'Iceberg A-76', sourceShelf: 'Ronne Ice Shelf', year: 2021, initialSizeKm2: 4320, initialMassGt: 850, fate: 'Broke into A-76A/B/C; A-76A drifted into South Atlantic.' },
  { id: 'A23A', name: 'Mega-Iceberg A23A', sourceShelf: 'Filchner-Ronne Ice Shelf', year: 1986, initialSizeKm2: 4000, initialMassGt: 1100, fate: 'Grounded for 35+ years; broke free in 2020 and currently actively transiting Scotia Sea.' },
  { id: 'D28', name: 'Iceberg D-28', sourceShelf: 'Amery Ice Shelf', year: 2019, initialSizeKm2: 1636, initialMassGt: 315, fate: 'Calved from Loose Tooth rift near Prydz Bay; drifting along Antarctic Coastal Current.' }
];

export const MONTHLY_SEASONAL_CYCLE = [
  { month: 'Jan', extentMillionKm2: 4.8, sstAnomalyC: +0.4 },
  { month: 'Feb', extentMillionKm2: 2.2, sstAnomalyC: +0.6 }, // Summer Minimum
  { month: 'Mar', extentMillionKm2: 3.9, sstAnomalyC: +0.5 },
  { month: 'Apr', extentMillionKm2: 7.4, sstAnomalyC: +0.2 },
  { month: 'May', extentMillionKm2: 11.2, sstAnomalyC: -0.1 },
  { month: 'Jun', extentMillionKm2: 14.5, sstAnomalyC: -0.4 },
  { month: 'Jul', extentMillionKm2: 16.8, sstAnomalyC: -0.6 },
  { month: 'Aug', extentMillionKm2: 18.2, sstAnomalyC: -0.8 },
  { month: 'Sep', extentMillionKm2: 18.9, sstAnomalyC: -0.9 }, // Winter Maximum
  { month: 'Oct', extentMillionKm2: 18.1, sstAnomalyC: -0.7 },
  { month: 'Nov', extentMillionKm2: 15.3, sstAnomalyC: -0.2 },
  { month: 'Dec', extentMillionKm2: 9.8, sstAnomalyC: +0.2 }
];
