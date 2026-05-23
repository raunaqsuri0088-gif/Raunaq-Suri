import React from "react";
import { Download, FileText, Phone, Award, ShieldCheck, Mail, MapPin } from "lucide-react";
import { Language } from "../types";
import { TRANSLATIONS } from "../data/staticData";

interface FooterProps {
  currentLanguage: Language;
}

export default function Footer({ currentLanguage }: FooterProps) {
  const t = TRANSLATIONS[currentLanguage];

  const handleDownloadCatalog = () => {
    alert("Initiating SpiceFlow B2B Bulk Specifications and Contract Catalog download (Includes FSSAI chemical analysis and shelf stability certificates).");
    // Standard mock file trigger
    const link = document.createElement("a");
    link.href = "#";
    link.click();
  };

  return (
    <footer className="bg-[#0E0E0E] text-stone-400 border-t border-white/10 pt-12 pb-6 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#F27D26] rounded-lg text-black font-mono font-black tracking-widest text-sm">
                SF
              </div>
              <span className="text-lg font-black text-white">
                {t.brand}
              </span>
            </div>
            <p className="text-stone-500 font-medium leading-relaxed leading-normal">
              Premium FMCG-standard roasted onions, flakes, ginger garlic condiments, and custom bulk catering bases milled for massive hotels and recipe consistency.
            </p>
            <div className="text-[10px] text-stone-600 font-mono">
              © {new Date().getFullYear()} SpiceFlow FMCG Pvt Ltd. All rights reserved. Registered under India Company Act.
            </div>
          </div>

          {/* Quick links Col */}
          <div className="space-y-3.5">
            <h4 className="text-[#F27D26] uppercase font-bold tracking-widest font-mono text-[10px]">
              Commercial Products
            </h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Classic Golden Base</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Smokey Tandoori Onion Base</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Spicy Ginger-Garlic Paste</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Dehydrated Pink Flakes (Biryani Special)</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Royal Mughlai White Cashew Base</a></li>
            </ul>
          </div>

          {/* Logistics coordinates Col */}
          <div className="space-y-3.5">
            <h4 className="text-[#F27D26] uppercase font-bold tracking-widest font-mono text-[10px]">
              Supply Chain Coordinates
            </h4>
            <ul className="space-y-2 text-stone-500 font-medium">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>Milling Plant: Industrial Corridor Phase II, Mohali, G.T. Highway Corridor, Punjab.</span>
              </li>
              <li className="flex items-center space-x-2 font-mono text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{t.fssaiLicense}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>wholesale@spiceflow.com</span>
              </li>
            </ul>
          </div>

          {/* Catalog Download Col */}
          <div className="space-y-4">
            <h4 className="text-[#F27D26] uppercase font-bold tracking-widest font-mono text-[10px]">
              B2B Standard Literature
            </h4>
            <p className="text-stone-500 leading-normal">
              Download our premium specifications manual containing chemical analysis of moisture retention, HACCP ratings, and bulk logistics timelines.
            </p>
            <button
               onClick={handleDownloadCatalog}
               className="w-full bg-[#141414] border border-white/10 hover:border-[#F27D26]/40 text-[#F27D26] hover:text-white font-mono font-bold text-[10px] py-3.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download B2B Catalog Spec Sheets</span>
            </button>
          </div>

        </div>

        {/* FSSAI Central Stamp */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 tracking-wide font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-[#F27D26] rounded-full animate-pulse"></span>
            <span>Centrally Monitored Cold Chain Logistics Corridor</span>
          </div>
          <div className="mt-3 sm:mt-0 font-bold uppercase tracking-wider text-[#F27D26]/85 leading-none font-mono">
            Grade A vacuum packaging. Nitrogen flushed for 9 months shelf life preservation.
          </div>
        </div>

      </div>
    </footer>
  );
}
