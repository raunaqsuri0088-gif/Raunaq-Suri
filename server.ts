import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { BusinessType, UserRole, OrderStatus, User, Order } from "./src/types";

// Initialize express
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database with initial seed data
let usersDb: User[] = [
  {
    id: "buyer-demo",
    companyName: "Tandoori Flames Restaurant QSR",
    gstNumber: "07AAAAA1111A1Z1",
    phoneNumber: "9876543210",
    businessType: BusinessType.RESTAURANT,
    deliveryAddress: "Shop 12, Main Ring Road, Block B, Connaught Place, New Delhi, 110001",
    contactName: "Chef Rohit Sharma",
    walletBalance: 42500,
    creditLimit: 150000,
    creditUsed: 25000,
    approved: true,
    role: UserRole.BUYER,
    points: 1250,
    clubLevel: "Gold"
  },
  {
    id: "buyer-new",
    companyName: "Sardar Catering & Event Planners",
    gstNumber: "03SSSSS2222S2Z5",
    phoneNumber: "9812345678",
    businessType: BusinessType.CATERER,
    deliveryAddress: "G.T. Road, Near Golden Temple, Amritsar, Punjab, 143001",
    contactName: "S. Gurpreet Singh",
    walletBalance: 5000,
    creditLimit: 100000,
    creditUsed: 0,
    approved: false, // Under admin review initially to showcase verification system
    role: UserRole.BUYER,
    points: 0,
    clubLevel: "Silver"
  },
  {
    id: "admin-demo",
    companyName: "SpiceFlow Plant Administration",
    gstNumber: "07SPICE3333F3Z8",
    phoneNumber: "9999999999",
    businessType: BusinessType.DISTRIBUTOR,
    deliveryAddress: "SpiceFlow FMCG Processing Hub, Industrial Area Phase II, Mohali, Punjab",
    contactName: "Plant Director Bajaj",
    walletBalance: 0,
    creditLimit: 0,
    creditUsed: 0,
    approved: true,
    role: UserRole.ADMIN,
    points: 0,
    clubLevel: "Platinum"
  }
];

let ordersDb: Order[] = [
  {
    id: "ord-88392",
    userId: "buyer-demo",
    buyerName: "Tandoori Flames Restaurant QSR",
    items: [
      {
        productId: "sf-onion-masala-classic",
        productName: "Classic Golden Onion Masala Base",
        quantityKg: 100,
        pricePerKg: 99,
        total: 9900
      },
      {
        productId: "sf-onion-garlic-spicy",
        productName: "Spicy Garlic & Ginger Red Onion Paste Blend",
        quantityKg: 60,
        pricePerKg: 130,
        total: 7800
      }
    ],
    subtotal: 17700,
    cgst: 1593, // 9%
    sgst: 1593, // 9%
    totalAmount: 20886,
    status: OrderStatus.SHIPPED,
    orderDate: "2026-05-18T14:30:00Z",
    deliveryAddress: "Shop 12, Main Ring Road, Block B, Connaught Place, New Delhi, 110001",
    trackingLogs: [
      { stage: OrderStatus.RECEIVED, timestamp: "2026-05-18T14:30:00Z", notes: "Wholesale bulk order parsed with GST registration validation." },
      { stage: OrderStatus.PROCESSING, timestamp: "2026-05-19T09:15:00Z", notes: "Onion Masala raw batch roasted with low-temperature vacuum kettles." },
      { stage: OrderStatus.PACKED, timestamp: "2026-05-20T11:45:00Z", notes: "Packed inside nitrogen-flushed 10kg poly bags, vacuum check OK." },
      { stage: OrderStatus.SHIPPED, timestamp: "2026-05-21T08:00:00Z", notes: "Dispatched via Safexpress cold logistic line. ETA: 24 hours." }
    ],
    invoiceId: "INV-2026-0045",
    paymentStatus: "Completed"
  },
  {
    id: "ord-88124",
    userId: "buyer-demo",
    buyerName: "Tandoori Flames Restaurant QSR",
    items: [
      {
        productId: "sf-onion-masala-tandoori",
        productName: "Premium Smokey Tandoori Onion Masala",
        quantityKg: 50,
        pricePerKg: 125,
        total: 6250
      }
    ],
    subtotal: 6250,
    cgst: 562.5,
    sgst: 562.5,
    totalAmount: 7375,
    status: OrderStatus.DELIVERED,
    orderDate: "2026-04-10T11:00:00Z",
    deliveryAddress: "Shop 12, Main Ring Road, Block B, Connaught Place, New Delhi, 110001",
    trackingLogs: [
      { stage: OrderStatus.RECEIVED, timestamp: "2026-04-10T11:00:00Z", notes: "Bulk tandoori order launched." },
      { stage: OrderStatus.PROCESSING, timestamp: "2026-04-10T14:00:00Z", notes: "Smoked seasoning base combined." },
      { stage: OrderStatus.DELIVERED, timestamp: "2026-04-12T16:30:00Z", notes: "Received at Connaught Place store under verified temperature." }
    ],
    invoiceId: "INV-2026-0021",
    paymentStatus: "Completed"
  }
];

