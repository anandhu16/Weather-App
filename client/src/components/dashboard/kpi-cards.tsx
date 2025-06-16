import { Card, CardContent } from "@/components/ui/card";
import { useDashboardKPIs } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Warehouse, 
  ShoppingCart, 
  Truck, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

export default function KPICards() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Unable to load KPI data
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Inventory Value",
      value: kpis.totalInventoryValue,
      change: kpis.inventoryGrowth,
      changeType: "positive" as const,
      icon: Warehouse,
      bgColor: "bg-blue-50",
      iconColor: "text-primary"
    },
    {
      title: "Active Orders",
      value: kpis.activeOrders.toString(),
      change: `${kpis.pendingOrders} pending`,
      changeType: "neutral" as const,
      icon: ShoppingCart,
      bgColor: "bg-orange-50",
      iconColor: "text-warning"
    },
    {
      title: "Supplier Performance",
      value: kpis.supplierPerformance,
      change: kpis.onTimeDelivery,
      changeType: "positive" as const,
      icon: Truck,
      bgColor: "bg-green-50",
      iconColor: "text-success"
    },
    {
      title: "Stock Alerts",
      value: kpis.stockAlerts.toString(),
      change: kpis.criticalItems,
      changeType: "negative" as const,
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      iconColor: "text-error"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const ChangeIcon = card.changeType === "positive" ? TrendingUp : 
                          card.changeType === "negative" ? AlertTriangle : Clock;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    card.changeType === "positive" ? "text-success" :
                    card.changeType === "negative" ? "text-error" : "text-warning"
                  }`}>
                    <ChangeIcon className="mr-1 h-3 w-3" />
                    {card.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
