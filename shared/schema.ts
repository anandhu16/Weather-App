import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(), // Active, Delayed, On Track
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minimumThreshold: integer("minimum_threshold").notNull().default(10),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  status: text("status").notNull(), // Pending, In Progress, Completed, Cancelled
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull(),
  orderDate: timestamp("order_date").defaultNow(),
  expectedDelivery: timestamp("expected_delivery"),
  actualDelivery: timestamp("actual_delivery"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // Inventory, Shipping, Alert, Order
  description: text("description").notNull(),
  details: text("details"),
  status: text("status").notNull(), // Completed, In Progress, Requires Action
  relatedEntityType: text("related_entity_type"), // product, order, supplier
  relatedEntityId: integer("related_entity_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  type: text("type").notNull(), // IN, OUT, ADJUSTMENT
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, orderDate: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;

// KPI Dashboard Types
export interface DashboardKPIs {
  totalInventoryValue: string;
  inventoryGrowth: string;
  activeOrders: number;
  pendingOrders: number;
  supplierPerformance: string;
  onTimeDelivery: string;
  stockAlerts: number;
  criticalItems: string;
}

export interface InventoryLevel {
  date: string;
  value: number;
}

export interface SupplierWithStatus extends Supplier {
  initial: string;
}
