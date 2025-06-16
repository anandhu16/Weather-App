import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { coordinatesSchema, citySearchSchema, type WeatherData, type ForecastData, type SearchResult } from "@shared/schema";
import { z } from "zod";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0";

async function fetchFromOpenWeather(url: string): Promise<any> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeather API key not configured");
  }

  const response = await fetch(`${url}&appid=${OPENWEATHER_API_KEY}`);
  
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

function transformWeatherData(data: any, locationName?: string): WeatherData {
  return {
    location: {
      name: locationName || data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
    current: {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind?.speed || 0,
      wind_deg: data.wind?.deg || 0,
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        id: data.weather[0].id,
      },
      visibility: data.visibility || 0,
      dt: data.dt,
    },
    sys: {
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    },
  };
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

      const data = await fetchFromOpenWeather(
        `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric`
      );

      const weatherData = transformWeatherData(data);
      
      // Cache the result
      await storage.setCachedWeather(lat, lon, weatherData);
      
      res.json(weatherData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid coordinates", errors: error.errors });
      } else if (error instanceof Error) {
        if (error.message === "OpenWeather API key not configured") {
          res.status(500).json({ message: "Weather service not configured. Please provide OPENWEATHER_API_KEY." });
        } else {
          res.status(500).json({ message: error.message });
        }
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

      const data = await fetchFromOpenWeather(
        `${API_BASE_URL}/weather?q=${encodeURIComponent(query)}&units=metric`
      );

      const weatherData = transformWeatherData(data, query);
      
      // Cache the result
      await storage.setCachedWeather(data.coord.lat, data.coord.lon, weatherData);
      
      res.json(weatherData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid city name", errors: error.errors });
      } else if (error instanceof Error) {
        if (error.message === "OpenWeather API key not configured") {
          res.status(500).json({ message: "Weather service not configured. Please provide OPENWEATHER_API_KEY." });
        } else {
          res.status(500).json({ message: error.message });
        }
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

      const data = await fetchFromOpenWeather(
        `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric`
      );

      const forecastData: ForecastData = {
        list: data.list,
        city: {
          name: data.city.name,
          country: data.city.country,
        },
      };
      
      // Cache the result
      await storage.setCachedForecast(lat, lon, forecastData);
      
      res.json(forecastData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid coordinates", errors: error.errors });
      } else if (error instanceof Error) {
        if (error.message === "OpenWeather API key not configured") {
          res.status(500).json({ message: "Weather service not configured. Please provide OPENWEATHER_API_KEY." });
        } else {
          res.status(500).json({ message: error.message });
        }
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

      const data = await fetchFromOpenWeather(
        `${GEO_API_URL}/direct?q=${encodeURIComponent(query)}&limit=5`
      );

      const results: SearchResult[] = data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      }));

      res.json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search query", errors: error.errors });
      } else if (error instanceof Error) {
        if (error.message === "OpenWeather API key not configured") {
          res.status(500).json({ message: "Weather service not configured. Please provide OPENWEATHER_API_KEY." });
        } else {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: "Failed to search cities" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
