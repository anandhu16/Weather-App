import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecentActivities } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor, getActivityIcon, formatTime } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivities();
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">Today</Button>
              <Button variant="ghost" size="sm">This Week</Button>
              <Button variant="ghost" size="sm" className="bg-primary text-white">All</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No recent activities found
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-orange-100 text-orange-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'order':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconBackground = (type: string) => {
    switch (type.toLowerCase()) {
      case 'inventory':
        return 'bg-blue-100';
      case 'shipping':
        return 'bg-orange-100';
      case 'alert':
        return 'bg-red-100';
      case 'order':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <div className="flex space-x-2">
            {(['today', 'week', 'all'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(filterType)}
                className={cn(
                  filter === filterType && "bg-primary text-white"
                )}
              >
                {filterType === 'today' ? 'Today' : 
                 filterType === 'week' ? 'This Week' : 'All'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.slice(0, 10).map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${getIconBackground(activity.type)} rounded-full flex items-center justify-center mr-3`}>
                        <i className={`fas ${getActivityIcon(activity.type)} text-sm`}></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.details}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className={getTypeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.createdAt ? formatTime(activity.createdAt) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
