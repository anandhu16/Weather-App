import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSupplierSchema, insertProductSchema, insertOrderSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard KPIs
  app.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const kpis = await storage.getDashboardKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });

  // Inventory levels for chart
  app.get("/api/dashboard/inventory-levels", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const levels = await storage.getInventoryLevels(days);
      res.json(levels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory levels" });
    }
  });

  // Suppliers with status
  app.get("/api/dashboard/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliersWithStatus();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  // Recent activities
  app.get("/api/dashboard/activities", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Suppliers CRUD
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create supplier" });
      }
    }
  });

  // Products CRUD
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/low-stock", async (req, res) => {
    try {
      const products = await storage.getProductsBelowThreshold();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  // Orders CRUD
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/active", async (req, res) => {
    try {
      const orders = await storage.getActiveOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  // Export functionality
  app.post("/api/export", async (req, res) => {
    try {
      const { format, dateRange, includeData } = req.body;
      
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        id: Date.now().toString(),
        format,
        dateRange,
        includeData,
        status: "completed",
        downloadUrl: `/api/export/download/${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate export" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
