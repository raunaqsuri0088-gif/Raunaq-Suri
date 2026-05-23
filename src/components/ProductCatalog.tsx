import React, { useState } from "react";
import { Info, Sparkles, Scale, Percent, Check, Shuffle, RefreshCw } from "lucide-react";
import { Product, Language, CartItem } from "../types";
import { PRODUCTS, TRANSLATIONS } from "../data/staticData";

interface ProductCatalogProps {
  currentLanguage: Language;
  onAddToCart: (product: Product, quantityKg: number) => void;
  cart: CartItem[];
}

export default function ProductCatalog({ currentLanguage, onAddToCart, cart }: ProductCatalogProps) {
  const t = TRANSLATIONS[currentLanguage];

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  
  // Comparison Drawer State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const categories = ["All", "Masala Blend", "Dehydrated Base", "Specialty Blend"];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category === selectedCategory;
  });

  const getQuantity = (productId: string, prdMoq: number) => {
    return quantities[productId] !== undefined ? quantities[productId] : prdMoq;
  };

  const handleQtyChange = (productId: string, val: number, prdMoq: number) => {
    if (val < prdMoq) val = prdMoq;
    // Round to nearest standard bag sizes or standard kgs
    setQuantities({
      ...quantities,
      [productId]: Math.max(prdMoq, Math.floor(val))
    });
  };

  const getTierPriceInfo = (product: Product, qty: number) => {
    const tier = product.priceTiers.find(
      (tier) => qty >= tier.minQty && (tier.maxQty === -1 || qty <= tier.maxQty)
    );
    return tier ? tier.pricePerKg : product.priceTiers[0].pricePerKg;
  };

  const calculateSavingsPercent = (product: Product, qty: number) => {
    const highestPrice = product.priceTiers[0].pricePerKg;
    const currentPrice = getTierPriceInfo(product, qty);
    const savings = highestPrice - currentPrice;
    if (savings <= 0) return 0;
    return Math.round((savings / highestPrice) * 100);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        if (next.length === 0) setShowCompare(false);
        return next;
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 gourmet onion masala bases side-by-side.");
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="bg-[#0A0A0A] text-gray-100 py-12 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {t.ourCategories}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Select specific moisture retention levels and spice capacities for commercial cooking continuity.
            </p>
          </div>

          {/* Category Badges Filter */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0 font-mono text-xs">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-lg cursor-pointer border transition-all ${
                  selectedCategory === c
                    ? "bg-[#F27D26] border-none text-black font-black shadow-lg"
                    : "bg-[#141414] border-white/10 text-gray-400 hover:text-[#F27D26] hover:border-[#F27D26]/35"
                }`}
              >
                {c === "All" ? "All Products" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Comparison Banner Button */}
        {compareIds.length > 0 && (
          <div className="mb-6 bg-[#141414] border border-white/10 p-4 rounded-xl flex items-center justify-between shadow-2xl animate-pulse">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <Shuffle className="w-4 h-4 text-[#F27D26] animate-spin" />
              <span>
                Comparing <strong className="text-[#F27D26]">{compareIds.length}</strong> items side-by-side (Moisture, spice levels, shelf lives).
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCompareIds([])}
                className="text-xs text-gray-400 hover:text-red-400 font-mono"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="bg-[#F27D26] hover:bg-[#e06b16] text-black text-xs font-black font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {showCompare ? "Hide Details" : "View Comparison"}
              </button>
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Drawer details */}
        {showCompare && compareIds.length > 0 && (
          <div className="mb-10 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase font-mono tracking-wider text-[#F27D26]">
                  <th className="py-3 px-4">Parameter Benchmarks</th>
                  {compareIds.map((id) => {
                    const prd = PRODUCTS.find((p) => p.id === id);
                    return prd ? <th key={id} className="py-3 px-4 font-bold text-white">{prd.name[currentLanguage]}</th> : null;
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-400">Retail SKU</td>
                  {compareIds.map((id) => (
                    <td key={id} className="py-3 px-4 font-mono text-gray-400">{PRODUCTS.find((p) => p.id === id)?.sku}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-400">Min. Order Qty (MOQ)</td>
                  {compareIds.map((id) => (
                    <td key={id} className="py-3 px-4 font-bold text-emerald-500">{PRODUCTS.find((p) => p.id === id)?.moq} kg</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-400">Spice Standard Level</td>
                  {compareIds.map((id) => (
                    <td key={id} className="py-3 px-4">
                      <span className="bg-white/5 border border-white/10 text-[#F27D26] px-2.5 py-0.5 rounded font-mono text-[10px]">
                        {PRODUCTS.find((p) => p.id === id)?.spiceLevel}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-400">Guaranteed Shelf-Life</td>
                  {compareIds.map((id) => (
                    <td key={id} className="py-3 px-4 font-mono">{PRODUCTS.find((p) => p.id === id)?.shelfLife}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-400">Standard Pack Size Bag</td>
                  {compareIds.map((id) => (
                    <td key={id} className="py-3 px-4">{PRODUCTS.find((p) => p.id === id)?.bagsCount} kg pouches/bag</td>
                  ))}
                </tr>
                <tr className="bg-white/5">
                  <td className="py-3 px-4 font-bold text-[#F27D26]">Bulk Level Price / Kg</td>
                  {compareIds.map((id) => {
                    const prd = PRODUCTS.find((p) => p.id === id);
                    return prd ? (
                      <td key={id} className="py-3 px-4 font-bold text-[#F27D26]">
                        ₹{prd.priceTiers[2]?.pricePerKg || prd.priceTiers[1]?.pricePerKg || prd.priceTiers[0].pricePerKg} <span className="text-[10px] text-gray-400">(Max Tier)</span>
                      </td>
                    ) : null;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Interactive Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => {
            const curQty = getQuantity(p.id, p.moq);
            const pricePerKg = getTierPriceInfo(p, curQty);
            const totalCost = pricePerKg * curQty;
            const savingsPct = calculateSavingsPercent(p, curQty);
            const bagsRequired = Math.ceil(curQty / p.bagsCount);

            return (
              <div
                key={p.id}
                className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-[#F27D26]/30 hover:bg-[#141414]/95 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Card Top Image & Category */}
                <div>
                  <div className="h-48 w-full overflow-hidden relative border-b border-white/10 bg-[#0E0E0E]">
                    <img
                      src={p.image}
                      alt={p.name[currentLanguage]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>

                    {/* Compare Checkbox Toggle */}
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className={`absolute top-3 left-3 px-2 py-1.5 rounded-lg border text-[10px] font-mono leading-none tracking-wide transition-all z-10 flex items-center space-x-1 font-bold cursor-pointer ${
                        compareIds.includes(p.id)
                          ? "bg-[#F27D26] border-none text-black"
                          : "bg-black/60 border-white/10 text-gray-300 hover:bg-black/80"
                      }`}
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>{compareIds.includes(p.id) ? "Comparing" : "Compare"}</span>
                    </button>

                    {/* Stock Alert overlay */}
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-[#141414]/90 text-[#F27D26] border border-white/10 px-2.5 py-1 rounded">
                      Shelf-Life: {p.shelfLife}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-5 lg:p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#F27D26] font-semibold uppercase">
                          {p.category}
                        </span>
                        <h3 className="text-xl font-bold text-white tracking-tight mt-0.5 leading-snug">
                          {p.name[currentLanguage]}
                        </h3>
                      </div>
                    </div>

                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                      {p.description[currentLanguage]}
                    </p>

                    {/* Static pricing table breakdown */}
                    <div className="bg-[#0E0E0E] rounded-lg p-3 border border-white/5 text-xs text-stone-400 space-y-1.5">
                      <div className="text-[10px] font-mono text-[#F27D26] font-semibold uppercase tracking-wider mb-1">
                        Wholesale Tier Savings
                      </div>
                      {p.priceTiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between items-center px-1 py-0.5 rounded ${
                            curQty >= tier.minQty && (tier.maxQty === -1 || curQty <= tier.maxQty)
                              ? "text-[#F27D26] bg-white/5 font-extrabold"
                              : ""
                          }`}
                        >
                          <span>
                            {tier.minQty}
                            {tier.maxQty === -1 ? "+" : `-${tier.maxQty}`} kg
                          </span>
                          <span>₹{tier.pricePerKg} / kg</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Weight Calculator slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400">Input Order Weight:</span>
                        <span className="text-[#F27D26] font-bold text-sm">{curQty} kg</span>
                      </div>

                      <input
                        type="range"
                        min={p.moq}
                        max="250"
                        step={p.bagsCount}
                        value={curQty}
                        onChange={(e) => handleQtyChange(p.id, Number(e.target.value), p.moq)}
                        className="w-full accent-[#F27D26] h-1 bg-white/10 rounded-lg cursor-pointer appearance-none"
                      />

                      {/* Manual text weights override input */}
                      <div className="flex items-center justify-between space-x-2 text-xs">
                        <button
                          onClick={() => handleQtyChange(p.id, curQty - p.bagsCount, p.moq)}
                          className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/15 rounded font-bold text-gray-300 font-mono cursor-pointer"
                        >
                          -{p.bagsCount}kg
                        </button>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {bagsRequired} x {p.bagsCount}kg bags
                        </span>
                        <button
                          onClick={() => handleQtyChange(p.id, curQty + p.bagsCount, p.moq)}
                          className="px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/15 rounded font-bold text-gray-300 font-mono cursor-pointer"
                        >
                          +{p.bagsCount}kg
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom interactive total calculating and Add to Cart action */}
                <div className="p-5 lg:p-6 bg-[#111111] border-t border-white/10 space-y-3.5">
                  <div className="flex items-end justify-between font-mono">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-medium">Commercial Price</span>
                      <span className="text-lg font-black text-white font-mono">
                        ₹{pricePerKg} <span className="text-xs font-normal text-stone-400">/kg</span>
                      </span>
                    </div>

                    {savingsPct > 0 && (
                      <span className="bg-[#F27D26]/10 border border-[#F27D26]/20 text-[#F27D26] text-[10px] px-2 py-0.5 rounded font-bold flex items-center font-mono">
                        <Percent className="w-3 h-3 mr-0.5" />
                        Save {savingsPct}%
                      </span>
                    )}

                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 block uppercase font-medium">Subtotal</span>
                      <span className="text-lg font-black text-[#F27D26] font-mono">
                        ₹{totalCost.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(p, curQty)}
                    className="w-full bg-[#F27D26] hover:bg-[#e06b16] active:scale-95 text-black font-black text-xs py-3 rounded-lg border-none transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md hover:shadow-[#F27D26]/10"
                  >
                    <span>{t.addCart}</span>
                  </button>

                  <div className="text-[9px] text-center text-stone-500 font-mono flex items-center justify-center">
                    <Info className="w-3 h-3 mr-1 text-[#F27D26]" />
                    <span>{t.moqWarning} {p.moq}kg (Standard SKU Standard pouch weight verified).</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