let rawMaterials = {
  rawOnionsKg: 14500,
  spicesKg: 4200,
  polyPouchesUnits: 18400,
  finishedMasalaKg: 8200,
  lastUpdated: new Date().toISOString()
};

let notificationLogs: string[] = [
  "[SMS System] Dispatched Order INV-2026-0045 tracking link to Tandoori Flames restaurant.",
  "[WhatsApp Gateway] Delivered packing certificate to Gurpreet Singh at Sardar Catering (Review queue status).",
  "[Email Dispatch] Tax invoice INV-2026-0021 delivered to accounts@tandooriflames.com"
];

// Helper to Lazy Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
        console.log("Gemini API Client initialized successfully for SpiceFlow Server.");
      } catch (err) {
        console.error("Error creating Gemini client", err);
      }
    } else {
      console.warn("No active GEMINI_API_KEY found or using standard default. AI response fallbacks will activate.");
    }
  }
  return aiClient;
}

// REST Endpoints

// 1. Auth Endpoints
app.post("/api/auth/register", (req, res) => {
  const { companyName, gstNumber, phoneNumber, businessType, deliveryAddress, contactName } = req.body;
  if (!companyName || !gstNumber || !phoneNumber || !contactName) {
    return res.status(400).json({ error: "Missing required B2B parameters" });
  }

  // Check if phone or GST already registered
  const exists = usersDb.find(u => u.phoneNumber === phoneNumber || u.gstNumber === gstNumber);
  if (exists) {
    return res.status(400).json({ error: "Business with this phone number or GST is already registered." });
  }

  const newUser: User = {
    id: `buyer-${Date.now()}`,
    companyName,
    gstNumber,
    phoneNumber,
    businessType: businessType || BusinessType.RESTAURANT,
    deliveryAddress: deliveryAddress || "",
    contactName,
    walletBalance: 0,
    creditLimit: businessType === BusinessType.DISTRIBUTOR ? 200000 : 80000,
    creditUsed: 0,
    approved: false, // Requires admin approval!
    role: UserRole.BUYER,
    points: 100, // Welcome points
    clubLevel: "Silver"
  };

  usersDb.push(newUser);
  notificationLogs.push(`[System Alert] New buyer registration submitted for ${companyName} (${gstNumber}). Verification pending!`);
  res.status(201).json({ user: newUser, otpSent: true });
});

app.post("/api/auth/login", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const user = usersDb.find(u => u.phoneNumber === phoneNumber);
  if (!user) {
    return res.status(404).json({ error: "No B2B account found with this phone number. Please register your company first." });
  }

  res.json({ user, otpSent: true });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: "Phone number and OTP digits are required" });
  }

  const user = usersDb.find(u => u.phoneNumber === phoneNumber);
  if (!user) {
    return res.status(404).json({ error: "User is missing during verification" });
  }

  // Simulated OTP verification
  if (otp !== "123456" && otp !== "1234" && otp !== "8888") {
    return res.status(400).json({ error: "Incorrect OTP code. Please enter the demo code '1234'." });
  }

  res.json({ verified: true, user });
});

app.post("/api/auth/approve", (req, res) => {
  const { userId, approve } = req.body;
  const user = usersDb.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.approved = approve;
  notificationLogs.push(`[Admin Audit] Wholesaler '${user.companyName}' has been ${approve ? "APPROVED" : "BLOCKED"} for bulk credit ordering.`);
  res.json({ success: true, user });
});

app.get("/api/users", (req, res) => {
  res.json(usersDb);
});

// 2. Orders Endpoints
app.get("/api/orders", (req, res) => {
  const userId = req.query.userId as string;
  if (userId) {
    const userOrders = ordersDb.filter(o => o.userId === userId);
    return res.json(userOrders);
  }
  res.json(ordersDb);
});

