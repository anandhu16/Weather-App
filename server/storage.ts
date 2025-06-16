import type {
  WeatherData,
  ForecastData,
  SearchResult,
  Coordinates,
} from "@shared/schema";

export interface IStorage {
  // Weather cache for reducing API calls
  getCachedWeather(lat: number, lon: number): Promise<WeatherData | undefined>;
  setCachedWeather(lat: number, lon: number, data: WeatherData): Promise<void>;
  getCachedForecast(
    lat: number,
    lon: number
  ): Promise<ForecastData | undefined>;
  setCachedForecast(
    lat: number,
    lon: number,
    data: ForecastData
  ): Promise<void>;
}

export class MemStorage implements IStorage {
  private weatherCache: Map<string, { data: WeatherData; timestamp: number }> =
    new Map();
  private forecastCache: Map<
    string,
    { data: ForecastData; timestamp: number }
  > = new Map();

  private readonly CACHE_DURATION = parseInt(
    process.env.CACHE_DURATION || "600000",
    10
  ); // Default 10 minutes
  private readonly CLEANUP_INTERVAL = parseInt(
    process.env.CACHE_CLEANUP_INTERVAL || "1800000",
    10
  ); // Default 30 minutes

  constructor() {
    // Clean up expired cache entries
    setInterval(() => {
      this.cleanExpiredCache();
    }, this.CLEANUP_INTERVAL);
  }

  private cleanExpiredCache() {
    const now = Date.now();

    for (const [key, value] of Array.from(this.weatherCache.entries())) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.weatherCache.delete(key);
      }
    }

    for (const [key, value] of Array.from(this.forecastCache.entries())) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.forecastCache.delete(key);
      }
    }
  }

  private getCacheKey(lat: number, lon: number): string {
    return `${lat.toFixed(2)},${lon.toFixed(2)}`;
  }

  async getCachedWeather(
    lat: number,
    lon: number
  ): Promise<WeatherData | undefined> {
    const key = this.getCacheKey(lat, lon);
    const cached = this.weatherCache.get(key);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    return undefined;
  }

  async setCachedWeather(
    lat: number,
    lon: number,
    data: WeatherData
  ): Promise<void> {
    const key = this.getCacheKey(lat, lon);
    this.weatherCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async getCachedForecast(
    lat: number,
    lon: number
  ): Promise<ForecastData | undefined> {
    const key = this.getCacheKey(lat, lon);
    const cached = this.forecastCache.get(key);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    return undefined;
  }

  async setCachedForecast(
    lat: number,
    lon: number,
    data: ForecastData
  ): Promise<void> {
    const key = this.getCacheKey(lat, lon);
    this.forecastCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

export const storage = new MemStorage();
