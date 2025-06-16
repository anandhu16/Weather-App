import { useQuery, useMutation } from "@tanstack/react-query";
import type { WeatherData, ForecastData, SearchResult, Coordinates } from "@shared/schema";

export function useCurrentWeather(lat?: number, lon?: number) {
  return useQuery<WeatherData>({
    queryKey: ["/api/weather/current", lat, lon],
    enabled: lat !== undefined && lon !== undefined,
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    staleTime: 5 * 60 * 1000, // Consider stale after 5 minutes
  });
}

export function useWeatherByCity() {
  return useMutation<WeatherData, Error, string>({
    mutationFn: async (city: string) => {
      const params = new URLSearchParams({ q: city });
      const response = await fetch(`/api/weather/city?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch weather data');
      }
      
      return response.json();
    },
  });
}

export function useForecast(lat?: number, lon?: number) {
  return useQuery<ForecastData>({
    queryKey: ["/api/weather/forecast", lat, lon],
    enabled: lat !== undefined && lon !== undefined,
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
    staleTime: 15 * 60 * 1000, // Consider stale after 15 minutes
  });
}

export function useCitySearch() {
  return useMutation<SearchResult[], Error, string>({
    mutationFn: async (query: string) => {
      if (query.length < 2) return [];
      
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`/api/weather/search?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search cities');
      }
      
      return response.json();
    },
  });
}

export function useGeolocation() {
  return useMutation<Coordinates, Error, void>({
    mutationFn: async () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Location access denied by user'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Location information unavailable'));
                break;
              case error.TIMEOUT:
                reject(new Error('Location request timed out'));
                break;
              default:
                reject(new Error('An unknown error occurred'));
                break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5 * 60 * 1000, // 5 minutes
          }
        );
      });
    },
  });
}