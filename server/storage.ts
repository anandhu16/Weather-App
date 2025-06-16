import { 
  users, 
  suppliers, 
  products, 
  orders, 
  orderItems, 
  activities, 
  inventoryTransactions,
  type User, 
  type Supplier, 
  type Product, 
  type Order, 
  type OrderItem, 
  type Activity, 
  type InventoryTransaction,
  type InsertUser, 
  type InsertSupplier, 
  type InsertProduct, 
  type InsertOrder, 
  type InsertOrderItem, 
  type InsertActivity, 
  type InsertInventoryTransaction,
  type DashboardKPIs,
  type InventoryLevel,
  type SupplierWithStatus
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Suppliers
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsBelowThreshold(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getActiveOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Activities
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Inventory Transactions
  getInventoryTransactions(productId?: number): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;

  // Dashboard
  getDashboardKPIs(): Promise<DashboardKPIs>;
  getInventoryLevels(days: number): Promise<InventoryLevel[]>;
  getSuppliersWithStatus(): Promise<SupplierWithStatus[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private suppliers: Map<number, Supplier> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();
  private activities: Map<number, Activity> = new Map();
  private inventoryTransactions: Map<number, InventoryTransaction> = new Map();
  
  private currentUserId = 1;
  private currentSupplierId = 1;
  private currentProductId = 1;
  private currentOrderId = 1;
  private currentOrderItemId = 1;
  private currentActivityId = 1;
  private currentTransactionId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample suppliers
    const acmeCorp = this.createSupplier({
      name: "Acme Corp",
      category: "Electronics",
      status: "Active",
      contactEmail: "contact@acmecorp.com",
      performanceScore: "94.2"
    });

    const globalLogistics = this.createSupplier({
      name: "Global Logistics",
      category: "Shipping",
      status: "Delayed",
      contactEmail: "ops@globallogistics.com",
      performanceScore: "87.5"
    });

    const techSupply = this.createSupplier({
      name: "TechSupply Inc",
      category: "Components",
      status: "On Track",
      contactEmail: "support@techsupply.com",
      performanceScore: "96.1"
    });

    // Create sample products
    this.createProduct({
      sku: "SKU-12345",
      name: "Electronic Component A",
      category: "Electronics",
      currentStock: 500,
      minimumThreshold: 100,
      unitPrice: "25.50",
      supplierId: 1
    });

    this.createProduct({
      sku: "XYZ-789",
      name: "Component XYZ",
      category: "Components",
      currentStock: 15,
      minimumThreshold: 50,
      unitPrice: "45.00",
      supplierId: 3
    });

    // Create sample orders
    this.createOrder({
      orderNumber: "ORD-7890",
      supplierId: 2,
      status: "In Progress",
      totalValue: "15750.00",
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Create sample activities
    this.createActivity({
      type: "Inventory",
      description: "New inventory received",
      details: "500 units of SKU-12345",
      status: "Completed",
      relatedEntityType: "product",
      relatedEntityId: 1
    });

    this.createActivity({
      type: "Shipping",
      description: "Shipment delayed",
      details: "Order #ORD-7890 from Global Logistics",
      status: "In Progress",
      relatedEntityType: "order",
      relatedEntityId: 1
    });

    this.createActivity({
      type: "Alert",
      description: "Low stock alert",
      details: "Product XYZ-789 below minimum threshold",
      status: "Requires Action",
      relatedEntityType: "product",
      relatedEntityId: 2
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentSupplierId++;
    const supplier: Supplier = {
      ...insertSupplier,
      id,
      createdAt: new Date()
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: number, supplierUpdate: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updated = { ...supplier, ...supplierUpdate };
    this.suppliers.set(id, updated);
    return updated;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsBelowThreshold(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.currentStock <= p.minimumThreshold);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...productUpdate };
    this.products.set(id, updated);
    return updated;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getActiveOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => 
      o.status === "Pending" || o.status === "In Progress"
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      orderDate: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated = { ...order, ...orderUpdate };
    this.orders.set(id, updated);
    return updated;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Activities
  async getRecentActivities(limit = 20): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Inventory Transactions
  async getInventoryTransactions(productId?: number): Promise<InventoryTransaction[]> {
    const transactions = Array.from(this.inventoryTransactions.values());
    return productId 
      ? transactions.filter(t => t.productId === productId)
      : transactions;
  }

  async createInventoryTransaction(insertTransaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = this.currentTransactionId++;
    const transaction: InventoryTransaction = {
      ...insertTransaction,
      id,
      createdAt: new Date()
    };
    this.inventoryTransactions.set(id, transaction);
    return transaction;
  }

  // Dashboard
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const products = await this.getAllProducts();
    const orders = await this.getAllOrders();
    const activeOrders = await this.getActiveOrders();
    const lowStockProducts = await this.getProductsBelowThreshold();
    
    const totalInventoryValue = products.reduce((sum, p) => 
      sum + (parseFloat(p.unitPrice) * p.currentStock), 0
    );

    const pendingOrders = activeOrders.filter(o => o.status === "Pending").length;

    return {
      totalInventoryValue: `$${(totalInventoryValue / 1000000).toFixed(1)}M`,
      inventoryGrowth: "+5.2%",
      activeOrders: activeOrders.length,
      pendingOrders,
      supplierPerformance: "94.2%",
      onTimeDelivery: "On-time delivery",
      stockAlerts: lowStockProducts.length,
      criticalItems: "Critical items"
    };
  }

  async getInventoryLevels(days: number): Promise<InventoryLevel[]> {
    const levels: InventoryLevel[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate inventory level data
      const baseValue = 2400000;
      const variance = Math.sin(i * 0.3) * 200000 + Math.random() * 100000;
      
      levels.push({
        date: date.toISOString().split('T')[0],
        value: baseValue + variance
      });
    }
    
    return levels;
  }

  async getSuppliersWithStatus(): Promise<SupplierWithStatus[]> {
    const suppliers = await this.getAllSuppliers();
    return suppliers.map(supplier => ({
      ...supplier,
      initial: supplier.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
    }));
  }
}

export const storage = new MemStorage();
