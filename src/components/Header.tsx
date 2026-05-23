import React, { useState } from "react";
import { Menu, X, ShoppingCart, User, Globe, LogOut, Award, Shield } from "lucide-react";
import { Language, User as UserType, CartItem } from "../types";
import { TRANSLATIONS } from "../data/staticData";

interface HeaderProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  cart: CartItem[];
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({
  currentLanguage,
  setLanguage,
  currentUser,
  onLogout,
  onOpenAuth,
  cart,
  onOpenCart,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[currentLanguage];

  const totalCartWeight = cart.reduce((sum, item) => sum + item.quantityKg, 0);
  const totalCartValue = cart.reduce((sum, item) => {
    // Determine tiered price
    const qty = item.quantityKg;
    const tier = item.product.priceTiers.find((t) => qty >= t.minQty && (t.maxQty === -1 || qty <= t.maxQty));
    const price = tier ? tier.pricePerKg : item.product.priceTiers[0].pricePerKg;
    return sum + (qty * price);
  }, 0);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const languages = [
    { code: Language.EN, label: "English (EN)" },
    { code: Language.HI, label: "हिन्दी (HI)" },
    { code: Language.PA, label: "ਪੰਜਾਬੀ (PA)" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111111]/95 border-b border-white/10 text-gray-100 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="p-2 bg-gradient-to-tr from-[#F27D26] to-[#8B0000] rounded-lg shadow-md flex items-center justify-center font-bold text-lg italic">
              <span className="font-mono text-xl font-black text-white tracking-widest uppercase">SF</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-white uppercase">
                Spice<span className="text-[#F27D26]">Flow</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[9px] uppercase tracking-widest font-mono text-[#F27D26] font-semibold px-1 rounded bg-white/5 border border-white/10">
                Wholesale
              </span>
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex space-x-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick("home")}
              className={`hover:text-white transition-colors py-1.5 px-3 rounded-md border ${
                activeTab === "home" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-400 border-transparent hover:bg-white/5"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("catalog")}
              className={`hover:text-white transition-colors py-1.5 px-3 rounded-md border ${
                activeTab === "catalog" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-400 border-transparent hover:bg-white/5"
              }`}
            >
              Masala Catalog
            </button>
            <button
              onClick={() => handleNavClick("blogs")}
              className={`hover:text-white transition-colors py-1.5 px-3 rounded-md border ${
                activeTab === "blogs" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-400 border-transparent hover:bg-white/5"
              }`}
            >
              Chef Blogs
            </button>
            {currentUser && (
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`hover:text-white transition-colors py-1.5 px-3 rounded-md flex items-center space-x-1 border ${
                  activeTab === "dashboard" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-400 border-transparent hover:bg-white/5"
                }`}
              >
                <span>B2B Dashboard</span>
                {currentUser.approved && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
              </button>
            )}
            <button
              onClick={() => handleNavClick("admin")}
              className={`hover:text-white transition-colors py-1.5 px-3 rounded-md flex items-center space-x-1 border ${
                activeTab === "admin" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-400 border-transparent hover:bg-white/5"
              }`}
            >
              <span className="font-mono text-xs">Admin Desk</span>
            </button>
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-1"
                aria-label="Toggle language menu"
              >
                <Globe className="w-4 h-4 text-[#F27D26]" />
                <span className="text-xs font-semibold uppercase">{currentLanguage}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#111111] border border-white/10 rounded-md shadow-2xl py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-white/5 hover:text-[#F27D26] ${
                        currentLanguage === l.code ? "text-[#F27D26] bg-white/5 font-bold" : "text-gray-300"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-[#141414] border border-white/10 hover:border-[#F27D26]/40 hover:text-white rounded-lg transition-all duration-200 flex items-center space-x-1 text-gray-200"
            >
              <ShoppingCart className="w-4 h-4 text-[#F27D26]" />
              {totalCartWeight > 0 && (
                <span className="text-xs font-mono font-bold text-white hidden sm:inline">
                  {totalCartWeight} kg (₹{totalCartValue.toLocaleString("en-IN")})
                </span>
              )}
              {totalCartWeight > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F27D26] text-black font-mono font-black text-[9px] px-1.5 py-0.5 rounded-full scale-90">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Authentication Portal Badge */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-[#141414] border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                <div className="hidden lg:block text-right">
                  <div className="font-semibold text-gray-200 max-w-[120px] truncate">{currentUser.companyName}</div>
                  <div className="flex items-center justify-end text-[9px] text-[#F27D26] font-mono">
                    <Award className="w-3 h-3 mr-0.5" />
                    <span>{currentUser.clubLevel} Club</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 px-2 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 rounded transition-all flex items-center space-x-1 font-medium cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-[#F27D26] hover:bg-[#e06b16] font-black text-black px-4 py-2 rounded-lg text-xs leading-none shadow-md transition-all flex items-center space-x-1 cursor-pointer hover:shadow-[#F27D26]/10"
              >
                <User className="w-3.5 h-3.5" />
                <span>Partner Portal</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-white/5 rounded-lg md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-white/10 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleNavClick("home")}
            className={`w-full text-left py-2 px-3 rounded-md text-sm border ${
              activeTab === "home" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-300 border-transparent"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("catalog")}
            className={`w-full text-left py-2 px-3 rounded-md text-sm border ${
              activeTab === "catalog" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-300 border-transparent"
            }`}
          >
            Masala Catalog
          </button>
          <button
            onClick={() => handleNavClick("blogs")}
            className={`w-full text-left py-2 px-3 rounded-md text-sm border ${
              activeTab === "blogs" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-300 border-transparent"
            }`}
          >
            Chef Blogs
          </button>
          {currentUser && (
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`w-full text-left py-2 px-3 rounded-md text-sm flex items-center justify-between border ${
                activeTab === "dashboard" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-300 border-transparent"
              }`}
            >
              <span>B2B Dashboard</span>
              <span className="text-[10px] bg-white/5 text-[#F27D26] font-mono px-1.5 py-0.5 rounded border border-white/10">
                {currentUser.clubLevel} Club
              </span>
            </button>
          )}
          <button
            onClick={() => handleNavClick("admin")}
            className={`w-full text-left py-2 px-3 rounded-md text-sm border ${
              activeTab === "admin" ? "bg-[#141414] text-[#F27D26] border-[#F27D26]/20 font-bold" : "text-gray-400 border-transparent"
            }`}
          >
            Admin Supply Desk
          </button>

          {currentUser && (
            <div className="pt-2 border-t border-white/10">
              <div className="px-3 py-1 text-xs text-stone-500">
                Logged in as: <strong className="text-stone-300">{currentUser.companyName}</strong>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-red-400 hover:bg-white/5 rounded-md text-sm flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
