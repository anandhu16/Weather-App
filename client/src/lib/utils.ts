import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'on track':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'in progress':
    case 'delayed':
      return 'bg-yellow-100 text-yellow-800';
    case 'requires action':
    case 'critical':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getActivityIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'inventory':
      return 'fa-box';
    case 'shipping':
      return 'fa-truck';
    case 'alert':
      return 'fa-exclamation-triangle';
    case 'order':
      return 'fa-shopping-cart';
    default:
      return 'fa-info-circle';
  }
}
