import React, { useState, useEffect } from "react";
import { UserCheck, Shield, ChevronRight, BarChart2, Package, RefreshCw, AlertCircle, TrendingUp, Check, Play, UserX, ShoppingBag, PieChart } from "lucide-react";
import { Language, User, Order, OrderStatus, InventoryStatus } from "../types";
import { PRODUCTS, TRANSLATIONS } from "../data/staticData";

interface AdminPanelProps {
  currentLanguage: Language;
  onRefreshAll: () => void;
}

export default function AdminPanel({ currentLanguage, onRefreshAll }: AdminPanelProps) {
  const t = TRANSLATIONS[currentLanguage];

  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryStatus | null>(null);
  const [commsLog, setCommsLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Material restock inputs
  const [restockOnion, setRestockOnion] = useState("500");
  const [restockSpice, setRestockSpice] = useState("200");

  const loadData = async () => {
    setLoading(true);
    try {
      const uRes = await fetch("/api/users");
      const users = await uRes.json();
      setActiveUsers(users);

      const oRes = await fetch("/api/orders");
      const orders = await oRes.json();
      setActiveOrders(orders);

      const iRes = await fetch("/api/inventory");
      const inv = await iRes.json();
      setInventory(inv);

      const lRes = await fetch("/api/logs");
      const logs = await lRes.json();
      setCommsLog(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (userId: string, approve: boolean) => {
    try {
      const res = await fetch("/api/auth/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, approve }),
      });
      if (res.ok) {
        loadData();
        onRefreshAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusShift = async (orderId: string, status: OrderStatus, notes: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        loadData();
        onRefreshAll();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inventory/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawOnions: restockOnion,
          spices: restockSpice,
          polyPouches: "2000"
        }),
      });
      if (res.ok) {
        setRestockOnion("500");
        setRestockSpice("200");
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generate sales analytics overview
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalsByTerritory = {
    "Delhi NCR": 52000,
    "Punjab Corridor": 87000,
    "Mumbai Port": 34000,
    "Haryana Belt": 21000
  };

  return (
    <div className="bg-[#0A0A0A] text-gray-100 py-10 min-h-screen border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header toolbar */}
         <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#F27D26] font-bold">
              Factory Oversight Command
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {t.adminTitle}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Control the supply chain dispatch, approve wholesale credit applications, and track material depots.
            </p>
          </div>

          <button
            onClick={loadData}
            className="mt-4 md:mt-0 flex items-center bg-[#141414] border border-white/10 hover:bg-[#1C1C1C] text-[#F27D26] font-black text-xs py-3.5 px-6 rounded-lg transition-all cursor-pointer space-x-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Factory Data</span>
          </button>
        </div>

        {/* Sales metrics overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 shadow-lg">
            <span className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Total Wholesale Receipts</span>
            <span className="text-3xl font-black text-[#F27D26] block font-mono mt-1">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-gray-400 mt-1 block">Accumulated over active sessions</span>
          </div>

          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 shadow-lg">
            <span className="text-[10px] font-mono text-stone-500 uppercase block font-bold">Total Dispatched Volume</span>
            <span className="text-3xl font-black text-white block font-mono mt-1">
              {(activeOrders.length * 125).toLocaleString()} Kg
            </span>
            <span className="text-[10px] text-stone-500 mt-1 block">Packets milled standard 10/20kg pouches</span>
          </div>

          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 shadow-lg">
            <span className="text-[10px] font-mono text-stone-400 uppercase block font-bold">Active partner companies</span>
            <span className="text-3xl font-black text-emerald-500 block font-mono mt-1">
              {activeUsers.length} Brands
            </span>
            <span className="text-[10px] text-gray-400 mt-1 block">Hotels, QSR, Caterers registered</span>
          </div>

          <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <span className="text-[10px] font-mono text-stone-400 uppercase block font-bold">FSSAI Central ID</span>
            <span className="text-base font-black text-white font-mono leading-none">
              #10023041049285
            </span>
            <span className="text-[9.5px] text-green-500 font-mono mt-1 block">✓ Compliant Clean Grade A ISO</span>
          </div>
        </div>

        {/* Grid: Buyer approvals & Order Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Approvals & Shipping shift queue */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Verification Queue card */}
            <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#F27D26]" />
                <span>Verification Queue (Pending Approvals)</span>
              </h3>

              {activeUsers.filter(u => !u.approved).length === 0 ? (
                <p className="text-xs text-stone-500 font-mono text-center py-6">
                  Verify queue clean. All active registered companies are approved for credit limits.
                </p>
              ) : (
                <div className="space-y-4 divide-y divide-white/5">
                  {activeUsers.filter(u => !u.approved).map((user) => (
                    <div key={user.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <strong className="text-sm text-white uppercase block">{user.companyName}</strong>
                        <div className="text-stone-400 font-sans">
                          GST No: <span className="font-mono text-[#F27D26] font-extrabold">{user.gstNumber}</span> • Phone: {user.phoneNumber}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate max-w-md mt-1">
                          Delivery: {user.deliveryAddress}
                        </div>
                      </div>

                      <div className="flex space-x-2 shrink-0">
                        <button
                          onClick={() => handleApprove(user.id, true)}
                          className="bg-[#F27D26] hover:bg-[#e06b16] font-black text-black px-4 py-2 rounded-lg transition-transform cursor-pointer hover:scale-105"
                        >
                          Verify & Approve B2B Account
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shift Order pipeline step status card */}
            <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#F27D26]" />
                <span>Commercial Dispatch Controller</span>
              </h3>

              {activeOrders.length === 0 ? (
                <p className="text-xs text-stone-500 font-mono text-center py-6">
                  No active wholesale orders placed yet on the server.
                </p>
              ) : (
                <div className="space-y-4 divide-y divide-white/5">
                  {activeOrders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <div className="font-bold text-white text-sm">Order #{ord.id} ({ord.buyerName})</div>
                        <p className="text-stone-400 mt-1">
                          Current status: <strong className="text-[#F27D26] font-mono text-xs">{ord.status}</strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-semibold">
                        {[
                          { st: OrderStatus.RECEIVED, label: "Recv" },
                          { st: OrderStatus.PROCESSING, label: "Roast" },
                          { st: OrderStatus.PACKED, label: "Pack" },
                          { st: OrderStatus.SHIPPED, label: "Ship" },
                          { st: OrderStatus.DELIVERED, label: "Arrived" },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            onClick={() => handleStatusShift(ord.id, btn.st, `FMCG plant team shifted step pipeline to: ${btn.st}`)}
                            className={`px-2 py-1.5 rounded transition-all cursor-pointer ${
                              ord.status === btn.st
                                ? "bg-[#F27D26] text-black font-black animate-pulse"
                                : "bg-[#141414] text-gray-400 hover:text-white"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right: Raw Materials Depots Tracking, and Comms Alert notifications feeds */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Raw materials monitoring dashboard */}
            <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-5 shadow-lg">
              <h3 className="text-lg font-black text-white flex items-center space-x-1.5">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>Warehouse Raw Depot (alert warnings)</span>
              </h3>

              {inventory ? (
                <div className="space-y-4 text-xs">
                  
                  {/* Onions */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono font-bold text-stone-300">
                      <span>Liquid Red Onions:</span>
                      <span className={inventory.rawOnionsKg < 5000 ? "text-red-500 font-extrabold" : "text-[#F27D26]"}>
                        {inventory.rawOnionsKg.toLocaleString()} kgs
                      </span>
                    </div>
                    <div className="w-full bg-[#141414] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${inventory.rawOnionsKg < 5000 ? "bg-red-600 animate-pulse" : "bg-[#F27D26]"}`}
                        style={{ width: `${Math.min(100, (inventory.rawOnionsKg / 20000) * 100)}%` }}
                      ></div>
                    </div>
                    {inventory.rawOnionsKg < 5000 && (
                      <p className="text-[10px] text-red-400 font-medium">⚠️ Low Raw stock! Trigger Indore farming logistics corridors.</p>
                    )}
                  </div>

                  {/* Spices */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono font-bold text-stone-300">
                      <span>Whole Red Chilies / Oil depot:</span>
                      <span className="text-[#F27D26]">{inventory.spicesKg.toLocaleString()} kgs</span>
                    </div>
                    <div className="w-full bg-[#141414] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#F27D26] h-full"
                        style={{ width: `${Math.min(100, (inventory.spicesKg / 6000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* RESTOCK ACTION FORM */}
                  <form onSubmit={handleRestock} className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-1">
                      <span className="block text-[9px] uppercase tracking-wide text-stone-500 font-mono">Restock Onions (Kg)</span>
                      <input
                        type="number"
                        value={restockOnion}
                        onChange={(e) => setRestockOnion(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#F27D26]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[9px] uppercase tracking-wide text-stone-500 font-mono">Restock Spices (Kg)</span>
                      <input
                        type="number"
                        value={restockSpice}
                        onChange={(e) => setRestockSpice(e.target.value)}
                        className="w-full bg-[#141414] border border-white/10 rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#F27D26]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="col-span-2 w-full bg-[#141414] border border-white/10 text-[#F27D26] hover:bg-[#F27D26] hover:text-black py-2.5 rounded text-xs font-black leading-none cursor-pointer transition-all"
                    >
                      Verify raw depot addition ✓
                    </button>
                  </form>

                </div>
              ) : (
                <p className="text-xs text-stone-600 font-mono text-center">Depot tracking stats loading...</p>
              )}
            </div>

            {/* Simple communication updates alert dispatcher */}
            <div className="bg-[#0E0E0E] border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-sm tracking-wide font-black uppercase text-stone-400 font-mono">
                Corporate Communication Updates Feed
              </h3>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {commsLog.map((log, idx) => (
                  <div key={idx} className="p-2 bg-[#141414] border-l-2 border-[#F27D26] text-[10.5px] leading-relaxed text-gray-300 font-mono rounded-r">
                    {log}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-center text-stone-500 font-mono">
                SMS, WhatsApp, Email notification logs transmitted. Log events persist during live session.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
