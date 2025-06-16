import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherCard from "@/components/weather/WeatherCard";
import SearchBar from "@/components/weather/SearchBar";
import ForecastCard from "@/components/weather/ForecastCard";
import { useCurrentWeather, useForecast, useGeolocation } from "@/hooks/useWeather";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Sun, CloudRain, RefreshCw, AlertTriangle } from "lucide-react";

export default function WeatherApp() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const { toast } = useToast();
  
  const weatherQuery = useCurrentWeather(coordinates?.lat, coordinates?.lon);
  const forecastQuery = useForecast(coordinates?.lat, coordinates?.lon);
  const geolocation = useGeolocation();

  // Try to get user's location on first load
  useEffect(() => {
    if (!coordinates) {
      geolocation.mutate(undefined, {
        onSuccess: (coords) => {
          setCoordinates(coords);
          setLocationName("Your Location");
        },
        onError: (error) => {
          // Silently fail for geolocation - user can search manually
          console.log("Geolocation not available:", error.message);
        },
      });
    }
  }, []);

  const handleLocationSelect = (lat: number, lon: number, name?: string) => {
    setCoordinates({ lat, lon });
    setLocationName(name || "Selected Location");
  };

  const handleRefresh = () => {
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      toast({
        title: "Refreshing weather data",
        description: "Getting the latest weather information...",
      });
    }
  };

  const getBackgroundClass = () => {
    if (weatherQuery.data?.current.weather.icon) {
      const iconCode = weatherQuery.data.current.weather.icon;
      const isDay = iconCode.endsWith('d');
      const code = iconCode.slice(0, 2);
      
      if (!isDay) {
        return "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900";
      }
      
      switch (code) {
        case '01': return "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500";
        case '02':
        case '03': return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
        case '04': return "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800";
        case '09':
        case '10': return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";
        case '11': return "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800";
        case '13': return "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400";
        default: return "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500";
      }
    }
    return "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500";
  };

  const isLoading = weatherQuery.isLoading || geolocation.isPending;
  const hasError = weatherQuery.error || forecastQuery.error;

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cloud className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Weather App</h1>
          </div>
          <p className="text-white/80 text-lg">
            Real-time weather information and forecasts
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <SearchBar 
              onLocationSelect={handleLocationSelect}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Error States */}
        {hasError && (
          <div className="mb-6 max-w-md mx-auto">
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/30 text-white">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {weatherQuery.error?.message || forecastQuery.error?.message || "Failed to load weather data"}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !weatherQuery.data && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Weather Data */}
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
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${weatherQuery.isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Weather */}
              <WeatherCard weather={weatherQuery.data} />

              {/* Forecast */}
              {forecastQuery.data ? (
                <ForecastCard forecast={forecastQuery.data} />
              ) : forecastQuery.isLoading ? (
                <Card>
                  <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      Forecast data unavailable
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !weatherQuery.data && !hasError && (
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
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-white/60 text-sm">
          <p>Weather data provided by OpenWeatherMap</p>
          <p className="mt-1">© 2025 Weather App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}