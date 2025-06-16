import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeatherData } from "@shared/schema";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Eye, 
  Droplets, 
  Gauge,
  Sunrise,
  Sunset,
  Thermometer
} from "lucide-react";

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

const getWeatherIcon = (iconCode: string) => {
  const code = iconCode.slice(0, 2);
  switch (code) {
    case '01': return <Sun className="h-12 w-12 text-yellow-500" />;
    case '02':
    case '03':
    case '04': return <Cloud className="h-12 w-12 text-gray-500" />;
    case '09':
    case '10': return <CloudRain className="h-12 w-12 text-blue-500" />;
    case '11': return <CloudRain className="h-12 w-12 text-purple-500" />;
    case '13': return <CloudSnow className="h-12 w-12 text-blue-300" />;
    default: return <Cloud className="h-12 w-12 text-gray-500" />;
  }
};

const getBackgroundGradient = (iconCode: string) => {
  const isDay = iconCode.endsWith('d');
  const code = iconCode.slice(0, 2);
  
  if (!isDay) {
    return "from-slate-800 to-slate-900";
  }
  
  switch (code) {
    case '01': return "from-sky-400 to-blue-500";
    case '02':
    case '03': return "from-gray-400 to-gray-600";
    case '04': return "from-gray-500 to-gray-700";
    case '09':
    case '10': return "from-blue-400 to-blue-700";
    case '11': return "from-purple-400 to-purple-700";
    case '13': return "from-blue-200 to-blue-400";
    default: return "from-sky-400 to-blue-500";
  }
};

export default function WeatherCard({ weather, className = "" }: WeatherCardProps) {
  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp * 1000));
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date(timestamp * 1000));
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`bg-gradient-to-br ${getBackgroundGradient(weather.current.weather.icon)} text-white`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{weather.location.name}</h1>
            <p className="text-sm opacity-90">{weather.location.country}</p>
            <p className="text-xs opacity-75">{formatDate(weather.current.dt)}</p>
          </div>

          {/* Main Weather */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getWeatherIcon(weather.current.weather.icon)}
              </div>
              <div className="text-5xl font-bold mb-2">
                {Math.round(weather.current.temp)}°
              </div>
              <p className="text-lg capitalize opacity-90">
                {weather.current.weather.description}
              </p>
              <p className="text-sm opacity-75">
                Feels like {Math.round(weather.current.feels_like)}°
              </p>
            </div>
          </div>

          {/* Temperature Range */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              <span className="text-sm">
                H: {Math.round(weather.current.temp_max)}°
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              <span className="text-sm">
                L: {Math.round(weather.current.temp_min)}°
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Details */}
      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Wind</p>
              <p className="text-sm font-medium">
                {Math.round(weather.current.wind_speed)} m/s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Humidity</p>
              <p className="text-sm font-medium">{weather.current.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Pressure</p>
              <p className="text-sm font-medium">{weather.current.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Visibility</p>
              <p className="text-sm font-medium">
                {Math.round(weather.current.visibility / 1000)} km
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Sunrise</p>
              <p className="text-sm font-medium">
                {formatTime(weather.sys.sunrise)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sunset className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Sunset</p>
              <p className="text-sm font-medium">
                {formatTime(weather.sys.sunset)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}