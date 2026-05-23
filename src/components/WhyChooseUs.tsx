import React, { useState } from "react";
import { Clock, ShieldCheck, DollarSign, Zap, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Language } from "../types";
import { TRANSLATIONS, CERTIFICATIONS } from "../data/staticData";

interface WhyChooseUsProps {
  currentLanguage: Language;
}

export default function WhyChooseUs({ currentLanguage }: WhyChooseUsProps) {
  const t = TRANSLATIONS[currentLanguage];

  // Contact form submission state
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    contact: "",
    volumeNeeded: "",
    phone: "",
    notes: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.phone) return;
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ company: "", contact: "", volumeNeeded: "", phone: "", notes: "" });
    }, 4000);
  };

  const b2bAdvantages = [
    {
      icon: Clock,
      title: "Eliminate Chef Prep Weariness",
      text: "Say goodbye to standard peeling, slicing, crying eyes, and 4-hour onion browning operations. Ready base cuts prep times by up to 70%."
    },
    {
      icon: ShieldCheck,
      title: "Unyielding Batch Consistency",
      text: "Our cold-milled roasting plant secures consistent moisture level and exact spiciness indicators, batch after batch."
    },
    {
      icon: DollarSign,
      title: "Hedge Onion Market Creeps",
      text: "No more paying ₹100/kg in winter shortages. Secure steady, predictable contract rates for 9 months with SpiceFlow B2B lines."
    },
    {
      icon: Zap,
      title: "Zero Waste, Zero Mess",
      text: "Normal onions bring 12% peel peel-off wastage and another 8% liquid rot standard. SpiceFlow packs represent 100% gourmet yield."
    }
  ];

  return (
    <section className="bg-[#0A0A0A] py-16 text-gray-100 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {t.whyChooseUs}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#F27D26] to-[#8B0000] mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            Professional FMCG processing designed directly for hotels, restaurants, caterers, and distribution networks across India.
          </p>
        </div>

        {/* Bento Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {b2bAdvantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#141414] border border-white/5 p-6 rounded-2xl hover:border-[#F27D26]/30 hover:bg-[#141414]/90 transition-all duration-300 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="p-3 bg-white/5 rounded-xl w-fit border border-white/10 text-[#F27D26] group-hover:bg-white/10 transition-all">
                    <Icon className="w-5 h-5 text-[#F27D26]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-4 tracking-tight">
                    {adv.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                    {adv.text}
                  </p>
                </div>
                <div className="pt-4 text-xs font-mono text-[#F27D26]/70 font-bold group-hover:text-[#F27D26] transition-colors">
                  SpiceFlow Advantage ✓
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications Row */}
        <div className="mt-20">
          <p className="text-xs uppercase tracking-widest font-mono text-center text-gray-400 font-bold mb-8">
            ─ {t.certifications} ─
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <div 
                key={cert.id} 
                className="bg-gradient-to-br from-[#141414] to-[#111111] p-5 rounded-xl border border-white/5 flex items-start space-x-3 text-left shadow-md shrink-0"
              >
                <div className="p-2.5 bg-white/5 rounded-lg text-[#F27D26] border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#F27D26]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{cert.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">{cert.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Inquiry Quick Form */}
        <div className="mt-20 bg-[#141414] rounded-2xl border border-white/10 p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F27D26]/5 rounded-full blur-2xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Form Left Info */}
            <div className="lg:col-span-5 space-y-4 font-sans">
              <h3 className="text-2xl font-black text-white leading-tight">
                Get Customized Factory Contract Rates
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Need more than 500kg per month? We formulate custom moisture content level or roasted onion grit size for industrial scale recipe consistency.
              </p>
              <div className="pt-2 text-xs font-mono text-[#F27D26] flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 mr-1 text-[#F27D26]" />
                <span>Dedicated accounts team responds in 15 mins</span>
              </div>
            </div>

            {/* Form Right Inputs */}
            <form onSubmit={handleContactSubmit} className="lg:col-span-7 space-y-4">
              {formSent ? (
                <div className="p-6 bg-emerald-950/20 border border-emerald-900 rounded-xl text-center space-y-2">
                  <ThumbsUp className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Wholesale Quotation Request Received!</p>
                  <p className="text-xs text-gray-400">Our logistics desk will contact you via phone shortly.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-400 tracking-wider font-semibold font-mono">Company / Appellation</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Royal Punjab Catering Ltd" 
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-600 focus:outline-none focus:border-[#F27D26]/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-400 tracking-wider font-semibold font-mono">Your Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 98765 43210" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-600 focus:outline-none focus:border-[#F27D26]/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-400 tracking-wider font-semibold font-mono">Chef Contact Person</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chef Singhania"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-600 focus:outline-none focus:border-[#F27D26]/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-400 tracking-wider font-semibold font-mono">Est Monthly Buying (Kg)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 250kg / month"
                      value={formData.volumeNeeded}
                      onChange={(e) => setFormData({...formData, volumeNeeded: e.target.value})}
                      className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-600 focus:outline-none focus:border-[#F27D26]/60"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <textarea 
                      placeholder="Outline any special roasting level or dietary parameters (organic, low sodium, paste context)"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg p-3 text-xs text-gray-100 placeholder-stone-600 focus:outline-none focus:border-[#F27D26]/60"
                    />
                  </div>
                  <div className="sm:col-span-2 mt-2 font-mono">
                    <button 
                      type="submit" 
                      className="w-full bg-[#F27D26] hover:bg-[#e06b16] font-bold text-black text-xs py-3 rounded-lg flex items-center justify-center space-x-1 cursor-pointer transition-all border-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Quick Quotation Request</span>
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-1.5 font-mono">
                      FSSAI Registered Dispatch Registry • 100% Secure Private Business Communication
                    </p>
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>

      </div>
    </section>
  );
}