app.post("/api/orders", (req, res) => {
  const { userId, items, paymentMode } = req.body;
  const user = usersDb.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Authenticated business user not found" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Wholesale cart cannot be empty" });
  }

  // Calculate order metrics with 18% GST (9% CGST + 9% SGST is standard for roasted masala bases in India)
  let subtotal = 0;
  const parsedItems = items.map((item: any) => {
    const total = item.quantityKg * item.pricePerKg;
    subtotal += total;
    return {
      productId: item.productId,
      productName: item.productName,
      quantityKg: item.quantityKg,
      pricePerKg: item.pricePerKg,
      total
    };
  });

  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const totalAmount = subtotal + cgst + sgst;

  // Credit Line Limits check if applicable
  if (paymentMode === "credit") {
    const availableCredit = user.creditLimit - user.creditUsed;
    if (totalAmount > availableCredit) {
      return res.status(400).json({ error: `Insufficient credit line! Available: ₹${availableCredit.toFixed(2)}. Grand Total: ₹${totalAmount.toFixed(2)}.` });
    }
    user.creditUsed += totalAmount;
  } else if (paymentMode === "wallet") {
    if (totalAmount > user.walletBalance) {
      return res.status(400).json({ error: `Insufficient wallet balance! Wallet: ₹${user.walletBalance.toFixed(2)}. Total: ₹${totalAmount.toFixed(2)}.` });
    }
    user.walletBalance -= totalAmount;
  }

  // Generate unique invoice & order identifiers
  const orderId = `ord-${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderId,
    userId: user.id,
    buyerName: user.companyName,
    items: parsedItems,
    subtotal,
    cgst,
    sgst,
    totalAmount,
    status: OrderStatus.RECEIVED,
    orderDate: new Date().toISOString(),
    deliveryAddress: user.deliveryAddress,
    trackingLogs: [
      { stage: OrderStatus.RECEIVED, timestamp: new Date().toISOString(), notes: "Wholesale Order successfully submitted and automated GST invoice compiled." }
    ],
    invoiceId,
    paymentStatus: paymentMode === "credit" ? "Credit Settled" : "Completed"
  };

  // Dedicate raw stocks
  const totalKgs = items.reduce((acc: number, cur: any) => acc + cur.quantityKg, 0);
  rawMaterials.finishedMasalaKg = Math.max(0, rawMaterials.finishedMasalaKg - totalKgs);
  rawMaterials.rawOnionsKg = Math.max(0, rawMaterials.rawOnionsKg - totalKgs * 2.1); // 1kg finished needs ~2kg raw onions
  rawMaterials.spicesKg = Math.max(0, rawMaterials.spicesKg - totalKgs * 0.25);
  rawMaterials.lastUpdated = new Date().toISOString();

  // Add loyalty points
  const pointsEarned = Math.floor(subtotal / 100);
  user.points += pointsEarned;
  if (user.points > 2500) user.clubLevel = "Platinum";
  else if (user.points > 1000) user.clubLevel = "Gold";

  ordersDb.unshift(newOrder);

  // Dispatch Simulated Alerts
  notificationLogs.unshift(`[SMS Notify] Wholesaler '${user.companyName}' placed order ${orderId} (₹${totalAmount.toLocaleString('en-IN')}) successfully! Invoice auto-generated.`);
  notificationLogs.unshift(`[WhatsApp Push] SpiceFlow Dispatch Desk initiated production scheduling for batch ${orderId}!`);

  res.status(201).json({ order: newOrder, pointsEarned });
});

// Update order stage
app.post("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const order = ordersDb.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = status as OrderStatus;
  order.trackingLogs.push({
    stage: status as OrderStatus,
    timestamp: new Date().toISOString(),
    notes: notes || `Production stage shifted to: ${status}`
  });

  notificationLogs.unshift(`[Dispatch Tracker] Order '${id}' stage updated: ${status}. Real-time GPS driver dispatched.`);
  res.json({ success: true, order });
});

// 3. Raw Materials & Analytics
app.get("/api/inventory", (req, res) => {
  res.json(rawMaterials);
});

app.post("/api/inventory/restock", (req, res) => {
  const { rawOnions, spices, polyPouches } = req.body;
  if (rawOnions) rawMaterials.rawOnionsKg += Number(rawOnions);
  if (spices) rawMaterials.spicesKg += Number(spices);
  if (polyPouches) rawMaterials.polyPouchesUnits += Number(polyPouches);
  rawMaterials.lastUpdated = new Date().toISOString();

  notificationLogs.unshift(`[Plant Audit] Factory restocked materials. Raw Onions: +${rawOnions || 0}kg, Blended spices: +${spices || 0}kg.`);
  res.json(rawMaterials);
});

app.get("/api/logs", (req, res) => {
  res.json(notificationLogs);
});

// 4. AI Routes powered by Gemini Model (gemini-3.5-flash)
app.post("/api/ai/recommendations", async (req, res) => {
  const { companyName, businessType, previousOrdersCount, restaurantSize } = req.body;
  const client = getGeminiClient();

  const mockRecommendation = {
    suggestions: [
      {
        productId: "sf-onion-masala-classic",
        suggestedQtyKg: restaurantSize === "large" ? 150 : 70,
        reason: "Based on Indian wedding season trends and high delivery frequencies in Delhi NCR corridors.",
        confidenceScore: 94
      },
      {
        productId: "sf-onion-garlic-spicy",
        suggestedQtyKg: restaurantSize === "large" ? 100 : 45,
        reason: "Rising interest in fiery garlic condiments. Buying classical double quantities unlocks maximum Tier-3 pricing discount.",
        confidenceScore: 89
      }
    ],
    growthTip: "Your weekly restaurant consumption is projected to peak in 5 days due to festival weekends. Reorder in the next 12 hours to lock in Express logistic slots.",
    cropMarketUpdate: "Indore crop stocks are steady but transport tariffs are predicted to surge by 8% next month due to diesel prices. Securing 45 days of onion flakes now shields margins."
  };

  if (!client) {
    // Graceful fallback response when no real API key is attached
    return res.json(mockRecommendation);
  }

  try {
    const prompt = `Analyze this B2B Wholesale client profile and generate smart stocking advice:
    - Business Name: ${companyName}
    - Segment: ${businessType}
    - Business Size: ${restaurantSize || "medium"}
    - Previous Orders: ${previousOrdersCount || 0}
    - Current season: High-demand Indian Wedding / Summer Festival seasons
    
    You must output a JSON response matching this EXACT structure:
    {
      "suggestions": [
        {
          "productId": "sf-onion-masala-classic",
          "suggestedQtyKg": 120,
          "reason": "text...",
          "confidenceScore": 95
        }
      ],
      "growthTip": "short customized advice string...",
      "cropMarketUpdate": "brief text about indore/nasik onion crop pricing and supply warnings..."
    }`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are the head AI Supply Chain Officer for SpiceFlow Onion Masala. Give high-precision commercial advices in raw JSON."
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (err) {
    console.error("Gemini Recommendations error, returning high-fidelity simulated response:", err);
    res.json(mockRecommendation);
  }
});

app.post("/api/ai/chatbot", async (req, res) => {
  const { messages, userProfile } = req.body;
  const client = getGeminiClient();

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Chat messages are missing." });
  }

  const latestUserMessage = messages[messages.length - 1].text;

  const demoResponse = `Namaste! As your SpiceFlow commercial advisor, I'd suggest our **Classic Golden Onion Masala Base** (SKU: SF-ONM-CLS-100) for your high-volume gravy requirements. 
  
