import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Check } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExportRequest {
  format: string;
  dateRange: string;
  includeData: {
    inventory: boolean;
    orders: boolean;
    suppliers: boolean;
  };
}

export default function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { toast } = useToast();
  const [format, setFormat] = useState("xlsx");
  const [dateRange, setDateRange] = useState("30days");
  const [includeData, setIncludeData] = useState({
    inventory: true,
    orders: true,
    suppliers: false,
  });

  const exportMutation = useMutation({
    mutationFn: async (data: ExportRequest) => {
      const response = await apiRequest("POST", "/api/export", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Export Started",
        description: "Your data export has been initiated. You'll receive a download link shortly.",
      });
      onOpenChange(false);
      // Reset form
      setFormat("xlsx");
      setDateRange("30days");
      setIncludeData({
        inventory: true,
        orders: true,
        suppliers: false,
      });
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "There was an error generating your export. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    exportMutation.mutate({
      format,
      dateRange,
      includeData,
    });
  };

  const formatOptions = [
    { value: "xlsx", label: "Excel (.xlsx)" },
    { value: "csv", label: "CSV (.csv)" },
    { value: "pdf", label: "PDF Report" },
  ];

  const dateRangeOptions = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "custom", label: "Custom range" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="format" className="block text-sm font-medium mb-2">
              Export Format
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateRange" className="block text-sm font-medium mb-2">
              Data Range
            </Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-2">
              Include Data
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inventory"
                  checked={includeData.inventory}
                  onCheckedChange={(checked) =>
                    setIncludeData(prev => ({ ...prev, inventory: !!checked }))
                  }
                />
                <Label htmlFor="inventory" className="text-sm">
                  Inventory levels
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="orders"
                  checked={includeData.orders}
                  onCheckedChange={(checked) =>
                    setIncludeData(prev => ({ ...prev, orders: !!checked }))
                  }
                />
                <Label htmlFor="orders" className="text-sm">
                  Order history
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suppliers"
                  checked={includeData.suppliers}
                  onCheckedChange={(checked) =>
                    setIncludeData(prev => ({ ...prev, suppliers: !!checked }))
                  }
                />
                <Label htmlFor="suppliers" className="text-sm">
                  Supplier performance
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={exportMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
