import { Product, Language, BusinessType, OrderStatus } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "sf-onion-masala-classic",
    name: {
      en: "Classic Golden Onion Masala Base",
      hi: "क्लासिक गोल्डन प्याज मसाला बेस",
      pa: "ਕਲਾਸਿਕ ਗੋਲਡਨ ਪਿਆਜ਼ ਮਸਾਲਾ ਬੇਸ"
    },
    sku: "SF-ONM-CLS-100",
    description: {
      en: "Authentic double-roasted red onion paste dried to perfection with cold-milled oil. Perfect for Punjabi curries, handis, and luxury gravies.",
      hi: "ठंडे घाने के तेल में भुना हुआ असली लाल प्याज का मसाला बेस। पंजाबी कढ़ी, हांडी और लजीज ग्रेवी के लिए उत्तम।",
      pa: "ਠੰਡੇ ਪੀੜੇ ਤੇਲ ਵਿੱਚ ਭੁੰਨਿਆ ਹੋਇਆ ਅਸਲੀ ਲਾਲ ਪਿਆਜ਼ ਦਾ ਮਸਾਲਾ ਬੇਸ। ਪੰਜਾਬੀ ਕੜ੍ਹੀ, ਹਾਂਡੀ ਅਤੇ ਸਵਾਦਿਸ਼ਟ ਗ੍ਰੇਵੀ ਲਈ ਉੱਤਮ।"
    },
    priceTiers: [
      { minQty: 10, maxQty: 49, pricePerKg: 120 },
      { minQty: 50, maxQty: 99, pricePerKg: 110 },
      { minQty: 100, maxQty: -1, pricePerKg: 99 }
    ],
    category: "Masala Blend",
    moq: 10,
    bagsCount: 10, // 10kg standard bag unit
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=700",
    spiceLevel: "Medium",
    shelfLife: "9 Months",
    inStockKg: 2450
  },
  {
    id: "sf-onion-masala-tandoori",
    name: {
      en: "Premium Smokey Tandoori Onion Masala",
      hi: "प्रीमियम स्मोकी तंदूरी प्याज मसाला",
      pa: "ਪ੍ਰੀਮੀਅਮ ਸਮੋਕੀ ਤੰਦੂਰੀ ਪਿਆਜ਼ ਮਸਾਲਾ"
    },
    sku: "SF-ONM-TND-200",
    description: {
      en: "Smoked with organic charcoal. Delivers high retention of aroma and rich color to tandoori marinades, tikkas, and BBQ base sauces.",
      hi: "जैविक कोयले से सुगन्धित। तंदूरी मैरिनेड, टिक्का और बीबीक्यू ग्रेवी को गहरा रंग और लाजवाब खुशबू प्रदान करता है।",
      pa: "ਜੈਵਿਕ ਕੋਲੇ ਨਾਲ ਧੂੰਆਂ ਦਿੱਤਾ ਹੋਇਆ। ਤੰਦੂਰੀ ਮੈਰੀਨੇਡ, ਟਿੱਕਾ ਤੇ ਬਾਰਬੀਕਿਊ ਗ੍ਰੇਵੀ ਨੂੰ ਗੂੜ੍ਹਾ ਰੰਗ ਤੇ ਲਾਜਵਾਬ ਖੁਸ਼ਬੂ ਦਿੰਦਾ ਹੈ।"
    },
    priceTiers: [
      { minQty: 10, maxQty: 49, pricePerKg: 135 },
      { minQty: 50, maxQty: 99, pricePerKg: 125 },
      { minQty: 100, maxQty: -1, pricePerKg: 112 }
    ],
    category: "Specialty Blend",
    moq: 10,
    bagsCount: 10,
    image: "https://images.unsplash.com/photo-1618413912685-c1a41857948f?auto=format&fit=crop&q=80&w=700",
    spiceLevel: "Hot",
    shelfLife: "6 Months",
    inStockKg: 1500
  },
  {
    id: "sf-onion-garlic-spicy",
    name: {
      en: "Spicy Garlic & Ginger Red Onion Paste Blend",
      hi: "तीखा लहसुन, अदरक और लाल प्याज मसाला",
      pa: "ਤੀਖਾ ਲਸਣ, ਅਦਰਕ ਤੇ ਲਾਲ ਪਿਆਜ਼ ਮਸਾਲਾ"
    },
    sku: "SF-ONM-SGG-300",
    description: {
      en: "All-in-one culinary savior pre-loaded with premium garlic cloves and high-gingerol ginger. Reduces restaurant kitchen preparation time by 75%.",
      hi: "लहसुन और अदरक से भरपूर आल-इन-वन मसाला। रेस्टोरेंट किचन की तैयारी के समय को 75% तक कम करता है।",
      pa: "ਲਸਣ ਤੇ ਅਦਰਕ ਨਾਲ ਭਰਪੂਰ ਆਲ-ਇਨ-ਵਨ ਮਸਾਲਾ। ਰੈਸਟੋਰੈਂਟ ਰਸੋਈ ਦੀ ਤਿਆਰੀ ਦੇ ਸਮੇਂ ਨੂੰ 75% ਤੱਕ ਘਟਾਉਂਦਾ ਹੈ।"
    },
    priceTiers: [
      { minQty: 20, maxQty: 59, pricePerKg: 145 },
      { minQty: 60, maxQty: 119, pricePerKg: 130 },
      { minQty: 120, maxQty: -1, pricePerKg: 118 }
    ],
    category: "Masala Blend",
    moq: 20,
    bagsCount: 20,
    image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&q=80&w=700",
    spiceLevel: "Extra Hot",
    shelfLife: "8 Months",
    inStockKg: 1980
  },
  {
    id: "sf-dehydrated-onion-flakes",
    name: {
      en: "Dehydrated Pink Onion Flakes (Bulk)",
      hi: "निर्जलित गुलाबी प्याज के गुच्छे (थोक)",
      pa: "ਡੀਹਾਈਡ੍ਰੇਟਿਡ ਪਿੰਕ ਪਿਆਜ਼ ਦੇ ਫਲੇਕਸ (ਥੋਕ)"
    },
    sku: "SF-ONF-DEH-400",
    description: {
      en: "Crisp pink onions dehydrated inside smart solar dehydrators. Perfect for biryani garnishes, soups, seasonings, and long-term shelf storage.",
      hi: "स्मार्ट सोलर डिहाइड्रेटर में सुखाए गए कुरकुरे गुलाबी प्याज के गुच्छे। बिरयानी गार्निश, सूप और थोक भंडारण के लिए एकदम सही।",
      pa: "ਸਮਾਰਟ ਸੋਲਰ ਡੀਹਾਈਡ੍ਰੇਟਰ ਵਿੱਚ ਸੁਕਾਏ ਗਏ ਕੁਰਕੁਰੇ ਗੁਲਾਬੀ ਪਿਆਜ਼ ਦੇ ਫਲੇਕਸ। ਬਿਰਆਨੀ ਗਾਰਨਿਸ਼, ਸੂਪ ਅਤੇ ਲੰਬੇ ਸਮੇਂ ਦੇ ਭੰਡਾਰਨ ਲਈ ਢੁਕਵੇਂ।"
    },
    priceTiers: [
      { minQty: 50, maxQty: 99, pricePerKg: 210 },
      { minQty: 100, maxQty: 249, pricePerKg: 195 },
      { minQty: 250, maxQty: -1, pricePerKg: 175 }
    ],
    category: "Dehydrated Base",
    moq: 50,
    bagsCount: 50,
    image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&q=80&w=700",
    spiceLevel: "Mild",
    shelfLife: "12 Months",
    inStockKg: 5400
  },
  {
    id: "sf-moghulai-royal-white",
    name: {
      en: "Royal Mughlai White Onion & Cashew Base",
      hi: "शाही मुगलाई सफेद प्याज और काजू बेस",
      pa: "ਸ਼ਾਹੀ ਮੁਗਲਈ ਸਫੇਦ ਪਿਆਜ਼ ਤੇ ਕਾਜੂ ਬੇਸ"
    },
    sku: "SF-ONM-MUG-500",
    description: {
      en: "Creamy white onions caramelized with light cashew kernel dust. Delivers authentic rich, non-sweet creaminess to Kormas and Awadhi dishes.",
      hi: "काजू के बुरादे के साथ कैरामेल की गई क्रीमी सफेद प्याज। कोरमा और अवधी व्यंजनों को बिना चीनी के मलाईदार बनावट देती है।",
      pa: "ਕਾਜੂ ਦੇ ਚੂਰੇ ਨਾਲ ਤਿਆਰ ਕੀਤੀ ਕ੍ਰੀਮੀ ਸਫੇਦ ਪਿਆਜ਼। ਕੋਰਮਾ ਅਤੇ ਅਵਧੀ ਪਕਵਾਨਾਂ ਨੂੰ ਬਿਨਾਂ ਖੰਡ ਦੇ ਮਲਾਈਦਾਰ ਤਿਆਰੀ ਦਿੰਦੀ ਹੈ।"
    },
    priceTiers: [
      { minQty: 10, maxQty: 49, pricePerKg: 180 },
      { minQty: 50, maxQty: 99, pricePerKg: 165 },
      { minQty: 100, maxQty: -1, pricePerKg: 148 }
    ],
    category: "Specialty Blend",
    moq: 10,
    bagsCount: 10,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=700",
    spiceLevel: "Mild",
    shelfLife: "6 Months",
    inStockKg: 850
  }
];

