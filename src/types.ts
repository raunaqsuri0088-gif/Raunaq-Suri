export enum BusinessType {
  RESTAURANT = "Restaurant / QSR",
  CATERER = "Caterer / Event Organizer",
  HOTEL = "Hotel / Resort",
  DISTRIBUTOR = "Distributor / Wholesaler",
  CLOUDKITCHEN = "Cloud Kitchen"
}

export enum UserRole {
  BUYER = "Buyer",
  ADMIN = "Admin"
}

export enum OrderStatus {
  RECEIVED = "Order Received",
  PROCESSING = "Processing & Blending",
  PACKED = "Packed & Quality Checked",
  SHIPPED = "In Transit / Shipped",
  DELIVERED = "Delivered & Verified"
}

export enum Language {
  EN = "en",
  HI = "hi",
  PA = "pa"
}

export interface User {
  id: string;
  companyName: string;
  gstNumber: string;
  phoneNumber: string;
  businessType: BusinessType;
  deliveryAddress: string;
  contactName: string;
  walletBalance: number;
  creditLimit: number;
  creditUsed: number;
  approved: boolean;
  role: UserRole;
  points: number;
  clubLevel: "Silver" | "Gold" | "Platinum";
}

export interface Product {
  id: string;
  name: { [key in Language]: string };
  sku: string;
  description: { [key in Language]: string };
  priceTiers: {
    minQty: number; // in kg
    maxQty: number; // in kg (-1 for infinity)
    pricePerKg: number; // in INR
  }[];
  category: "Masala Blend" | "Dehydrated Base" | "Specialty Blend";
  moq: number; // in kg
  bagsCount: number; // e.g. 5kg pouches per bag
  image: string;
  spiceLevel: "Mild" | "Medium" | "Hot" | "Extra Hot";
  shelfLife: string;
  inStockKg: number;
}

export interface CartItem {
  product: Product;
  quantityKg: number; // must be multiple of bagsCount if packaged in standard bag sizes, or just general kg
}

export interface Invoice {
  id: string;
  orderId: string;
  companyName: string;
  gstNumber: string;
  date: string;
  items: {
    productName: string;
    quantityKg: number;
    pricePerKg: number;
    totalAmount: number;
  }[];
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
  totalAmount: number;
  paymentMode: string;
  status: "Unpaid" | "Paid" | "Credit Drafted";
}

export interface Order {
  id: string;
  userId: string;
  buyerName: string;
  items: {
    productId: string;
    productName: string;
    quantityKg: number;
    pricePerKg: number;
    total: number;
  }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  deliveryAddress: string;
  trackingLogs: { stage: OrderStatus; timestamp: string; notes: string }[];
  invoiceId?: string;
  paymentStatus: "Pending" | "Completed" | "Credit Settled";
}

export interface InventoryStatus {
  rawOnionsKg: number;
  spicesKg: number;
  polyPouchesUnits: number;
  finishedMasalaKg: number;
  lastUpdated: string;
}

export interface AIRecommendation {
  productId: string;
  suggestedQtyKg: number;
  reason: string;
  confidenceScore: number;
}
