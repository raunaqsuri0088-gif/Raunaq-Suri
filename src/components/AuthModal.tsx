import React, { useState } from "react";
import { X, ShieldCheck, Phone, Landmark, Building, MapPin, Eye, Zap } from "lucide-react";
import { Language, BusinessType, UserRole } from "../types";
import { TRANSLATIONS } from "../data/staticData";

interface AuthModalProps {
  currentLanguage: Language;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({ currentLanguage, onClose, onAuthSuccess }: AuthModalProps) {
  const t = TRANSLATIONS[currentLanguage];

  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Registration states
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.RESTAURANT);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit telephone number.");
      return;
    }

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Login fail. Please check your credentials.");
        } else {
          setOtpSent(true);
          setSuccessMsg("SMS Sent! Enter code '1234' to authorize connection.");
        }
      } else {
        // Register flow
        if (!companyName || !gstNumber || !contactName) {
          setErrorMsg("Please complete all B2B registration details.");
          return;
        }
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName,
            gstNumber,
            phoneNumber,
            businessType,
            deliveryAddress,
            contactName,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Registration fail.");
        } else {
          setOtpSent(true);
          setSuccessMsg("B2B registration submitted! Verify with code '1234'.");
        }
      }
    } catch (err) {
      setErrorMsg("Network error contacting plant server.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Incorrect OTP. Please retry.");
      } else {
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg("Network error validating code.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        
        {/* Header toolbar */}
        <div className="p-4 bg-[#141414] border-b border-white/10 flex justify-between items-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F27D26]">
            SpiceFlow Corporate Portal
          </span>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-stone-500 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main container */}
        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-950/30 border border-red-900 text-red-300 rounded-lg text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-950/30 border border-green-900 text-green-300 rounded-lg text-xs font-medium">
              ✓ {successMsg}
            </div>
          )}

          {!otpSent ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {isLogin ? "Wholesale Partner Log In" : t.buyerRegister}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Authenticate using your registered mobile number and password-free OTP verification.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 bg-[#0A0A0A] rounded-lg p-1 border border-white/10 text-xs font-semibold font-mono">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(""); }}
                  className={`py-2 rounded-md cursor-pointer transition-colors ${isLogin ? "bg-[#F27D26] text-black font-black" : "text-gray-400 hover:text-white"}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(""); }}
                  className={`py-2 rounded-md cursor-pointer transition-colors ${!isLogin ? "bg-[#F27D26] text-black font-black" : "text-gray-400 hover:text-white"}`}
                >
                  Register Business
                </button>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Registered Account Toggle Details */}
                {!isLogin && (
                  <div className="space-y-3.5 pt-2 font-sans">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold font-mono">Company Legal Label</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Grand Sharda Banquet Caterers"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/15 focus:border-[#F27D26] rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-700 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold font-mono">GSTIN ID (India)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 07AAAAA1111A1Z1"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          className="w-full bg-[#0A0A0A] border border-white/15 focus:border-[#F27D26] rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-700 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold font-mono">Contact Person</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Chef Singhania"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-[#0A0A0A] border border-white/15 focus:border-[#F27D26] rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Business Classification types */}
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold font-mono">Business Segment</label>
                        <select
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                          className="w-full bg-[#0A0A0A] border border-white/15 focus:border-[#F27D26] rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none font-medium"
                        >
                          <option value={BusinessType.RESTAURANT}>Restaurant / QSR</option>
                          <option value={BusinessType.CATERER}>Caterer / Events</option>
                          <option value={BusinessType.HOTEL}>Hotel / Resort</option>
                          <option value={BusinessType.DISTRIBUTOR}>Wholesale Distributor</option>
                          <option value={BusinessType.CLOUDKITCHEN}>Cloud Kitchen</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase tracking-wider text-stone-600 font-bold font-mono">FSSAI Status</label>
                        <div className="text-emerald-500 text-xs font-mono font-bold flex items-center h-8 bg-green-950/10 rounded-lg px-2 border border-green-900/20">
                          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
                          <span>Self Asserted</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold font-mono">FMCG Shipping Destination</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Complete commercial warehouse/kitchen destination address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/15 focus:border-[#F27D26] rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-stone-700 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Telephone Number */}
                <div className="space-y-1.5 font-sans">
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold font-mono">Register phone number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#F27D26] absolute left-3 top-2.5" />
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/15 focus:border-[#F27D26] rounded-lg pl-10 pr-3 py-2.5 text-xs text-gray-100 placeholder-stone-700 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[9px] text-stone-500 leading-normal">
                    * Make sure to use <strong className="text-stone-300">9876543210</strong> to instantly access the preconfigured live B2B showroom demo account!
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F27D26] hover:bg-[#e06b16] active:scale-95 text-black font-black text-xs py-3.5 rounded-lg border-none transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center space-x-1"
                >
                  <Zap className="w-4 h-4 text-black animate-pulse" />
                  <span>Request OTP SMS Code</span>
                </button>
              </form>
            </div>
          ) : (
            // Verification Code layout
            <form onSubmit={handleVerifyOtp} className="space-y-4 py-3 font-sans">
              <div className="text-center space-y-1">
                <Building className="w-10 h-10 text-[#F27D26] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Verification OTP Code Required
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  A verification code has been dispatched via our simulated corporate pipeline to <strong className="text-[#F27D26] font-mono"> {phoneNumber}</strong>.
                </p>
              </div>

              <div className="space-y-1.5 text-center mt-6">
                <label className="block text-[10px] uppercase tracking-wider text-[#F27D26] font-bold font-mono">Enter 4-digit verification code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  placeholder="Code '1234' is active"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="bg-[#0A0A0A] border-2 border-white/15 rounded-xl px-4 py-3 text-lg font-mono font-bold tracking-widest text-center text-white focus:outline-none focus:border-[#F27D26] max-w-[160px] mx-auto block"
                />
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-lg p-3 text-center text-[10px] text-gray-400 font-mono">
                💡 Demo Key: enter <strong className="text-[#F27D26]">1234</strong> or <strong className="text-[#F27D26]">123456</strong> to proceed immediately.
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-1/2 bg-[#141414] text-gray-400 hover:text-white border border-white/10 text-xs py-3 rounded-lg font-bold font-mono transition-colors cursor-pointer"
                >
                  Change Name/Phone
                </button>

                <button
                  type="submit"
                  className="w-1/2 bg-[#F27D26] hover:bg-[#e06b16] text-black text-xs py-3 rounded-lg font-black transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>Verify and Authorize ✓</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Brand stamp footer */}
        <div className="p-4 bg-[#0E0E0E] text-[9.5px] border-t border-white/10 text-stone-500 text-center font-mono uppercase tracking-widest">
          SpiceFlow Processing Plant • Licensed under FSSAI Standards
        </div>
      </div>
    </div>
  );
}
