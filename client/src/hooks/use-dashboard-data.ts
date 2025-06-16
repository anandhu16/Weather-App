import { useQuery } from "@tanstack/react-query";
import type { DashboardKPIs, InventoryLevel, SupplierWithStatus, Activity } from "@shared/schema";

export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: ["/api/dashboard/kpis"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useInventoryLevels(days: number = 30) {
  return useQuery<InventoryLevel[]>({
    queryKey: ["/api/dashboard/inventory-levels", days],
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useSupplierStatus() {
  return useQuery<SupplierWithStatus[]>({
    queryKey: ["/api/dashboard/suppliers"],
    refetchInterval: 30000,
  });
}

export function useRecentActivities(limit: number = 20) {
  return useQuery<Activity[]>({
    queryKey: ["/api/dashboard/activities", limit],
    refetchInterval: 15000, // Refresh every 15 seconds
  });
}
