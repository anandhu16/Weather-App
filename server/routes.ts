import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { coordinatesSchema, citySearchSchema, type WeatherData, type ForecastData, type SearchResult } from "@shared/schema";
import { z } from "zod";

const WEATHER_API_KEY = "563f2884f5b84848a1a91323251606";
const API_BASE_URL = "https://api.weatherapi.com/v1";

async function fetchFromWeatherAPI(url: string): Promise<any> {
  const response = await fetch(`${url}&key=${WEATHER_API_KEY}`);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid API key");
    } else if (response.status === 404) {
      throw new Error("Location not found");
    } else {
      throw new Error(`API request failed: ${response.statusText}`);
    }
  }

  return response.json();
}

function transformWeatherData(data: any): WeatherData {
  // Get today's forecast for min/max temps if available
  const todayForecast = data.forecast?.forecastday?.[0];
  
  return {
    location: {
      name: data.location.name,
      country: data.location.country,
      lat: data.location.lat,
      lon: data.location.lon,
    },
    current: {
      temp: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      temp_min: todayForecast?.day?.mintemp_c || data.current.temp_c,
      temp_max: todayForecast?.day?.maxtemp_c || data.current.temp_c,
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
      wind_speed: data.current.wind_kph / 3.6, // Convert kph to m/s
      wind_deg: data.current.wind_degree,
      weather: {
        main: data.current.condition.text,
        description: data.current.condition.text,
        icon: getIconCode(data.current.condition.code, data.current.is_day),
        id: data.current.condition.code,
      },
      visibility: data.current.vis_km * 1000, // Convert km to meters
      dt: Math.floor(new Date(data.location.localtime).getTime() / 1000),
    },
    sys: {
      sunrise: todayForecast ? parseTimeToTimestamp(todayForecast.astro.sunrise) : getDefaultTime(6, 0),
      sunset: todayForecast ? parseTimeToTimestamp(todayForecast.astro.sunset) : getDefaultTime(18, 0),
    },
  };
}

function parseTimeToTimestamp(timeStr: string): number {
  const today = new Date();
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;
  
  today.setHours(hour24, minutes, 0, 0);
  return Math.floor(today.getTime() / 1000);
}

function getDefaultTime(hour: number, minute: number): number {
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  return Math.floor(today.getTime() / 1000);
}

// Map WeatherAPI condition codes to OpenWeatherMap-style icon codes for consistency
function getIconCode(conditionCode: number, isDay: number): string {
  const dayNight = isDay ? 'd' : 'n';
  
  // Sunny/Clear
  if (conditionCode === 1000) return `01${dayNight}`;
  
  // Partly cloudy
  if ([1003].includes(conditionCode)) return `02${dayNight}`;
  
  // Cloudy
  if ([1006, 1009].includes(conditionCode)) return `03${dayNight}`;
  
  // Overcast
  if ([1030, 1135, 1147].includes(conditionCode)) return `04${dayNight}`;
  
  // Rain
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) {
    return `10${dayNight}`;
  }
  
  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) return `11${dayNight}`;
  
  // Snow
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) {
    return `13${dayNight}`;
  }
  
  // Default to cloudy
  return `03${dayNight}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current weather by coordinates
  app.get("/api/weather/current", async (req, res) => {
    try {
      const { lat, lon } = coordinatesSchema.parse({
        lat: parseFloat(req.query.lat as string),
        lon: parseFloat(req.query.lon as string),
      });

      // Check cache first
      const cached = await storage.getCachedWeather(lat, lon);
      if (cached) {
        return res.json(cached);
      }

      const data = await fetchFromWeatherAPI(
        `${API_BASE_URL}/forecast.json?q=${lat},${lon}&days=1&aqi=no&alerts=no`
      );

      const weatherData = transformWeatherData(data);
      
      // Cache the result
      await storage.setCachedWeather(lat, lon, weatherData);
      
      res.json(weatherData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid coordinates", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to fetch weather data" });
      }
    }
  });

  // Get weather by city name
  app.get("/api/weather/city", async (req, res) => {
    try {
      const { query } = citySearchSchema.parse({
        query: req.query.q as string,
      });

      const data = await fetchFromWeatherAPI(
        `${API_BASE_URL}/current.json?q=${encodeURIComponent(query)}&aqi=no`
      );

      const weatherData = transformWeatherData(data);
      
      // Cache the result
      await storage.setCachedWeather(data.location.lat, data.location.lon, weatherData);
      
      res.json(weatherData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid city name", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to fetch weather data" });
      }
    }
  });

  // Get 5-day forecast
  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const { lat, lon } = coordinatesSchema.parse({
        lat: parseFloat(req.query.lat as string),
        lon: parseFloat(req.query.lon as string),
      });

      // Check cache first
      const cached = await storage.getCachedForecast(lat, lon);
      if (cached) {
        return res.json(cached);
      }

      const data = await fetchFromWeatherAPI(
        `${API_BASE_URL}/forecast.json?q=${lat},${lon}&days=5&aqi=no&alerts=no`
      );

      // Transform WeatherAPI forecast to match our ForecastData interface
      const forecastData: ForecastData = {
        list: data.forecast.forecastday.flatMap((day: any) => 
          day.hour.map((hour: any) => ({
            dt: Math.floor(new Date(hour.time).getTime() / 1000),
            main: {
              temp: hour.temp_c,
              feels_like: hour.feelslike_c,
              temp_min: hour.temp_c,
              temp_max: hour.temp_c,
              humidity: hour.humidity,
            },
            weather: [{
              main: hour.condition.text,
              description: hour.condition.text,
              icon: getIconCode(hour.condition.code, hour.is_day),
              id: hour.condition.code,
            }],
            wind: {
              speed: hour.wind_kph / 3.6, // Convert kph to m/s
              deg: hour.wind_degree,
            },
            dt_txt: hour.time,
          }))
        ),
        city: {
          name: data.location.name,
          country: data.location.country,
        },
      };
      
      // Cache the result
      await storage.setCachedForecast(lat, lon, forecastData);
      
      res.json(forecastData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid coordinates", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to fetch forecast data" });
      }
    }
  });

  // Search cities for autocomplete
  app.get("/api/weather/search", async (req, res) => {
    try {
      const { query } = citySearchSchema.parse({
        query: req.query.q as string,
      });

      const data = await fetchFromWeatherAPI(
        `${API_BASE_URL}/search.json?q=${encodeURIComponent(query)}`
      );

      const results: SearchResult[] = data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.region,
        lat: item.lat,
        lon: item.lon,
      }));

      res.json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search query", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to search cities" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
