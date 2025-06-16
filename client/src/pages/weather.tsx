import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ForecastCard from "@/components/weather/ForecastCard";
import SearchBar from "@/components/weather/SearchBar";
import WeatherCard from "@/components/weather/WeatherCard";
import { useToast } from "@/hooks/use-toast";
import {
  useCurrentWeather,
  useForecast,
  useGeolocation,
} from "@/hooks/useWeather";
import { AlertTriangle, Cloud, RefreshCw, Sun } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

// Types
interface Coordinates {
  lat: number;
  lon: number;
}

// Components
const WeatherHeader = () => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-2 mb-4">
      <Cloud className="h-8 w-8 text-white" />
      <h1 className="text-4xl font-bold text-white">Weather App</h1>
    </div>
    <p className="text-white/80 text-lg">
      Real-time weather information and forecasts
    </p>
  </div>
);

const WeatherFooter = () => (
  <div className="text-center py-6 text-white/60 text-sm">
    <p>
      Weather data provided by{" "}
      <a
        href="https://www.weatherapi.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600">
        WeatherAPI.com
      </a>
    </p>
    <p className="mt-1">© 2025 Weather App. All rights reserved.</p>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="flex flex-col items-center">
      <div className="relative">
        <Cloud className="h-12 w-12 text-white/80 animate-pulse" />
        <Sun className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-spin-slow" />
      </div>
      <p className="mt-2 text-white/80 text-sm">Loading weather data...</p>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="mb-6 max-w-md mx-auto">
    <Alert
      variant="destructive"
      className="bg-red-500/20 border-red-500/30 text-white">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  </div>
);

const WelcomeState = () => (
  <div className="max-w-md mx-auto text-center">
    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
      <CardContent className="p-8">
        <div className="text-white mb-4">
          <Sun className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Welcome to Weather App</h3>
          <p className="text-white/80">
            Search for a city or allow location access to get started
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Utilities
const getBackgroundClass = (iconCode?: string) => {
  if (!iconCode) {
    return "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500";
  }

  const isDay = iconCode.endsWith("d");
  const code = iconCode.slice(0, 2);

  if (!isDay) {
    return "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900";
  }

  const gradients: Record<string, string> = {
    "01": "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500",
    "02": "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
    "03": "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
    "04": "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800",
    "09": "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
    "10": "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
    "11": "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800",
    "13": "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400",
  };

  return gradients[code] || gradients["01"];
};

// Main Component
export default function WeatherApp() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const { toast } = useToast();

  const weatherQuery = useCurrentWeather(coordinates?.lat, coordinates?.lon);
  const forecastQuery = useForecast(coordinates?.lat, coordinates?.lon);
  const geolocation = useGeolocation();

  // Handlers
  const handleLocationSelect = useCallback(
    (lat: number, lon: number, name?: string) => {
      setCoordinates({ lat, lon });
      setLocationName(name || "Selected Location");
    },
    []
  );

  const handleRefresh = useCallback(() => {
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      toast({
        title: "Refreshing weather data",
        description: "Getting the latest weather information...",
      });
    }
  }, [coordinates, weatherQuery, forecastQuery, toast]);

  // Effects
  useEffect(() => {
    if (!coordinates) {
      geolocation.mutate(undefined, {
        onSuccess: (coords) => {
          setCoordinates(coords);
          setLocationName("Your Location");
        },
        onError: (error) => {
          console.log("Geolocation not available:", error.message);
        },
      });
    }
  }, [coordinates, geolocation]);

  // Derived state
  const isLoading = weatherQuery.isLoading || geolocation.isPending;
  const hasError = weatherQuery.error || forecastQuery.error;
  const errorMessage =
    weatherQuery.error?.message ||
    forecastQuery.error?.message ||
    "Failed to load weather data";

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-1000 ${getBackgroundClass(
        weatherQuery.data?.current.weather.icon
      )}`}>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <WeatherHeader />

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <SearchBar
              onLocationSelect={handleLocationSelect}
              isLoading={isLoading}
            />
          </div>
        </div>

        {hasError && <ErrorState message={errorMessage} />}

        {isLoading && !weatherQuery.data && <LoadingState />}

        {weatherQuery.data && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {locationName || weatherQuery.data.location.name}
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={weatherQuery.isFetching || forecastQuery.isFetching}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    weatherQuery.isFetching ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherCard weather={weatherQuery.data} />
              {forecastQuery.data ? (
                <ForecastCard forecast={forecastQuery.data} />
              ) : forecastQuery.isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-gray-500">
                      Forecast data unavailable
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {!isLoading && !weatherQuery.data && !hasError && <WelcomeState />}
      </div>

      <WeatherFooter />
    </div>
  );
}
