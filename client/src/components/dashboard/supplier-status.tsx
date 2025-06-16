import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupplierStatus } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor } from "@/lib/utils";

export default function SupplierStatus() {
  const { data: suppliers, isLoading } = useSupplierStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Supplier Status</CardTitle>
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

  if (!suppliers || suppliers.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Supplier Status</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No suppliers found
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitialColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'on track':
        return 'bg-primary';
      case 'delayed':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Supplier Status</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suppliers.slice(0, 3).map((supplier) => (
            <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getInitialColor(supplier.status)} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">
                    {supplier.initial}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{supplier.name}</p>
                  <p className="text-sm text-gray-600">{supplier.category}</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={getStatusColor(supplier.status)}
              >
                {supplier.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