export const CERTIFICATIONS = [
  { name: "FSSAI ISO Verified", id: "fssai", detail: "Central License 10023485934520", icon: "ShieldCheck" },
  { name: "HACCP Certified", id: "haccp", detail: "Hazard Analysis Critical Control Point", icon: "Award" },
  { name: "100% Natural", id: "natural", detail: "No artificial chemicals or MSG added", icon: "Leaf" },
  { name: "Export Quality Grade A", id: "export", detail: "Serving Middle East, Canada & Europe", icon: "Globe" }
];

export const PARTNERS = [
  { name: "Royal Spice Bistro Chains", logo: "👑 Royal Spice" },
  { name: "Tandoor Nation Hotels", logo: "🔥 Tandoor Nation" },
  { name: "Dhaba 1947", logo: "🏡 Dhaba 1947" },
  { name: "CaterMax India Ltd", logo: "🍽️ CaterMax" },
  { name: "Sardar Distributors", logo: "🚛 Sardar Wholesale" },
  { name: "Great Indian Banquet Co.", logo: "✨ Banquet Co." }
];

export const RECIPES_BLOGS = [
  {
    id: "blog-1",
    title: {
      en: "How Commercial Kitchens Saved 70% Prep Labor with SpiceFlow Bases",
      hi: "कमर्शियल किचन कैसे बचाते हैं 70% वर्किंग क्राफ्ट: स्पाइसफ्लो मसाला सीक्रेट",
      pa: "ਕਮਰਸ਼ੀਅਲ ਕਿਚਨਾਂ ਕਿਵੇਂ ਬਚਾਉਂਦੀਆਂ ਹਨ 70% ਕੰਮ ਦੀ ਮਿਹਨਤ: ਸਪਾਈਸਫਲੋ ਮਸਾਲਾ ਸੀਕਰੇਟ"
    },
    chef: "Chef Sanjeev Kapur (Consultant)",
    readTime: "5 mins read",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=700",
    excerpt: {
      en: "We calculate the exact time spent on peeling, chopping, frying onions, and how dehydrated paste ensures consistency.",
      hi: "हम प्याज छीलने, काटने और तलने में लगने वाले समय और स्थिरता सुनिश्चित करने के गणित को समझेंगे।",
      pa: "ਅਸੀਂ ਪਿਆਜ਼ ਛਿੱਲਣ, ਕੱਟਣ ਅਤੇ ਤਲਣ ਵਿੱਚ ਲੱਗਣ ਵਾਲੇ ਸਮੇਂ ਅਤੇ ਸਥਿਰਤਾ ਯਕੀਨੀ ਬਣਾਉਣ ਦੇ ਗਣਿਤ ਨੂੰ ਸਮਝਾਂਗੇ।"
    },
    content: "Peeling onions causes 12% weight wastage. Spoilage takes another 5%. Fuel usage for browning onions can swallow up to 18% of LPG costs in high-volume catering. Cook with SpiceFlow to skip standard cooking labor entirely..."
  },
  {
    id: "blog-2",
    title: {
      en: "Perfecting Awadhi & Mughlai Gravies in Bulk: Cashew vs Coconut Base",
      hi: "थोक में अवधी एवं मुगलई ग्रेवी को सिद्ध करना: काजू बनाम नारियल बेस",
      pa: "ਥੋਕ ਵਿੱਚ ਅਵਧੀ ਅਤੇ ਮੁਗਲਈ ਗ੍ਰੇਵੀ ਨੂੰ ਸਿੱਧ ਕਰਨਾ: ਕਾਜੂ ਬਨਾਮ ਨਾਰੀਅਲ ਬੇਸ"
    },
    chef: "Chef Manpreet Singh (Grand Hyatt)",
    readTime: "7 mins read",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=700",
    excerpt: {
      en: "A comprehensive deep-dive into maintaining thickness and glaze under massive wedding orders without losing shelf life.",
      hi: "शेल्फ लाइफ खोए बिना बड़े पैमाने पर शादी के ऑर्डर्स के तहत ग्रेवी की चमक और गाढ़ेपन को बनाए रखने का गाइड।",
      pa: "ਸ਼ੈਲਫ ਲਾਈਫ ਗੁਆਏ ਬਿਨਾਂ ਵੱਡੇ ਪੱਧਰ 'ਤੇ ਵਿਆਹ ਦੇ ਆਰਡਰਾਂ ਦੇ ਤਹਿਤ ਗ੍ਰੇਵੀ ਦੀ ਚਮਕ ਅਤੇ ਸੰਘਣੇਪਣ ਨੂੰ ਬਣਾਈ ਰੱਖਣ ਦੀ ਗਾਈਡ।"
    },
    content: "When handling catering orders for more than 1000 people, cascading cashew cream gets highly volatile. Emulsifying it with white caramelized onion paste secures consistency..."
  }
];

