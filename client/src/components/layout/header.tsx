import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Download, Menu } from "lucide-react";
import ExportModal from "@/components/modals/export-modal";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">{subtitle || currentDate}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <ExportModal 
        open={showExportModal} 
        onOpenChange={setShowExportModal} 
      />
    </>
  );
}
