import React, { useState, useEffect } from "react";
import { TrendingUp, Truck, ShieldCheck, Flame, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { Language } from "../types";
import { TRANSLATIONS, PARTNERS } from "../data/staticData";

interface HomeHeroProps {
  currentLanguage: Language;
  onOrderClick: () => void;
  onExploreBlogs: () => void;
}

export default function HomeHero({ currentLanguage, onOrderClick, onExploreBlogs }: HomeHeroProps) {
  const t = TRANSLATIONS[currentLanguage];

  // Live Counter States - Simulates real-time plant activities
  const [activeKitch, setActiveKitch] = useState(2470);
  const [tonnesProcessed, setTonnesProcessed] = useState(18.4);
  const [fssaiScore, setFssaiScore] = useState(99.8);

  useEffect(() => {
    const interval = setInterval(() => {
      // Small simulated ticks for plant supply telemetry
      setActiveKitch((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
      setTonnesProcessed((prev) => parseFloat((prev + (Math.random() > 0.8 ? 0.1 : 0)).toFixed(1)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-gray-100 py-16 lg:py-24 border-b border-white/10">
      {/* Animated Subtle Spice-themed glowing circles */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-[#F27D26]/5 rounded-full blur-3xl animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 bg-[#8B0000]/5 rounded-full blur-3xl animate-pulse duration-[8000ms]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Detail */}
          <div className="space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-[#F27D26] font-mono">
              <Flame className="w-3.5 h-3.5 text-[#F27D26] mr-1.5 animate-bounce" />
              100% Raw Indian Red Onions • FSSAI Grade A Certified
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="block text-white">Purest Wholesale</span>
              <span className="block bg-gradient-to-r from-white via-[#F27D26] to-[#F27D26] bg-clip-text text-transparent">
                Onion Masala Base
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl pr-4">
              {t.tagline}. Eliminate peeling labor, weeping kitchen eyes, and fluctuating market prices of onions. Double-roasted bases packed in standard B2B bags.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto bg-[#F27D26] hover:bg-[#e06b16] font-bold text-black px-8 py-4 rounded-xl text-sm shadow-xl hover:shadow-[#F27D26]/20 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border-none"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>{t.orderBulk}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={onExploreBlogs}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-xl text-sm transition-all flex items-center justify-center cursor-pointer"
              >
                Explore Culinary Blogs
              </button>
            </div>

            {/* Micro Live Tickers */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div>
                <span className="block font-mono text-2xl font-black text-[#F27D26]">{activeKitch.toLocaleString()}+</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-400 font-mono">B2B Clients</span>
              </div>
              <div>
                <span className="block font-mono text-2xl font-black text-rose-500">{tonnesProcessed} Tons</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-400 font-mono">Active Delivery</span>
              </div>
              <div>
                <span className="block font-mono text-2xl font-black text-emerald-500">{fssaiScore}%</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-400 font-mono">Purity Compliance</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Banner Frame */}
          <div className="relative">
            {/* Ambient background plate */}
            <div className="absolute inset-0 bg-[#F27D26]/5 rounded-3xl blur-2xl"></div>

            {/* Premium FMCG-styled visual container */}
            <div className="relative bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 lg:p-8">
              {/* Product Badge Overlay */}
              <div className="absolute top-4 right-4 bg-[#F27D26] text-black text-[11px] font-black tracking-wider uppercase font-mono px-3 py-1 rounded-full z-10 shadow-md animate-pulse">
                Up to 30% Off
              </div>

              {/* Hero Image */}
              <div className="h-64 sm:h-80 w-full overflow-hidden rounded-xl border border-white/10 relative">
                <img
                  src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=750"
                  alt="Golden roasted Onion Masala spices"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover relative scale-105 hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/10 to-transparent"></div>

                {/* Overlaid Banner caption */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                  <span className="text-[#F27D26] text-xs font-bold font-mono">Featured Bulk Item</span>
                  <p className="text-white text-sm font-semibold truncate">Classic Golden Onion Masala (10Kg - 500Kg pouches)</p>
                </div>
              </div>

              {/* Instant B2B Pricing Callout */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#0E0E0E] p-2.5 rounded-lg border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono">10kg - 49kg</span>
                  <span className="block text-base font-black text-white mt-1">₹120/kg</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-[#F27D26]/30">
                  <span className="block text-[10px] text-[#F27D26] uppercase tracking-widest font-mono font-bold">50kg - 99kg</span>
                  <span className="block text-lg font-black text-white mt-0.5">₹110/kg</span>
                  <span className="text-[9px] text-[#F27D26] font-medium">Save ₹10/kg</span>
                </div>
                <div className="bg-[#0E0E0E] p-2.5 rounded-lg border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono">100kg+</span>
                  <span className="block text-base font-black text-white mt-1">₹99/kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Partners Marquee */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-xs font-mono uppercase tracking-widest text-center text-gray-400 mb-6 font-bold">
            Trusted by Leaders in QSR, Catering, & Hotel Distribution
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-center text-center">
            {PARTNERS.map((partner, index) => (
              <div
                key={index}
                className="p-3 bg-[#141414] border border-white/5 hover:border-[#F27D26]/30 rounded-xl transition-all font-mono text-xs text-gray-300 hover:text-[#F27D26] w-full"
              >
                {partner.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