export const TRANSLATIONS = {
  en: {
    brand: "SpiceFlow",
    tagline: "Ultra-Premium Onion Masala Base for Commercial Kitchens & Distributors",
    orderBulk: "Order in Bulk & Save 30%",
    whatsappInquiry: "WhatsApp Inquiry",
    whyChooseUs: "Why B2B Kitchens Choose SpiceFlow",
    ourCategories: "Commercial Product Categories",
    testimonials: "Partner Testimonials",
    certifications: "Strict Food Safety Certifications",
    contactUs: "Contact Commercial Sales Team",
    buyerRegister: "B2B Wholesale Registration",
    approvedStatus: "Verification Admin Approval",
    dashboardTitle: "Partner Wholesale Portal",
    reorderBtn: "Quick Reorder",
    walletBalance: "Distributor Wallet",
    creditLimit: "Assigned Credit Line",
    pendingInvoices: "Pending Commercial Invoices",
    deliveryStatus: "Live GPS Tracking Status",
    aiSmartOrdering: "SpiceFlow AI Smart Stock Controller",
    adminTitle: "FMCG Plant Supply Desk (Admin)",
    liveTracker: "Supply Chain Live Tracking Status",
    gstBilling: "Automated GST Commercial Invoice",
    paySecure: "Secure Razorpay Corporate Checkout",
    loyaltyPoints: "Loyalty Tier Points",
    languageLabel: "Language",
    moqWarning: "Min Order Quantity (MOQ) is",
    calculateSavings: "Calculate Tiered Pricing Savings",
    addCart: "Add to Wholesale Cart",
    saveCart: "Save Active Purchase Cart",
    checkoutBtn: "Proceed to Wholesale Checkout",
    approvedMsg: "Welcome! Your GST and Business entity are verified. Quick delivery active.",
    pendingApproveMsg: "Your application is under FSSAI & GST review. Admin approval usually takes 30 mins.",
    adminApproveBtn: "Verify & Approve Partner",
    adminActiveUsers: "Verified Wholesalers Group",
    adminLowStock: "Critical Supply Plant Warnings",
    customerActivity: "Customer Real-Time Activity",
    futureFeatures: "AI Demand & Voice Orders Hub (Concept Preview)",
    fssaiLicense: "FSSAI License: #10023041049285",
    recipeHeading: "SpiceFlow Head Chef Secrets & Culinary Blogs"
  },
  hi: {
    brand: "स्पाइसफ्लो",
    tagline: "कमर्शियल किचन और थोक वितरकों के लिए अति-प्रीमियम प्याज मसाला बेस",
    orderBulk: "थोक में ऑर्डर करें और 30% तक बचाएं",
    whatsappInquiry: "व्हाट्सएप व्यावसायिक पूछताछ",
    whyChooseUs: "बी2बी कड़ाही स्पाइसफ्लो क्यों चुनती है",
    ourCategories: "व्यावसायिक उत्पाद श्रेणियां",
    testimonials: "हमारे भागीदारों के विचार",
    certifications: "सख्त खाद्य सुरक्षा प्रमाणपत्र",
    contactUs: "औद्योगिक बिक्री टीम से संपर्क करें",
    buyerRegister: "बी2बी थोक पंजीकरण फॉर्म",
    approvedStatus: "सत्यापन व्यवस्थापक अनुमोदन",
    dashboardTitle: "पार्टनर थोक पोर्टल",
    reorderBtn: "त्वरित पुन: आदेश",
    walletBalance: "वितरक वॉलेट",
    creditLimit: "क्रेडिट लाइन सीमा",
    pendingInvoices: "लंबित वाणिज्यिक चालान",
    deliveryStatus: "लाइव डिलिवरी ट्रैकिंग स्थिति",
    aiSmartOrdering: "स्पाइसफ्लो एआई स्मार्ट स्टॉक नियंत्रक",
    adminTitle: "मसाला प्लांट आपूर्ति डेस्क (एडमिन)",
    liveTracker: "सप्लाई चेन लाइव ट्रैकर स्थिति",
    gstBilling: "स्वचालित जीएसटी वाणिज्यिक चालान",
    paySecure: "सुरक्षित रेजरपे कॉर्पोरेट चेकआउट",
    loyaltyPoints: "वफादारी क्लब पॉइंट",
    languageLabel: "भाषा बदलें",
    moqWarning: "न्यूनतम ऑर्डर मात्रा (MOQ) है",
    calculateSavings: "थोक मूल्य बचत कैलकुलेटर",
    addCart: "थोक कार्ट में जोड़ें",
    saveCart: "सक्रिय कार्ट सहेजें",
    checkoutBtn: "थोक भुगतान की ओर बढ़ें",
    approvedMsg: "आपका स्वागत है! आपकी जीएसटी और व्यवसाय इकाई सत्यापित हैं। त्वरित वितरण सक्रिय है।",
    pendingApproveMsg: "आपका आवेदन FSSAI और GST समीक्षा के अधीन है। अनुमोदन में आमतौर पर 30 मिनट लगते हैं।",
    adminApproveBtn: "सत्यापित और अनुमोदित करें",
    adminActiveUsers: "सत्यापित थोक व्यापारी समूह",
    adminLowStock: "संयंत्र कच्चे माल की चेतावनी",
    customerActivity: "ग्राहक वास्तविक समय गतिविधि",
    futureFeatures: "सट्टा एआई मांग और आवाज आदेश हब",
    fssaiLicense: "FSSAI लाइसेंस: #10023041049285",
    recipeHeading: "स्पाइसफ्लो मुख्य शेफ गुप्त व्यंजन और ब्लॉग"
  },
  pa: {
    brand: "ਸਪਾਈਸਫਲੋ",
    tagline: "ਕਮਰਸ਼ੀਅਲ ਕਿਚਨਾਂ ਅਤੇ ਥੋਕ ਡਿਸਟਰੀਬਿਊਟਰਾਂ ਲਈ ਅਤਿ-ਪ੍ਰੀਮੀਅਮ ਪਿਆਜ਼ ਮਸਾਲਾ ਬੇਸ",
    orderBulk: "ਥੋਕ ਵਿੱਚ ਆਰਡਰ ਕਰੋ ਤੇ 30% ਤੱਕ ਬਚਾਓ",
    whatsappInquiry: "ਵਟਸਐਪ ਪੁੱਛਗਿੱਛ",
    whyChooseUs: "ਬੀ2ਬੀ ਰਸੋਈਆਂ ਸਪਾਈਸਫਲੋ ਕਿਉਂ ਚੁਣਦੀਆਂ ਹਨ",
    ourCategories: "ਕਮਰਸ਼ੀਅਲ ਉਤਪਾਦ ਸ਼੍ਰੇਣੀਆਂ",
    testimonials: "ਸਾਡੇ ਭਾਗੀਦਾਰਾਂ ਦੇ ਵਿਚਾਰ",
    certifications: "ਸਖ਼ਤ ਫੂਡ ਸੇਫਟੀ ਸਰਟੀਫਿਕੇਟ",
    contactUs: "ਉਦਯੋਗਿਕ ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    buyerRegister: "ਬੀ2ਬੀ ਥੋਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਫਾਰਮ",
    approvedStatus: "ਪ੍ਰਸ਼ਾਸਕ ਵੈਰੀਫਿਕੇਸ਼ਨ ਪ੍ਰਵਾਨਗੀ",
    dashboardTitle: "ਪਾਰਟਨਰ ਥੋਕ ਪੋਰਟਲ",
    reorderBtn: "ਤੁਰੰਤ ਦੁਬਾਰਾ ਆਰਡਰ",
    walletBalance: "ਡਿਸਟਰੀਬਿਊਟਰ ਵਾਲਿਟ",
    creditLimit: "ਕ੍ਰੈਡਿਟ ਲਾਈਨ ਸੀਮਾ",
    pendingInvoices: "ਲੰਬਿਤ ਵਪਾਰਕ ਚਲਾਨ",
    deliveryStatus: "ਲਾਈਵ ਡਿਲਿਵਰੀ ਟਰੈਕਿੰਗ ਸਥਿਤੀ",
    aiSmartOrdering: "ਸਪਾਈਸਫਲੋ ਏਆਈ ਸਮਾਰਟ ਸਟਾਕ ਕੰਟਰੋਲਰ",
    adminTitle: "ਮਸਾਲਾ ਪਲਾਂਟ ਸਪਲਾਈ ਡੈਸਕ (ਐਡਮਿਨ)",
    liveTracker: "ਸਪਲਾਈ ਚੇਨ ਲਾਈਵ ਟਰੈਕਰ ਸਥਿਤੀ",
    gstBilling: "ਆਟੋਮੈਟਿਕ ਜੀਐਸਟੀ ਵਪਾਰਕ ਚਲਾਨ",
    paySecure: "ਸੁਰੱਖਿਅਤ ਰੇਜ਼ਰਪੇ ਕਾਰਪੋਰੇਟ ਚੈੱਕਆਉਟ",
    loyaltyPoints: "ਵਫ਼ਾਦਾਰੀ ਕਲੱਬ ਪੁਆਇੰਟ",
    languageLabel: "ਭਾਸ਼ਾ ਬਦਲੋ",
    moqWarning: "ਘੱਟੋ-ਘੱਟ ਆਰਡਰ ਮਾਤਰਾ (MOQ) ਹੈ",
    calculateSavings: "ਥੋਕ ਕੀਮਤ ਬਚਤ ਕੈਲਕੁਲੇਟਰ",
    addCart: "ਥੋਕ ਕਾਰਟ ਵਿੱਚ ਜੋੜੋ",
    saveCart: "ਸਰਗਰਮ ਕਾਰਟ ਸੁਰੱਖਿਅਤ ਕਰੋ",
    checkoutBtn: "ਥੋਕ ਭੁਗਤਾਨ ਵੱਲ ਵਧੋ",
    approvedMsg: "ਜੀ ਆਇਆਂ ਨੂੰ! ਤੁਹਾਡੀ ਜੀਐਸਟੀ ਅਤੇ ਕਾਰੋਬਾਰੀ ਇਕਾਈ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਗਈ ਹੈ। ਤੇਜ਼ ਡਿਲਿਵਰੀ ਸਰਗਰਮ ਹੈ।",
    pendingApproveMsg: "ਤੁਹਾਡੀ ਅਰਜ਼ੀ FSSAI ਅਤੇ GST ਸਮੀਖਿਆ ਅਧੀਨ ਹੈ। ਪ੍ਰਵਾਨਗੀ ਵਿੱਚ ਆਮ ਤੌਰ 'ਤੇ 30 ਮਿੰਟ ਲੱਗਦੇ ਹਨ।",
    adminApproveBtn: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਮਨਜ਼ੂਰ ਕਰੋ",
    adminActiveUsers: "ਪ੍ਰਮਾਣਿਤ ਥੋਕ ਵਿਕਰੇਤਾ ਸਮੂਹ",
    adminLowStock: "ਪਲਾਂਟ ਕੱਚੇ ਮਾਲ ਦੀ ਚੇਤਾਵਨੀ",
    customerActivity: "ਗਾਹਕ ਦੀ ਰੀਅਲ-ਟਾਈਮ ਗਤੀਵਿਧੀ",
    futureFeatures: "ਏਆਈ ਮੰਗ ਅਤੇ ਆਵਾਜ਼ ਆਰਡਰ ਹੱਬ",
    fssaiLicense: "FSSAI ਲਾਇਸੈਂਸ: #10023041049285",
    recipeHeading: "ਸਪਾਈਸਫਲੋ ਮੁੱਖ ਸ਼ੈੱਫ ਗੁਪਤ ਪਕਵਾਨ ਅਤੇ ਬਲੌਗ"
  }
};
