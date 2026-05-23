import React, { useState, useEffect } from "react";
import { Package, Smartphone, TrendingUp, Sparkles, AlertCircle, FileText, CheckCircle, Clock, MapPin, Truck, Award, CreditCard, Star, RefreshCw, Printer, AlertTriangle, X } from "lucide-react";
import { Language, User, Order, Product, OrderStatus, BusinessType } from "../types";
import { TRANSLATIONS } from "../data/staticData";

interface DashboardProps {
  currentLanguage: Language;
  currentUser: User;
  orders: Order[];
  onReorder: (items: any[]) => void;
  onRefreshOrders: () => void;
  onAddWalletFunds: (amt: number) => void;
}

export default function Dashboard({
  currentLanguage,
  currentUser,
  orders,
  onReorder,
  onRefreshOrders,
  onAddWalletFunds,
}: DashboardProps) {
  const t = TRANSLATIONS[currentLanguage];

  // AI Stock Recommendations states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [restaurantSize, setRestaurantSize] = useState<string>("medium");

  // Payment checkout states
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>("credit");
  const [isPaying, setIsPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  // Active invoice print popup
  const [printingInvoice, setPrintingInvoice] = useState<Order | null>(null);

  const fetchAIRecommendations = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: currentUser.companyName,
          businessType: currentUser.businessType,
          previousOrdersCount: orders.length,
          restaurantSize: restaurantSize,
        }),
      });
      const data = await res.json();
      setAiData(data);
    } catch (e) {
      console.error("Failed to query AI advisor", e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAIRecommendations();
    }
  }, [currentUser, restaurantSize]);

  const handlePayOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingOrder) return;
    setIsPaying(true);

    try {
      // Simulate Payment validation & billing allocation
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          items: payingOrder.items,
          paymentMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Simulation error verifying credits.");
      } else {
        setPaidSuccess(true);
        onRefreshOrders();
        setTimeout(() => {
          setPaidSuccess(false);
          setPayingOrder(null);
        }, 3000);
      }
    } catch (e) {
      alert("Payment validation timeout.");
    } finally {
      setIsPaying(false);
    }
  };

  const printBill = (ord: Order) => {
    setPrintingInvoice(ord);
  };

  // Tracking colors definition
  const getTrackingStepColor = (currentStatus: OrderStatus, step: OrderStatus) => {
    const sequence = [
      OrderStatus.RECEIVED,
      OrderStatus.PROCESSING,
      OrderStatus.PACKED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(step);

    if (stepIndex < currentIndex) return "bg-green-600 text-white"; // Passed
    if (stepIndex === currentIndex) return "bg-[#F27D26] text-black animate-pulse border-2 border-[#F27D26]"; // Current
    return "bg-[#141414] text-stone-600 border border-white/10"; // Upcoming
  };

  return (
    <div className="bg-[#0A0A0A] text-gray-100 py-10 min-h-screen border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Verification Alert Banner */}
        {!currentUser.approved && (
          <div className="bg-[#141414] border border-[#F27D26]/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F27D26]/5 rounded-full blur-2xl"></div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/5 rounded-xl text-[#F27D26] border border-white/10 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-[#F27D26]" />
              </div>
              <div className="text-left space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#F27D26] font-bold block">FSSAI & GST Status</span>
                <h4 className="text-sm sm:text-base font-bold text-white pr-2">{t.approvedStatus}: Pending Review</h4>
                <p className="text-xs text-stone-400 leading-normal">{t.pendingApproveMsg}</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-[10px] font-mono text-gray-400 max-w-xs text-center">
              💡 Demo Mode Hint: Click the <strong className="text-[#F27D26]">Admin Desk</strong> tab in the header menu next log in to verify your company registration instantly!
            </div>
          </div>
        )}

        {currentUser.approved && (
          <div className="bg-emerald-950/10 border border-emerald-800/20 p-4 rounded-xl flex items-center space-x-3 text-xs text-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <strong>Corporate Verification Approved ✓</strong> {t.approvedMsg}
            </div>
          </div>
        )}

        {/* Dashboard Title Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 font-sans">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#F27D26] font-bold">
              Secure Wholesale Corridor
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-snug">
              {currentUser.companyName}
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              GSTIN ID: <strong className="text-stone-300 font-mono">{currentUser.gstNumber}</strong> • Segment: {currentUser.businessType}
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* VIP Label */}
            <div className="bg-[#141414] p-3 rounded-xl border border-white/10 text-center font-mono flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#F27D26]" />
              <div className="text-left leading-none font-sans">
                <span className="block text-[8px] uppercase tracking-wider text-stone-500 font-bold">B2B Loyalty</span>
                <span className="block text-xs font-black text-white mt-0.5">{currentUser.clubLevel} level ({currentUser.points} points)</span>
              </div>
            </div>

            <button
              onClick={onRefreshOrders}
              className="p-3 bg-[#141414] border border-white/10 hover:bg-[#1C1C1C] rounded-xl transition-all font-mono text-stone-300 cursor-pointer"
              title="Refresh Sales Desk"
            >
              <RefreshCw className="w-4 h-4 text-[#F27D26]" />
            </button>
          </div>
        </div>

        {/* Wallet, Credit Line, & Invoicing Summary Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Wallet Balance Card */}
          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#F27D26] font-bold">
                {t.walletBalance}
              </span>
              <Smartphone className="w-4 h-4 text-[#F27D26]" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black text-white font-mono">
                ₹{currentUser.walletBalance.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-stone-500 block">Preloaded commercial credit</span>
            </div>
            <div className="flex space-x-2 pt-1.5 font-sans">
              <button
                onClick={() => onAddWalletFunds(15000)}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all font-bold text-[10px] py-2 rounded-lg cursor-pointer"
              >
                + Add ₹15,000 Fund
              </button>
            </div>
          </div>

          {/* Credit Limit Card */}
          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                {t.creditLimit}
              </span>
              <CreditCard className="w-4 h-4 text-[#F27D26]" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black text-white font-mono">
                ₹{currentUser.creditLimit.toLocaleString("en-IN")}
              </span>
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-sans">
                <span>Used: ₹{currentUser.creditUsed.toLocaleString("en-IN")}</span>
                <span>Available: ₹{(currentUser.creditLimit - currentUser.creditUsed).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#F27D26] h-full"
                style={{ width: `${Math.min(100, (currentUser.creditUsed / currentUser.creditLimit) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Seasonal Offers & Marketing alert */}
          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg sm:col-span-2 font-sans">
            <span className="inline-block px-2.5 py-0.5 font-mono text-[9px] bg-white/5 border border-white/10 text-[#F27D26] rounded font-semibold uppercase tracking-wider">
              Wedding Season Promo
            </span>
            <h4 className="text-base font-bold text-white tracking-tight">
              Unlock Flat 18% Price Cuts on Bulk Classic Bases!
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              Distributor tier limits are relaxed. Orders over 150kg are dispatched via express cold logistic carriers. Use wallet checkouts to earn double loyalty points.
            </p>
          </div>
        </div>

        {/* Gemini powered AI Stock Assistant Widget */}
        <div className="bg-[#0E0E0E] border border-white/10 p-6 rounded-2xl space-y-5 shadow-2xl relative overflow-hidden font-sans">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F27D26]/5 rounded-full blur-2xl"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-start space-x-3 text-left">
              <div className="p-2.5 bg-white/5 border border-white/10 text-[#F27D26] rounded-xl">
                <Sparkles className="w-5 h-5 text-[#F27D26] animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-1.5">
                  <span>{t.aiSmartOrdering}</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Real-time stock consumption intelligence calibrated by your B2B culinary size.
                </p>
              </div>
            </div>

            {/* Restaurant Size Selector Toggle */}
            <div className="flex items-center space-x-2 mt-3 sm:mt-0 font-mono text-[10px]">
              <span className="text-stone-500 font-bold">Kitchen Volume Size:</span>
              <div className="bg-[#0A0A0A] rounded-md p-1 border border-white/10 font-semibold space-x-1">
                {["medium", "large"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setRestaurantSize(sz)}
                    className={`px-2 py-1 rounded capitalize cursor-pointer transition-colors ${
                      restaurantSize === sz ? "bg-[#F27D26] text-black font-black" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {aiLoading ? (
            <div className="py-6 text-center text-xs text-stone-500 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#F27D26]" />
              <p className="font-mono">Milling crop yields, predicting weather trends, & formulating reorder metrics...</p>
            </div>
          ) : aiData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
              
              {/* Suggestions List */}
              <div className="lg:col-span-8 space-y-3 font-sans">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#F27D26] font-bold mb-1">
                   Custom Stock Accumulation Proposals
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiData.suggestions?.map((sug: any, index: number) => (
                    <div key={index} className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-2 relative">
                      <span className="absolute top-3 right-3 text-[10px] font-mono text-emerald-400 font-bold">
                        {sug.confidenceScore}% Confidence
                      </span>
                      <h5 className="font-bold text-white text-xs sm:text-sm">
                        {sug.productId === "sf-onion-masala-classic" ? "Golden Classic base" : "Garlic & Ginger Blend"}
                      </h5>
                      <div className="text-xs text-stone-300">
                        Suggested purchase: <strong className="text-[#F27D26]">{sug.suggestedQtyKg} kg</strong>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-normal font-normal">
                        {sug.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips column */}
              <div className="lg:col-span-4 bg-[#141414] border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between font-sans">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#F27D26] font-bold flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-[#F27D26] animate-bounce" />
                    <span>Depletion Alert</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
                    “{aiData.growthTip}”
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3 text-[10px] text-gray-500 leading-normal">
                  <strong className="text-[#F27D26] font-mono">Market Update: </strong> {aiData.cropMarketUpdate}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-4 text-xs text-stone-500">
              No active intelligence feedback generated.
            </div>
          )}
        </div>

        {/* Orders Pipeline Tracker & List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active orders tracker */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
              <Package className="w-5 h-5 text-amber-500" />
              <span>Active Wholesale Orders ({orders.length})</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-[#0E0E0E] rounded-2xl border border-white/10 text-stone-500 text-xs text-center font-sans">
                No wholesale orders placed yet. Return to the Masala Catalog to submit your first purchase!
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg relative overflow-hidden font-sans"
                  >
                    {/* Invoice ID tag overlay */}
                    <div className="flex justify-between items-start border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[9.5px] font-mono text-stone-500">ORDER NO: <strong className="text-white">{ord.id}</strong></span>
                        <div className="text-xs text-stone-400 mt-0.5 font-mono">Placed on {new Date(ord.orderDate).toLocaleDateString("en-IN")}</div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-mono text-stone-500 uppercase">GST Valuation</span>
                        <span className="text-base font-black text-[#F27D26]">₹{ord.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Stage Tracker Pipeline Visualizer */}
                    <div className="py-2">
                      <div className="flex items-center justify-between relative mt-1 select-none">
                        {/* Horizontal connector line */}
                        <div className="absolute top-4 left-4 right-4 h-1 bg-white/10 z-0"></div>

                        {[
                          { stage: OrderStatus.RECEIVED, label: "Received" },
                          { stage: OrderStatus.PROCESSING, label: "Milling" },
                          { stage: OrderStatus.PACKED, label: "Packed" },
                          { stage: OrderStatus.SHIPPED, label: "Transit" },
                          { stage: OrderStatus.DELIVERED, label: "Delivered" },
                        ].map((node, i) => (
                          <div key={i} className="flex flex-col items-center relative z-10 space-y-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all ${getTrackingStepColor(ord.status, node.stage)}`}>
                              {i + 1}
                            </div>
                            <span className="text-[9px] font-mono text-stone-400 font-bold uppercase">{node.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Last Tracking logs entry */}
                      <div className="mt-4 bg-[#141414] p-3 rounded-xl border border-white/5 text-[11px] text-stone-300">
                        <div className="font-bold text-[#F27D26] mb-0.5 flex items-center justify-between">
                          <span>Latest Supply Update:</span>
                          <span className="font-mono text-[9px] text-stone-500">{new Date(ord.trackingLogs[ord.trackingLogs.length - 1]?.timestamp || ord.orderDate).toLocaleTimeString()}</span>
                        </div>
                        <p>{ord.trackingLogs[ord.trackingLogs.length - 1]?.notes || "Order received. Allocating logistics corridor."}</p>
                      </div>
                    </div>

                    {/* Order summary list & Repeat Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                      <div className="text-stone-400">
                        Items ordered: <span className="font-bold font-mono text-stone-300">{ord.items.length} skus</span> ({ord.items.map(i => `${i.quantityKg}kg`).join(", ")})
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => printBill(ord)}
                          className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/10 text-stone-300 rounded px-3 py-1.5 flex items-center space-x-1.5 cursor-pointer font-medium"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>

                        <button
                          onClick={() => onReorder(ord.items)}
                          className="bg-[#F27D26] hover:bg-[#e06b16] text-black font-black rounded px-4 py-1.5 flex items-center space-x-1 cursor-pointer font-black transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                          <span>{t.reorderBtn}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pending corporate bills & invoices */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#F27D26]" />
              <span>{t.pendingInvoices}</span>
            </h3>

            <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-5 space-y-4">
              <p className="text-xs text-stone-400">
                Commercial accounts settled on credit terms or advance preloads. Direct payments process instantly.
              </p>

              {orders.length === 0 ? (
                <div className="py-6 text-center text-stone-600 font-mono text-xs">
                  No invoices listed currently.
                </div>
              ) : (
                <div className="space-y-3.5 divide-y divide-white/5">
                  {orders.map((ord, idx) => (
                    <div key={ord.id} className={`pt-3.5 first:pt-0 flex items-center justify-between text-xs`}>
                      <div className="text-left space-y-0.5">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#F27D26] font-bold block">{ord.invoiceId || "Invoice"}</span>
                        <div className="font-bold text-white uppercase">{ord.buyerName}</div>
                        <div className="text-[10px] text-[#F27D26]/80 font-semibold font-mono">Credit Status: {ord.paymentStatus}</div>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono font-bold text-stone-400"> ₹{ord.totalAmount.toLocaleString("en-IN")}</span>
                        <button 
                          onClick={() => printBill(ord)}
                          className="text-[11px] text-[#F27D26] hover:text-[#e06b16] font-mono mt-1 font-bold underline cursor-pointer"
                        >
                          Details ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* GST Invoice Details Print Drawer Overlay */}
        {printingInvoice && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white text-stone-900 rounded-xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              {/* Close Action toolbar */}
              <button
                onClick={() => setPrintingInvoice(null)}
                className="absolute top-4 right-4 p-2 rounded-full cursor-pointer hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Invoice Core layout */}
              <div id="print-tax-invoice" className="space-y-6">
                
                {/* Visual watermark logo */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-stone-200 pb-5">
                  <div>
                    <h1 className="text-2xl font-black text-rose-800 tracking-tight flex items-center">
                      <span>SPICEFLOW FMCG LTD</span>
                    </h1>
                    <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wide mt-1">
                      Spice Processing Plant Phase 2, Mohali, Punjab • FSSAI Lic #10023485
                    </p>
                  </div>
                  <div className="text-left sm:text-right mt-3 sm:mt-0 font-mono text-[10px] text-stone-500 space-y-0.5">
                    <strong className="text-rose-900 block text-xs underline font-bold">TAX INVOICE (B2B)</strong>
                    <div>Invoice No: <strong>{printingInvoice.invoiceId}</strong></div>
                    <div>Source Date: {new Date(printingInvoice.orderDate).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Bill details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wide text-stone-500 font-bold">SUPPLIER (SpiceFlow)</span>
                    <strong className="block text-stone-800 text-sm">SPICEFLOW FOODS WHOLESALE</strong>
                    <div className="mt-1 text-stone-600">GSTIN: 07SPICE3333F3Z8</div>
                    <div className="text-stone-600">Mohali Plant Supply corridor</div>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wide text-stone-500 font-bold">CONSIGNEE / CORPORATE BUYER</span>
                    <strong className="block text-stone-800 text-sm uppercase">{printingInvoice.buyerName}</strong>
                    <div className="mt-1 text-stone-600">GSTIN: {currentUser.gstNumber}</div>
                    <div className="text-stone-600 truncate">{printingInvoice.deliveryAddress}</div>
                  </div>
                </div>

                {/* Subtotal table */}
                <table className="w-full text-left text-xs border border-stone-200 divide-y divide-stone-200">
                  <thead className="bg-[#fcf8f6]">
                    <tr className="font-mono text-stone-700 text-[10px] uppercase font-bold">
                      <th className="py-2.5 px-3">Masala Base SKU</th>
                      <th className="py-2.5 px-3 text-right">Standard Weight</th>
                      <th className="py-2.5 px-3 text-right">Wholesale Rate</th>
                      <th className="py-2.5 px-3 text-right">Base Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {printingInvoice.items.map((it, idx) => (
                      <tr key={idx} className="text-stone-800">
                        <td className="py-3 px-3">
                          <div className="font-bold">{it.productName}</div>
                          <span className="text-[10px] text-stone-400 font-mono uppercase">BATCH: SF-{printingInvoice.id}-{idx}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono">{it.quantityKg} kg</td>
                        <td className="py-3 px-3 text-right font-mono">₹{it.pricePerKg}/kg</td>
                        <td className="py-3 px-3 text-right font-mono font-bold">₹{it.total.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* GST breaking summary */}
                <div className="flex justify-end pt-2 text-xs font-mono">
                  <div className="w-72 space-y-1.5 border-t border-stone-100 pt-3">
                    <div className="flex justify-between text-stone-600">
                      <span>Commercial Subtotal:</span>
                      <span>₹{printingInvoice.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Central GST (CGST @ 9%):</span>
                      <span>₹{printingInvoice.cgst.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>State GST (SGST @ 9%):</span>
                      <span>₹{printingInvoice.sgst.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-2 text-sm">
                      <span>GRAND B2B BALANCE:</span>
                      <span className="text-rose-900">₹{printingInvoice.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Terms and prints stamp */}
                <div className="border-t border-stone-200 pt-4 flex justify-between items-center text-[10px] text-stone-400 font-mono">
                  <span>Authorised SpiceFlow Plant Supply Registrar</span>
                  <div className="bg-[#120a06] text-white p-2.5 rounded font-bold uppercase tracking-wider text-[11px] leading-none">
                    PAID IN STANDARD ACCOUNT TERM
                  </div>
                </div>

              </div>

              {/* Dynamic Print Trigger */}
              <div className="mt-8 flex justify-end space-x-3 text-xs">
                <button
                  onClick={() => {
                    alert("Generating system document print stream...");
                    window.print();
                  }}
                  className="bg-[#F27D26] hover:bg-[#e06b16] text-black font-black rounded p-3 px-5 cursor-pointer transition-all shadow-md hover:scale-105"
                >
                  Download Commercial PDF Invoice
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
