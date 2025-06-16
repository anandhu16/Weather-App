import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Package, 
  Truck, 
  ClipboardList, 
  PieChart, 
  FileText,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SupplyChain Pro</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
              <p className="text-xs text-gray-500">Chief Operations Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
