import React, { useState, useEffect } from "react";
import { MessageSquare, ShoppingCart, Trash2, X, CreditCard, Sparkles, AlertCircle, CheckCircle, Smartphone } from "lucide-react";
import { Language, User, CartItem, Product, Order, OrderStatus, BusinessType } from "./types";
import { PRODUCTS, TRANSLATIONS, RECIPES_BLOGS, PARTNERS } from "./data/staticData";

import Header from "./components/Header";
import HomeHero from "./components/HomeHero";
import WhyChooseUs from "./components/WhyChooseUs";
import ProductCatalog from "./components/ProductCatalog";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import AIChatBot from "./components/AIChatBot";
import Footer from "./components/Footer";

export default function App() {
  const [currentLanguage, setLanguage] = useState<Language>(Language.EN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("home");

  // UI state managers
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"wallet" | "credit" | "stripe">("credit");
  const [activeOrderSuccess, setActiveOrderSuccess] = useState<Order | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const t = TRANSLATIONS[currentLanguage];

  // Refresh historical orders from the Express backend
  const fetchUserOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/orders?userId=${currentUser.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error("Failed to sync orders with server database", e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  // Synchronize initial login if demo account requested
  useEffect(() => {
    const fetchInitialUser = async () => {
      try {
        const res = await fetch("/api/users");
        const users = await res.json();
        // pre-seed demo login on mounting so buyer can explore instantly
        const demoUser = users.find((u: User) => u.id === "buyer-demo");
        if (demoUser) {
          setCurrentUser(demoUser);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInitialUser();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveTab("home");
  };

  const handleAddToCart = (product: Product, quantityKg: number) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantityKg: quantityKg } : item
        );
      }
      return [...prev, { product, quantityKg }];
    });
    // Shake screen feedback
    setCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleReorder = (orderItems: any[]) => {
    // Copy historical items directly into the cart quantities
    setCart([]);
    orderItems.forEach((itm) => {
      const prd = PRODUCTS.find((p) => p.id === itm.productId);
      if (prd) {
        handleAddToCart(prd, itm.quantityKg);
      }
    });
    setActiveTab("catalog");
    setCartOpen(true);
  };

  const handleAddWalletFunds = async (amt: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      walletBalance: currentUser.walletBalance + amt
    });

    // Send a message dispatch simulator
    alert(`₹${amt.toLocaleString()} added to your commercial wallet successfully!`);
  };

  // Submit complete cart order to Express Server
  const handleWholesaleCheckout = async () => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }

    if (cart.length === 0) return;
    setCheckoutLoading(true);

    try {
      const payload = {
        userId: currentUser.id,
        items: cart.map((c) => {
          // Determine price tier based on quantity
          const qty = c.quantityKg;
          const tier = c.product.priceTiers.find(
            (t) => qty >= t.minQty && (t.maxQty === -1 || qty <= t.maxQty)
          );
          const price = tier ? tier.pricePerKg : c.product.priceTiers[0].pricePerKg;

          return {
            productId: c.product.id,
            productName: c.product.name[currentLanguage],
            quantityKg: qty,
            pricePerKg: price,
          };
        }),
        paymentMode,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Order fail. Insufficient B2B corporate limitations.");
      } else {
        setActiveOrderSuccess(data.order);
        setCart([]);
        setCartOpen(false);
        fetchUserOrders();
        // Deduct wallet locally if matched
        if (paymentMode === "wallet") {
          setCurrentUser({
            ...currentUser,
            walletBalance: Math.max(0, currentUser.walletBalance - data.order.totalAmount),
            points: currentUser.points + data.pointsEarned
          });
        } else if (paymentMode === "credit") {
          setCurrentUser({
            ...currentUser,
            creditUsed: currentUser.creditUsed + data.order.totalAmount,
            points: currentUser.points + data.pointsEarned
          });
        }
      }
    } catch (err) {
      alert("Network timeout compiling GST Invoice.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Calculate cart cost stats
  const cartSubtotal = cart.reduce((sum, item) => {
    const qty = item.quantityKg;
    const tier = item.product.priceTiers.find(
      (t) => qty >= t.minQty && (t.maxQty === -1 || qty <= t.maxQty)
    );
    const price = tier ? tier.pricePerKg : item.product.priceTiers[0].pricePerKg;
    return sum + qty * price;
  }, 0);

  const cartCGST = cartSubtotal * 0.09; // 9% Central GST
  const cartSGST = cartSubtotal * 0.09; // 9% State GST
  const cartGrandTotal = cartSubtotal + cartCGST + cartSGST;

  return (
    <div className="min-h-screen bg-[#060302] text-gray-100 flex flex-col font-sans relative antialiased selection:bg-amber-600 selection:text-white">
      
      {/* Primary Header Component */}
      <Header
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOpen(true)}
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main tab routing panel */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <div>
            <HomeHero
              currentLanguage={currentLanguage}
              onOrderClick={() => setActiveTab("catalog")}
              onExploreBlogs={() => setActiveTab("blogs")}
            />
            <WhyChooseUs currentLanguage={currentLanguage} />
            <ProductCatalog
              currentLanguage={currentLanguage}
              onAddToCart={handleAddToCart}
              cart={cart}
            />
          </div>
        )}

        {/* Catalog Dedicated Tab */}
        {activeTab === "catalog" && (
          <ProductCatalog
            currentLanguage={currentLanguage}
            onAddToCart={handleAddToCart}
            cart={cart}
          />
        )}

        {/* Recipes & Culinary Blogs Tab */}
        {activeTab === "blogs" && (
          <div className="bg-[#0e0603] text-gray-100 py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold block">SpiceFlow Insights</span>
                <h2 className="text-3xl font-black text-white mt-1">{t.recipeHeading}</h2>
                <div className="w-16 h-1 bg-amber-600 rounded-full mx-auto mt-4"></div>
              </div>

              {/* Masterchef testies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                {RECIPES_BLOGS.map((blog) => (
                  <div key={blog.id} className="bg-[#150a06] border border-orange-950 rounded-2xl overflow-hidden shadow-xl hover:border-amber-900/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="h-48 w-full overflow-hidden relative">
                        <img 
                          src={blog.image} 
                          alt="Gourmet commercial kitchen roasting onion masala pastes" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 right-3 bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-1 rounded">
                          {blog.readTime}
                        </span>
                      </div>
                      <div className="p-6 space-y-3">
                        <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Consultant Chef: {blog.chef}</span>
                        <h3 className="text-lg font-bold text-white tracking-tight">{blog.title[currentLanguage]}</h3>
                        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{blog.excerpt[currentLanguage]}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-[#0f0603] border-t border-orange-950/40">
                      <p className="text-[11px] text-gray-400 italic">“{blog.content}”</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && currentUser && (
          <Dashboard
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            orders={orders}
            onReorder={handleReorder}
            onRefreshOrders={fetchUserOrders}
            onAddWalletFunds={handleAddWalletFunds}
          />
        )}

        {activeTab === "admin" && (
          <AdminPanel
            currentLanguage={currentLanguage}
            onRefreshAll={fetchUserOrders}
          />
        )}
      </main>

      {/* Slide-out itemized corporate Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-[#120a06] border-l border-orange-950 z-50 flex flex-col justify-between shadow-2xl">
          {/* Header row */}
          <div className="p-4 bg-[#1e1009] border-b border-orange-950/40 flex justify-between items-center text-white">
            <h3 className="text-sm font-bold font-mono tracking-widest uppercase text-amber-400 flex items-center space-x-1.5">
              <ShoppingCart className="w-4 h-4 text-amber-500" />
              <span>Wholesale Shopping Cart</span>
            </h3>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart entries */}
          <div className="p-4 flex-grow overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center text-xs text-stone-500 font-mono space-y-2">
                <p>Wholesale cart holds no commodities.</p>
                <button
                  onClick={() => { setCartOpen(false); setActiveTab("catalog"); }}
                  className="text-amber-500 font-bold underline"
                >
                  Browse Onion Masalas ↗
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const qty = item.quantityKg;
                  const tier = item.product.priceTiers.find(
                    (t) => qty >= t.minQty && (t.maxQty === -1 || qty <= t.maxQty)
                  );
                  const price = tier ? tier.pricePerKg : item.product.priceTiers[0].pricePerKg;
                  const itemValue = qty * price;

                  return (
                    <div
                      key={item.product.id}
                      className="bg-[#1b0f0a] border border-orange-950 rounded-xl p-3 flex justify-between items-center text-xs"
                    >
                      <div className="space-y-1 text-left">
                        <strong className="block text-white text-xs">{item.product.name[currentLanguage]}</strong>
                        <div className="text-[10px] text-stone-400">
                          Qty: <span className="font-mono text-amber-400">{qty} kg</span> • Price: ₹{price}/kg
                        </div>
                        <div className="text-[10px] text-[#db4a1a] font-bold font-mono">
                          Milled subtotal: ₹{itemValue.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-2 text-stone-500 hover:text-red-400 rounded-lg"
                        title="Remove segment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout block with GST (18%) taxation */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#120704] border-t border-orange-950/60 space-y-4">
              
              {/* Payment selector line */}
              <div className="space-y-1.5 text-left">
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">Select corporate billing term</span>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono font-semibold">
                  <button
                    onClick={() => setPaymentMode("credit")}
                    className={`py-2 rounded-lg border transition-all ${
                      paymentMode === "credit" ? "bg-amber-600 border-amber-500 text-white" : "bg-[#0a0402] text-gray-500 border-orange-950"
                    }`}
                  >
                    Credit limit line
                  </button>
                  <button
                    onClick={() => setPaymentMode("wallet")}
                    className={`py-2 rounded-lg border transition-all ${
                      paymentMode === "wallet" ? "bg-amber-600 border-amber-500 text-white" : "bg-[#0a0402] text-gray-500 border-orange-950"
                    }`}
                  >
                    Advance wallet
                  </button>
                  <button
                    onClick={() => setPaymentMode("stripe")}
                    className={`py-2 rounded-lg border transition-all ${
                      paymentMode === "stripe" ? "bg-amber-600 border-amber-500 text-white" : "bg-[#0a0402] text-gray-500 border-orange-950"
                    }`}
                  >
                    UPI / Razorpay
                  </button>
                </div>
              </div>

              {/* Invoice math breakdown */}
              <div className="bg-[#0c0603] p-3 rounded-xl border border-orange-950/65 font-mono text-[11px] space-y-1 text-stone-400">
                <div className="flex justify-between">
                  <span>Milled goods subtotal:</span>
                  <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Central CGST (9%):</span>
                  <span>₹{cartCGST.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>State SGST (9%):</span>
                  <span>₹{cartSGST.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-orange-950/40 pt-1.5 text-xs">
                  <span>Total tax audit bill:</span>
                  <span className="text-amber-500">₹{cartGrandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout actions */}
              <button
                onClick={handleWholesaleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-650 hover:to-amber-550 text-white font-bold text-xs py-3.5 rounded-xl border-b border-red-900 shadow-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>{t.checkoutBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Order Overlay pop-card */}
      {activeOrderSuccess && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#150a06] border border-orange-950 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => { setActiveOrderSuccess(null); setActiveTab("dashboard"); }}
              className="absolute top-4 right-4 p-1 text-stone-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 bg-emerald-950/30 border border-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-white">Wholesale Dispatch Initiated!</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Order No <strong className="text-amber-400 font-mono">{activeOrderSuccess.id}</strong> has been received by SpiceFlow processing plant.
            </p>

            <div className="bg-[#1e1009] border border-orange-950 rounded-lg p-3 text-left font-mono text-[10px] text-gray-400 space-y-1">
              <div>Invoice compiled: <strong>{activeOrderSuccess.invoiceId}</strong></div>
              <div>Subtotal bill: ₹{activeOrderSuccess.subtotal.toLocaleString("en-IN")}</div>
              <div>CGST / SGST (18%): ₹{(activeOrderSuccess.cgst + activeOrderSuccess.sgst).toLocaleString("en-IN")}</div>
              <div className="font-bold text-white pt-1">Total deducted balance: ₹{activeOrderSuccess.totalAmount.toLocaleString("en-IN")}</div>
            </div>

            <button
              onClick={() => { setActiveOrderSuccess(null); setActiveTab("dashboard"); }}
              className="w-full bg-[#34180c] text-amber-500 py-3 rounded-lg text-xs font-mono font-bold hover:bg-[#431f10] cursor-pointer"
            >
              Close and Track Live Dispatched GPS ↗
            </button>
          </div>
        </div>
      )}

      {/* Floating Sticky WhatsApp Indicator */}
      <a
        href="https://wa.me/919876543210?text=Hi%20SpiceFlow%20Wholesale%20Sales%20Team!%20Representing%20my%20commercial%20kitchen,%20we%20would%20like%20to%20quote%20a%20bulk%20price%20tier%20for%20Onion%20Masala%20Bases."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-4 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center cursor-pointer"
        title="WhatsApp Instant Support"
      >
        <MessageSquare className="w-5 h-5 text-white" />
      </a>

      {/* Auth modal overlay portal */}
      {authOpen && (
        <AuthModal
          currentLanguage={currentLanguage}
          onClose={() => setAuthOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setActiveTab("dashboard");
          }}
        />
      )}

      {/* Floating Gemini Advisory chat assistant */}
      <AIChatBot currentLanguage={currentLanguage} currentUser={currentUser} />

      {/* Footer component standard */}
      <Footer currentLanguage={currentLanguage} />
    </div>
  );
}
