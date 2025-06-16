import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import KPICards from "@/components/dashboard/kpi-cards";
import InventoryChart from "@/components/dashboard/inventory-chart";
import SupplierStatus from "@/components/dashboard/supplier-status";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Executive Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <KPICards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <InventoryChart />
            <SupplierStatus />
          </div>

          <RecentActivity />
        </main>
      </div>
    </div>
  );
}
