import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";
import { useCitySearch, useGeolocation } from "@/hooks/useWeather";
import { useToast } from "@/hooks/use-toast";
import type { SearchResult } from "@shared/schema";
import { useDebounce } from "../../hooks/use-debounce";

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number, name?: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({
  onLocationSelect,
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const debouncedQuery = useDebounce(query, 300);
  const citySearch = useCitySearch(debouncedQuery);
  const geolocation = useGeolocation();

  const handleLocationSelect = useCallback(
    (result: SearchResult) => {
      onLocationSelect(result.lat, result.lon, result.name);
      setQuery(result.name);
      setShowResults(false);
    },
    [onLocationSelect]
  );

  const handleCurrentLocation = useCallback(() => {
    geolocation.mutate(undefined, {
      onSuccess: (coords) => {
        onLocationSelect(coords.lat, coords.lon);
        toast({
          title: "Location found",
          description: "Weather data loaded for your current location",
        });
      },
      onError: (error) => {
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }, [geolocation, onLocationSelect, toast]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && citySearch.data && citySearch.data.length > 0) {
        handleLocationSelect(citySearch.data[0]);
      }
    },
    [query, citySearch.data, handleLocationSelect]
  );

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            className="pl-10 pr-4"
            disabled={isLoading}
          />
          {citySearch.isFetching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCurrentLocation}
          disabled={geolocation.isPending || isLoading}
          title="Use current location">
          {geolocation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Search Results */}
      {showResults && citySearch.data && citySearch.data.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {citySearch.data.map((result, index) => (
                <button
                  key={`${result.lat}-${result.lon}-${index}`}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-gray-500">
                          {result.state ? `${result.state}, ` : ""}
                          {result.country}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {result.lat.toFixed(2)}, {result.lon.toFixed(2)}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults &&
        citySearch.data &&
        citySearch.data.length === 0 &&
        !citySearch.isFetching && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
            <CardContent className="p-4 text-center text-gray-500">
              No cities found for "{query}"
            </CardContent>
          </Card>
        )}

      {/* Error */}
      {citySearch.error && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4 text-center text-red-500">
            {citySearch.error.message}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