For a restaurant of your size, ordering **100kg** launches the maximum discount tier of precisely **₹99/kg** (regular rate: ₹120/kg). That saves you exactly ₹2,100 on base costs and completely eliminates onion wastage!
  
Would you like me to assist you in calculating your average masala volume for your weekend banquet catering?`;

  if (!client) {
    return res.json({ response: demoResponse });
  }

  try {
    const chatContext = `You are "SpiceFlow AI Advisor," a premium commercial masala supply consultant helping B2B hotels, caterers, and restaurants manage onion masala inventory, lock pricing tiers, and optimize food consistency.
    
    User context:
    - Business Name: ${userProfile?.companyName || "SpiceFlow Partner"}
    - Type: ${userProfile?.businessType || "FMCG Partner"}
    - Active credit line: ₹${userProfile?.creditLimit || 100000}
    - Preferred products: Onion Masala Classic (10kg standard tier), Tandoori Smokey specialty, Spicy Ginger-Garlic paste base.
    
    Guidelines:
    1. Be polite, extremely professional, and warm. Use premium food-manufacturing vocabulary (e.g., 'milling', 'B2B consistency', 'FSSAI standards', 'cold-pressed processing', 'Indore/Nashik onion crop yields').
    2. Guide users to satisfy MOQs and unlock tier-discounts (10kg: ₹120/kg, 50kg: ₹110/kg, 100kg+: ₹99/kg).
    3. Keep answers concise, highly readable, structured in brief bullet points, and optimized for quick mobile screens. Do not share raw code or JSON structures.`;

    const chatInput = messages.map((m: any) => `${m.sender === "user" ? "Buyer" : "SpiceFlow Advisor"}: ${m.text}`).join("\n") + "\nBuyer: " + latestUserMessage;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatInput,
      config: {
        systemInstruction: chatContext,
        temperature: 0.7
      }
    });

    res.json({ response: response.text });
  } catch (err) {
    console.error("Gemini Chatbot error, returning fallback response:", err);
    res.json({ response: demoResponse });
  }
});


// Server setup
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SpiceFlow Wholesale App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
