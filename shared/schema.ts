import { z } from "zod";

// Weather Data Types
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      main: string;
      description: string;
      icon: string;
      id: number;
    };
    visibility: number;
    dt: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
    id: number;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface SearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Validation schemas
export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const citySearchSchema = z.object({
  query: z.string().min(1).max(100),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type CitySearch = z.infer<typeof citySearchSchema>;
