import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInventoryLevels } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function InventoryChart() {
  const { data: levels, isLoading } = useInventoryLevels(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!levels || levels.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Inventory Levels</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No inventory data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Inventory Levels</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
          View Details
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={levels}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-gray-600"
              />
              <YAxis 
                tickFormatter={formatValue}
                className="text-gray-600"
              />
              <Tooltip 
                formatter={(value: number) => [formatValue(value), "Inventory Value"]}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(207, 90%, 54%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(207, 90%, 54%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(207, 90%, 54%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
