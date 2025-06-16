import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Inventory() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Inventory Management" subtitle="Manage and track your inventory levels" />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Inventory management interface coming soon</p>
                <p className="text-gray-400 text-sm mt-2">This page will show detailed inventory listings, stock levels, and management tools</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
