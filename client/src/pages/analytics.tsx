import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Analytics" subtitle="Business intelligence and performance insights" />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Analytics dashboard coming soon</p>
                <p className="text-gray-400 text-sm mt-2">This page will show advanced analytics, trends, and business intelligence reports</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
