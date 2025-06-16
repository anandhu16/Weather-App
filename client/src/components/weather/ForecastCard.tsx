import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ForecastData } from "@shared/schema";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Thermometer,
  Droplets,
  Wind
} from "lucide-react";

interface ForecastCardProps {
  forecast: ForecastData;
  className?: string;
}

const getWeatherIcon = (iconCode: string, size = "h-6 w-6") => {
  const code = iconCode.slice(0, 2);
  const iconClass = `${size} text-gray-600`;
  
  switch (code) {
    case '01': return <Sun className={`${size} text-yellow-500`} />;
    case '02':
    case '03':
    case '04': return <Cloud className={iconClass} />;
    case '09':
    case '10': return <CloudRain className={`${size} text-blue-500`} />;
    case '11': return <CloudRain className={`${size} text-purple-500`} />;
    case '13': return <CloudSnow className={`${size} text-blue-300`} />;
    default: return <Cloud className={iconClass} />;
  }
};

export default function ForecastCard({ forecast, className = "" }: ForecastCardProps) {
  // Group forecast by day (take first forecast per day)
  const dailyForecasts = forecast.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {} as Record<string, typeof forecast.list[0]>);

  const dailyItems = Object.values(dailyForecasts).slice(0, 5);

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">5-Day Forecast</CardTitle>
        <p className="text-sm text-gray-500">{forecast.city.name}, {forecast.city.country}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dailyItems.map((item, index) => (
            <div key={item.dt} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium">
                  {formatDay(item.dt_txt)}
                </div>
                <div className="flex items-center gap-2">
                  {getWeatherIcon(item.weather[0].icon)}
                  <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                    {item.weather[0].description}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Droplets className="h-3 w-3" />
                  {item.main.humidity}%
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Wind className="h-3 w-3" />
                  {Math.round(item.wind.speed)}m/s
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{Math.round(item.main.temp_max)}°</span>
                  <span className="text-gray-400">{Math.round(item.main.temp_min)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Hourly forecast for today */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Today's Hourly Forecast</h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {forecast.list.slice(0, 8).map((item) => {
              const time = new Date(item.dt_txt).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              });
              
              return (
                <div key={item.dt} className="flex-shrink-0 text-center p-2 rounded-lg bg-white dark:bg-gray-700 border">
                  <div className="text-xs text-gray-500 mb-1">{time}</div>
                  <div className="flex justify-center mb-1">
                    {getWeatherIcon(item.weather[0].icon, "h-4 w-4")}
                  </div>
                  <div className="text-sm font-medium">{Math.round(item.main.temp)}°</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <Droplets className="h-2 w-2" />
                    {item.main.humidity}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}