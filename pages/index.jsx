import { useState, useEffect, useRef } from "react";

// ─── MOCK DATABASE ───────────────────────────────────────────────────────────
const INITIAL_DB = {
  users: [
    {
      id: "u1", name: "Amina Hassan", bio: "Model & entrepreneur from Nairobi 🌟", country: "Kenya", gender: "female", birthDate: "1995-03-15", age: 29, region: "Nairobi", area: "Westlands",
      phone: "+254712345678", email: "amina@demo.com", password: "demo123",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
      videoUrl: null, isPremium: true, premiumExpiry: "2025-12-31",
      isSeedAccount: false, createdByAdmin: false, isActive: true,
      role: "user", boostedUntil: null, likedBy: ["u2","u3"], joinedAt: "2024-01-15",
      language: "en", plan: "monthly"
    },
    {
      id: "u2", name: "Jean-Pierre Mutamba", bio: "Businessman, Kigali. Looking for serious connections.", country: "Rwanda", gender: "male", birthDate: "1990-07-22", age: 34, region: "Kigali", area: "Gasabo",
      phone: "+250788123456", email: "jean@demo.com", password: "demo123",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      videoUrl: null, isPremium: false, premiumExpiry: null,
      isSeedAccount: false, createdByAdmin: false, isActive: true,
      role: "user", boostedUntil: null, likedBy: ["u1"], joinedAt: "2024-02-20",
      language: "fr", plan: null
    },
    {
      id: "seed1", name: "Fatima Al-Rashid", bio: "Dubai-based model & influencer 💫 Message me!", country: "Tanzania", gender: "female", birthDate: "1998-01-10", age: 26, region: "Zanzibar Mjini", area: "Stone Town",
      phone: "+255754987654", email: "fatima@seed.com", password: "admin123",
      profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
      videoUrl: null, isPremium: true, premiumExpiry: "2099-12-31",
      isSeedAccount: true, createdByAdmin: true, isActive: true,
      role: "user", boostedUntil: "2099-12-31", likedBy: ["u1","u2"],
      whatsapp: "+255754987654", chatLink: "https://wa.me/255754987654",
      joinedAt: "2024-01-01", language: "sw", plan: "yearly"
    },
    {
      id: "seed2", name: "Bella Okonkwo", bio: "Lagos to the world 🌍 Premium connections only.", country: "Uganda", gender: "female", birthDate: "1997-05-30", age: 27, region: "Kampala", area: "Makindye",
      phone: "+256700112233", email: "bella@seed.com", password: "admin123",
      profileImage: "https://randomuser.me/api/portraits/women/55.jpg",
      videoUrl: null, isPremium: true, premiumExpiry: "2099-12-31",
      isSeedAccount: true, createdByAdmin: true, isActive: true,
      role: "user", boostedUntil: null, likedBy: ["u2"],
      whatsapp: "+256700112233", chatLink: "https://wa.me/256700112233",
      joinedAt: "2024-01-01", language: "en", plan: "yearly"
    },
  ],
  admin: { id: "admin", email: "yohanamichael92@gmail.com", password: "Nrf5sz@.", role: "admin", name: "Super Admin" },
  subscriptions: [
    { id: "s1", userId: "u1", planType: "monthly", amount: 9.99, startDate: "2024-11-01", endDate: "2024-12-01", status: "active" }
  ],
  boosts: [],
  likes: [
    { senderId: "u1", receiverId: "seed1", timestamp: "2024-11-20T10:00:00" },
    { senderId: "u2", receiverId: "seed1", timestamp: "2024-11-21T11:00:00" },
    { senderId: "u1", receiverId: "u2", timestamp: "2024-11-22T09:00:00" },
  ],
  notifications: []
};

// ─── PLANS ───────────────────────────────────────────────────────────────────
const PLANS = {
  daily:   { label: "Daily",   price: 0.60,  duration: 1,   currency: "USD" },
  weekly:  { label: "Weekly",  price: 2.99,  duration: 7,   currency: "USD" },
  monthly: { label: "Monthly", price: 7.99,  duration: 30,  currency: "USD", popular: true },
  yearly:  { label: "Yearly",  price: 49.99, duration: 365, currency: "USD" },
};

const COUNTRIES = ["Tanzania","Kenya","Uganda","Rwanda","Ethiopia","Nigeria","Ghana","South Africa","Other"];

// ─── LOCATION DATA ────────────────────────────────────────────────────────────
const LOCATIONS = {
  Tanzania: {
    flag: "🇹🇿",
    regions: {
      "Dar es Salaam": ["Kinondoni","Ilala","Temeke","Ubungo","Kigamboni"],
      "Zanzibar Mjini": ["Bububu","Stone Town","Mwanakwerekwe","Fuoni","Magomeni","Mlandege","Chukwani","Kiembesamaki","Nungwi","Paje"],
      "Arusha": ["Arusha CBD","Arusha Chini","Meru","Arumeru","Ngorongoro","Monduli","Karatu","Longido"],
      "Kilimanjaro": ["Moshi","Hai","Rombo","Same","Mwanga","Siha","Moshi Vijijini"],
      "Mwanza": ["Nyamagana","Ilemela","Magu","Sengerema","Misungwi","Kwimba","Geita"],
      "Dodoma": ["Dodoma CBD","Chamwino","Bahi","Kondoa","Mpwapwa"],
      "Mbeya": ["Mbeya CBD","Rungwe","Ileje","Kyela","Mbarali","Chunya","Momba"],
      "Morogoro": ["Morogoro CBD","Kilosa","Kilombero","Ulanga","Mvomero","Gairo"],
      "Tanga": ["Tanga CBD","Muheza","Korogwe","Lushoto","Handeni","Kilindi","Pangani"],
      "Iringa": ["Iringa CBD","Kilolo","Mufindi","Mufindi"],
      "Kagera": ["Bukoba","Muleba","Karagwe","Ngara","Biharamulo","Misenyi","Kyerwa"],
      "Mara": ["Musoma","Serengeti","Tarime","Rorya","Butiama","Bunda"],
      "Shinyanga": ["Shinyanga CBD","Kishapu","Kahama","Shinyanga Vijijini"],
      "Singida": ["Singida CBD","Ikungi","Iramba","Manyoni","Mkalama"],
      "Tabora": ["Tabora CBD","Nzega","Igunga","Urambo","Sikonge","Kaliua"],
      "Ruvuma": ["Songea","Tunduru","Namtumbo","Mbinga","Nyasa"],
      "Lindi": ["Lindi CBD","Kilwa","Liwale","Nachingwea","Ruangwa"],
      "Mtwara": ["Mtwara CBD","Masasi","Newala","Tandahimba","Nanyumbu"],
      "Pwani": ["Kibaha","Bagamoyo","Mafia","Mkuranga","Rufiji"],
      "Rukwa": ["Sumbawanga","Nkasi","Kalambo"],
      "Kigoma": ["Kigoma CBD","Kasulu","Kibondo","Kakonko","Buhigwe","Uvinza"],
      "Katavi": ["Mpanda","Mlele","Nsimbo"],
      "Njombe": ["Njombe CBD","Ludewa","Makambako","Makete","Wanging'ombe"],
      "Simiyu": ["Bariadi","Maswa","Meatu","Itilima","Busega"],
      "Geita": ["Geita CBD","Chato","Nyang'hwale","Bukombe","Mbogwe"],
    }
  },
  Kenya: {
    flag: "🇰🇪",
    regions: {
      "Nairobi": ["Westlands","Embakasi","Langata","Kasarani","Dagoretti","Makadara","Kamukunji","Starehe","Mathare","Roysambu","Ruaraka","Njiru","Kibra","Kamkunji"],
      "Mombasa": ["Mvita","Changamwe","Jomvu","Kisauni","Nyali","Likoni"],
      "Kisumu": ["Kisumu East","Kisumu West","Kisumu Central","Seme","Nyando","Muhoroni","Nyakach"],
      "Nakuru": ["Nakuru Town East","Nakuru Town West","Naivasha","Gilgil","Molo","Njoro","Kuresoi"],
      "Eldoret / Uasin Gishu": ["Turbo","Ainabkoi","Kapseret","Kesses","Moiben","Soy"],
      "Kiambu": ["Thika","Ruiru","Kikuyu","Limuru","Kiambu Town","Gatundu","Kabete"],
      "Machakos": ["Machakos Town","Athi River","Kangundo","Kathiani","Mavoko","Mwala","Yatta"],
      "Kajiado": ["Kajiado Central","Ngong","Ongata Rongai","Kitengela","Loitoktok"],
      "Kilifi": ["Kilifi North","Kilifi South","Malindi","Ganze","Kaloleni","Rabai","Magarini"],
      "Kwale": ["Msambweni","Lungalunga","Matuga","Kinango"],
      "Garissa": ["Garissa Township","Balambala","Lagdera","Dadaab","Fafi","Ijara"],
      "Kakamega": ["Kakamega Central","Shinyalu","Mumias","Likuyani","Malava","Lurambi"],
      "Meru": ["Imenti North","Imenti South","Buuri","Tigania East","Tigania West","Igembe"],
      "Nyeri": ["Nyeri Town","Kieni","Mathira","Tetu","Mukurweini","Othaya"],
      "Kisii": ["Kisii Central","Bobasi","Bomachoge","Kitutu Chache","South Mugirango"],
    }
  },
  Uganda: {
    flag: "🇺🇬",
    regions: {
      "Kampala": ["Kampala Central","Kawempe","Makindye","Nakawa","Rubaga"],
      "Wakiso": ["Entebbe","Nansana","Kira","Makindye-Ssabagabo","Bweyogerere"],
      "Gulu": ["Gulu City","Omoro","Nwoya","Amuru"],
      "Mbarara": ["Mbarara City","Rwampara","Isingiro","Kiruhura","Ibanda"],
      "Jinja": ["Jinja City","Buikwe","Mayuge","Iganga","Kamuli"],
      "Mbale": ["Mbale City","Manafwa","Bududa","Sironko","Bulambuli"],
      "Masaka": ["Masaka City","Bukomansimbi","Lwengo","Kalungu","Rakai"],
      "Fort Portal": ["Kabarole","Kasese","Bundibugyo","Bunyangabu","Ntoroko"],
      "Arua": ["Arua City","Nebbi","Zombo","Maracha","Terego"],
      "Lira": ["Lira City","Alebtong","Amolatar","Dokolo","Kole","Otuke"],
      "Soroti": ["Soroti City","Serere","Kaberamaido","Kalaki","Katakwi"],
      "Kabale": ["Kabale Municipality","Rubanda","Rukiga","Kisoro"],
    }
  },
  Rwanda: { flag: "🇷🇼", regions: { "Kigali": ["Nyarugenge","Gasabo","Kicukiro"], "Northern": ["Musanze","Burera","Gicumbi","Gakenke","Rulindo"], "Southern": ["Huye","Nyanza","Gisagara","Kamonyi","Muhanga","Nyaruguru","Nyamagabe","Ruhango"], "Eastern": ["Rwamagana","Bugesera","Ngoma","Nyagatare","Kayonza","Gatsibo","Kirehe"], "Western": ["Rubavu","Karongi","Nyamasheke","Rusizi","Rutsiro","Ngororero","Nyabihu"] } },
  Ethiopia: { flag: "🇪🇹", regions: { "Addis Ababa": ["Bole","Kirkos","Kolfe","Lideta","Nifas Silk","Yeka","Akaky Kaliti"], "Oromia": ["Adama","Jimma","Dire Dawa","Bishoftu","Shashamane"], "Amhara": ["Bahir Dar","Gondar","Dessie","Debre Birhan"] } },
  Nigeria: { flag: "🇳🇬", regions: { "Lagos": ["Lagos Island","Lagos Mainland","Ikeja","Eti-Osa","Alimosho","Kosofe","Mushin"], "Abuja FCT": ["Abuja Municipal","Bwari","Gwagwalada","Kuje","Kwali","Abaji"], "Kano": ["Kano Municipal","Fagge","Dala","Nassarawa","Tarauni"], "Rivers": ["Port Harcourt","Obio-Akpor","Ikwerre","Etche","Oyigbo"] } },
  Ghana: { flag: "🇬🇭", regions: { "Greater Accra": ["Accra","Tema","Ga East","Ga West","La Dade-Kotopon","Adentan","Ashaiman"], "Ashanti": ["Kumasi","Oforikrom","Asokwa","Kwabre East","Bosomtwe"], "Western": ["Sekondi-Takoradi","Shama","Tarkwa-Nsuaem"] } },
  "South Africa": { flag: "🇿🇦", regions: { "Gauteng": ["Johannesburg","Pretoria","Ekurhuleni","Tshwane","Emfuleni"], "Western Cape": ["Cape Town","Stellenbosch","George","Knysna"], "KwaZulu-Natal": ["Durban","Pietermaritzburg","Richards Bay","Newcastle"] } },
  Other: { flag: "🌍", regions: { "Other": ["Other"] } }
};

// ─── PESAPAL CONFIG (LIVE) ────────────────────────────────────────────────────
// ⚠️ MUHIMU: Badilisha values hizi kwenye GitHub yako mwenyewe - USIZIWEKE HAPA
// Nenda GitHub → wauza-utamutz → pages/index.jsx → tafuta PESAPAL_CONSUMER_KEY
const PESAPAL_CONFIG = {
   CONSUMER_KEY: "bGur9I0CXbkqqjKMblbl+rIUGCQqG+Zr",
  CONSUMER_SECRET: "FzdDeX1ykudIp9DvQunuktK52+Y=",
  BASE_URL: "https://pay.pesapal.com/v3", // Live URL
  CALLBACK_URL: "https://wauza-utamutz-app.vercel.app/payment-callback",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "Waauza Utamutz", tagline: "Discove and connect with Beutifull comanoins near you",
    login: "Sign In", register: "Create Account", email: "Email", password: "Password",
    name: "Full Name", bio: "About Me", country: "Country", phone: "Phone Number",
    upload: "Upload Photo", browse: "Browse Profiles", premium: "Go Premium",
    like: "Like", liked: "Liked ✓", seeLikes: "See Who Liked You",
    unlockPhone: "Unlock Phone", boostProfile: "Boost Profile",
    adminPanel: "Admin Panel", logout: "Logout", subscribe: "Subscribe Now",
    seedAccounts: "Seed Accounts", allUsers: "All Users", analytics: "Analytics",
    activate: "Activate", deactivate: "Deactivate", delete: "Delete",
    createSeed: "Create Seed Account", chatWith: "Chat With",
    premiumFeatures: "Premium Features", free: "Free", plans: "Choose Plan",
    back: "Back", save: "Save", cancel: "Cancel", profile: "Profile",
    notifications: "Notifications", search: "Search", settings: "Settings",
    boostNow: "Boost Now (24h - $2.99)", boosted: "⚡ Boosted",
    welcomeBack: "Welcome back", joinNow: "Join Now — It's Free",
    noAccount: "Don't have an account?", haveAccount: "Already have an account?",
    phoneHidden: "🔒 Premium only", viewPhone: "View Phone",
    featuredBadge: "⭐ Featured", seedBadge: "💎 Verified",
    darkMode: "Dark Mode", lightMode: "Light Mode",
    paymentProcessing: "Processing payment...", paymentSuccess: "Payment Successful! 🎉",
    premiumUnlocked: "Premium Unlocked!", selectPayment: "Select Payment Method",
    mobileMoney: "Mobile Money", card: "Credit/Debit Card",
    forgotPassword: "Forgot Password?", resetPassword: "Reset Password",
    otp: "Enter OTP", sendOtp: "Send OTP", verifyOtp: "Verify OTP",
    profileUpdated: "Profile updated!", uploading: "Uploading...",
    language: "Language", english: "English", swahili: "Swahili", french: "French",
  },
  sw: {
    appName: "Waauza Utamutz", tagline: "Gundua na uungane na mrembo aliyekaribu nawe",
    login: "Ingia", register: "Fungua Akaunti", email: "Barua pepe", password: "Neno la siri",
    name: "Jina Kamili", bio: "Kuhusu Mimi", country: "Nchi", phone: "Nambari ya Simu",
    upload: "Pakia Picha", browse: "Tazama Wasifu", premium: "Kuwa Premium",
    like: "Penda", liked: "Umependa ✓", seeLikes: "Angalia Waliokupenda",
    unlockPhone: "Fungua Simu", boostProfile: "Ongeza Wasifu",
    adminPanel: "Paneli ya Admin", logout: "Toka", subscribe: "Jisajili Sasa",
    seedAccounts: "Akaunti za Mbegu", allUsers: "Watumiaji Wote", analytics: "Takwimu",
    activate: "Wezesha", deactivate: "Zima", delete: "Futa",
    createSeed: "Unda Akaunti ya Mbegu", chatWith: "Zungumza Naye",
    premiumFeatures: "Vipengele vya Premium", free: "Bure", plans: "Chagua Mpango",
    back: "Rudi", save: "Hifadhi", cancel: "Ghairi", profile: "Wasifu",
    notifications: "Arifa", search: "Tafuta", settings: "Mipangilio",
    boostNow: "Ongeza Sasa (Masaa 24 - $2.99)", boosted: "⚡ Imeongezwa",
    welcomeBack: "Karibu tena", joinNow: "Jiunge Sasa — Bure",
    noAccount: "Huna akaunti?", haveAccount: "Una akaunti tayari?",
    phoneHidden: "🔒 Premium pekee", viewPhone: "Angalia Simu",
    featuredBadge: "⭐ Iliyoangaziwa", seedBadge: "💎 Imethibitishwa",
    darkMode: "Giza", lightMode: "Mwanga",
    paymentProcessing: "Inafanya malipo...", paymentSuccess: "Malipo Yamefanikiwa! 🎉",
    premiumUnlocked: "Premium Imefunguliwa!", selectPayment: "Chagua Njia ya Malipo",
    mobileMoney: "Pesa ya Simu", card: "Kadi ya Benki",
    forgotPassword: "Umesahau Nywila?", resetPassword: "Weka Upya Nywila",
    otp: "Ingiza OTP", sendOtp: "Tuma OTP", verifyOtp: "Thibitisha OTP",
    profileUpdated: "Wasifu umesasishwa!", uploading: "Inapakia...",
    language: "Lugha", english: "Kiingereza", swahili: "Kiswahili", french: "Kifaransa",
  },
  fr: {
    appName: "Waauza Utamutz", tagline: "Connexions Premium en Afrique de l'Est",
    login: "Connexion", register: "Créer un compte", email: "E-mail", password: "Mot de passe",
    name: "Nom complet", bio: "À propos de moi", country: "Pays", phone: "Numéro de téléphone",
    upload: "Télécharger photo", browse: "Parcourir profils", premium: "Devenir Premium",
    like: "Aimer", liked: "Aimé ✓", seeLikes: "Voir qui vous aime",
    unlockPhone: "Débloquer téléphone", boostProfile: "Booster profil",
    adminPanel: "Panneau Admin", logout: "Déconnexion", subscribe: "S'abonner maintenant",
    seedAccounts: "Comptes seeds", allUsers: "Tous les utilisateurs", analytics: "Analytique",
    activate: "Activer", deactivate: "Désactiver", delete: "Supprimer",
    createSeed: "Créer compte seed", chatWith: "Discuter avec",
    premiumFeatures: "Fonctionnalités Premium", free: "Gratuit", plans: "Choisir un plan",
    back: "Retour", save: "Sauvegarder", cancel: "Annuler", profile: "Profil",
    notifications: "Notifications", search: "Rechercher", settings: "Paramètres",
    boostNow: "Booster (24h - $2.99)", boosted: "⚡ Boosté",
    welcomeBack: "Bon retour", joinNow: "Rejoindre — Gratuit",
    noAccount: "Pas de compte?", haveAccount: "Déjà un compte?",
    phoneHidden: "🔒 Premium seulement", viewPhone: "Voir téléphone",
    featuredBadge: "⭐ En vedette", seedBadge: "💎 Vérifié",
    darkMode: "Mode sombre", lightMode: "Mode clair",
    paymentProcessing: "Traitement...", paymentSuccess: "Paiement réussi! 🎉",
    premiumUnlocked: "Premium débloqué!", selectPayment: "Sélectionner paiement",
    mobileMoney: "Mobile Money", card: "Carte bancaire",
    forgotPassword: "Mot de passe oublié?", resetPassword: "Réinitialiser",
    otp: "Entrer OTP", sendOtp: "Envoyer OTP", verifyOtp: "Vérifier OTP",
    profileUpdated: "Profil mis à jour!", uploading: "Téléchargement...",
    language: "Langue", english: "Anglais", swahili: "Swahili", french: "Français",
  }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#0a0a0f;--bg2:#12121a;--bg3:#1a1a28;--surface:#1e1e30;--surface2:#252538;
      --border:#2a2a42;--accent:#c9a84c;--accent2:#e8c96a;--accent3:#f5e09a;
      --text:#f0eee8;--text2:#b8b5aa;--text3:#7a776e;
      --rose:#e85d75;--teal:#2dd4bf;--purple:#a855f7;
      --radius:14px;--shadow:0 8px 32px rgba(0,0,0,.5);
    }
    .light{
      --bg:#f5f0e8;--bg2:#ede7d9;--bg3:#e4dccc;--surface:#fff;--surface2:#f9f5ed;
      --border:#d9d0bc;--text:#1a1614;--text2:#4a4540;--text3:#8a8078;
    }
    body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background .3s,color .3s}
    h1,h2,h3,.serif{font-family:'Playfair Display',serif}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--bg2)} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:var(--radius);border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;transition:all .2s;letter-spacing:.3px}
    .btn-gold{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#1a1200;font-weight:600}
    .btn-gold:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(201,168,76,.4)}
    .btn-outline{background:transparent;border:1px solid var(--border);color:var(--text2)}
    .btn-outline:hover{border-color:var(--accent);color:var(--accent)}
    .btn-ghost{background:transparent;color:var(--text2);padding:8px 12px}
    .btn-ghost:hover{color:var(--text);background:var(--surface)}
    .btn-danger{background:#e85d7520;color:var(--rose);border:1px solid #e85d7540}
    .btn-danger:hover{background:var(--rose);color:#fff}
    .btn-sm{padding:6px 14px;font-size:13px}
    .btn-full{width:100%;justify-content:center}
    .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .2s}
    .card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:var(--shadow)}
    .input{width:100%;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;transition:border-color .2s;outline:none}
    .input:focus{border-color:var(--accent)}
    .input::placeholder{color:var(--text3)}
    .select{width:100%;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;outline:none;cursor:pointer}
    .select:focus{border-color:var(--accent)}
    .label{font-size:12px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.8px}
    .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px}
    .badge-gold{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#1a1200}
    .badge-teal{background:#2dd4bf20;color:var(--teal);border:1px solid #2dd4bf30}
    .badge-rose{background:#e85d7520;color:var(--rose);border:1px solid #e85d7540}
    .badge-purple{background:#a855f720;color:var(--purple);border:1px solid #a855f730}
    .toast{position:fixed;top:20px;right:20px;padding:14px 20px;border-radius:var(--radius);font-size:14px;font-weight:500;z-index:9999;animation:slideIn .3s ease;box-shadow:var(--shadow);max-width:300px}
    .toast-success{background:#10b98120;border:1px solid #10b98150;color:#10b981}
    .toast-error{background:#e85d7520;border:1px solid #e85d7550;color:var(--rose)}
    .toast-info{background:var(--accent)20;border:1px solid var(--accent)50;color:var(--accent2)}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal{background:var(--bg2);border:1px solid var(--border);border-radius:20px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;padding:32px;animation:fadeUp .3s ease}
    @keyframes fadeUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:var(--bg)dd;backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between}
    .bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:100;background:var(--bg);border-top:1px solid var(--border);display:flex;justify-content:space-around;padding:8px 0 calc(8px + env(safe-area-inset-bottom))}
    .bottom-nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 12px;cursor:pointer;color:var(--text3);font-size:10px;transition:color .2s;border:none;background:none;font-family:'DM Sans',sans-serif}
    .bottom-nav-item.active{color:var(--accent)}
    .bottom-nav-item svg{width:20px;height:20px}
    .hero-gradient{background:radial-gradient(ellipse at 20% 50%,rgba(201,168,76,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 50%,rgba(168,85,247,.08) 0%,transparent 60%)}
    .gold-text{background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .profile-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
    @media(min-width:640px){.profile-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}}
    .profile-card{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:16px;cursor:pointer}
    .profile-card img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
    .profile-card:hover img{transform:scale(1.05)}
    .profile-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 50%);display:flex;flex-direction:column;justify-content:flex-end;padding:16px}
    .profile-card .badges{position:absolute;top:10px;left:10px;display:flex;flex-wrap:wrap;gap:4px}
    .like-btn{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all .2s;backdrop-filter:blur(4px)}
    .like-btn:hover{background:rgba(232,93,117,.3);transform:scale(1.1)}
    .like-btn.liked{background:rgba(232,93,117,.5)}
    .premium-blur{filter:blur(8px);user-select:none;pointer-events:none}
    .avatar{border-radius:50%;object-fit:cover;border:2px solid var(--border)}
    .divider{height:1px;background:var(--border);margin:16px 0}
    .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center}
    .tab{display:inline-flex;gap:4px;background:var(--bg2);padding:4px;border-radius:10px}
    .tab-btn{padding:8px 16px;border-radius:8px;border:none;background:transparent;color:var(--text2);cursor:pointer;font-size:13px;font-family:'DM Sans',sans-serif;transition:all .2s}
    .tab-btn.active{background:var(--surface);color:var(--text)}
    .notification-dot{width:8px;height:8px;background:var(--rose);border-radius:50%;position:absolute;top:2px;right:2px}
    .fade-in{animation:fadeIn .3s ease} @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .shimmer{background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    .scrollable{overflow-y:auto;-webkit-overflow-scrolling:touch}
    @media(max-width:480px){.modal{padding:20px}.btn{padding:9px 16px}}
  `;
  document.head.appendChild(style);
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Home: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  Heart: ({filled}) => <svg viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  Whatsapp: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>,
  Globe: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>,
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { injectStyles(); }, []);

  const [db, setDb] = useState(INITIAL_DB);
  const [currentUser, setCurrentUser] = useState(null);
  const [lang, setLang] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState("landing"); // landing|login|register|browse|profile|premium|admin|settings|myprofile
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const t = T[lang];

  useEffect(() => {
    document.documentElement.className = darkMode ? "" : "light";
  }, [darkMode]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateDb = (updates) => setDb(prev => ({ ...prev, ...updates }));

  const isUserPremium = (user) => {
    if (!user || !user.isPremium) return false;
    if (!user.premiumExpiry) return false;
    return new Date(user.premiumExpiry) > new Date();
  };

  const isBoosted = (user) => {
    if (!user?.boostedUntil) return false;
    return new Date(user.boostedUntil) > new Date();
  };

  const handleLike = (targetId) => {
    if (!currentUser) { setPage("login"); return; }
    const existingLike = db.likes.find(l => l.senderId === currentUser.id && l.receiverId === targetId);
    if (existingLike) {
      updateDb({ likes: db.likes.filter(l => !(l.senderId === currentUser.id && l.receiverId === targetId)) });
    } else {
      updateDb({ likes: [...db.likes, { senderId: currentUser.id, receiverId: targetId, timestamp: new Date().toISOString() }] });
      showToast("Liked! 💛", "success");
    }
    // Update receiver's likedBy
    const updatedUsers = db.users.map(u => {
      if (u.id === targetId) {
        const likedBy = existingLike ? u.likedBy.filter(id => id !== currentUser.id) : [...(u.likedBy||[]), currentUser.id];
        return { ...u, likedBy };
      }
      return u;
    });
    updateDb({ users: updatedUsers });
    if (currentUser) {
      const updatedCurrent = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrent) setCurrentUser(updatedCurrent);
    }
  };

  const hasLiked = (targetId) => db.likes.some(l => l.senderId === currentUser?.id && l.receiverId === targetId);

  const handleSubscribe = (plan) => {
    if (!currentUser) return;
    const planData = PLANS[plan];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planData.duration);
    const sub = { id: `s${Date.now()}`, userId: currentUser.id, planType: plan, amount: planData.price, startDate: new Date().toISOString(), endDate: endDate.toISOString(), status: "active" };
    const updatedUsers = db.users.map(u => u.id === currentUser.id ? { ...u, isPremium: true, premiumExpiry: endDate.toISOString(), plan } : u);
    const updated = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updated);
    updateDb({ users: updatedUsers, subscriptions: [...db.subscriptions, sub] });
    setModal(null);
    showToast(t.premiumUnlocked + " 🎉", "success");
    setPage("browse");
  };

  const handleBoost = () => {
    if (!currentUser) return;
    if (!isUserPremium(currentUser)) { setModal("premium"); return; }
    const boostEnd = new Date();
    boostEnd.setHours(boostEnd.getHours() + 24);
    const updatedUsers = db.users.map(u => u.id === currentUser.id ? { ...u, boostedUntil: boostEnd.toISOString() } : u);
    const updated = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updated);
    updateDb({ users: updatedUsers, boosts: [...db.boosts, { userId: currentUser.id, startTime: new Date().toISOString(), endTime: boostEnd.toISOString() }] });
    showToast("Profile boosted for 24 hours! ⚡", "success");
  };

  const handleLogin = (email, password) => {
    if (email === db.admin.email && password === db.admin.password) {
      setCurrentUser({ ...db.admin, role: "admin" });
      setPage("admin");
      showToast("Welcome Admin!", "success");
      return;
    }
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      if (!user.isActive) { showToast("Account deactivated. Contact support.", "error"); return; }
      setCurrentUser(user);
      setPage("browse");
      showToast(`${t.welcomeBack}, ${user.name.split(" ")[0]}! 👋`, "success");
    } else {
      showToast("Invalid email or password", "error");
    }
  };

  const handleRegister = (data) => {
    if (db.users.find(u => u.email === data.email)) { showToast("Email already registered", "error"); return; }
    if (!data.gender) { showToast("Chagua jinsia yako", "error"); return; }
    if (!data.birthDate) { showToast("Weka tarehe ya kuzaliwa", "error"); return; }
    const birthYear = new Date(data.birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    if (age < 18) { showToast("Lazima uwe na umri wa miaka 18+ kujiandikisha", "error"); return; }
    const newUser = { id: `u${Date.now()}`, ...data, age, isPremium: false, premiumExpiry: null, isSeedAccount: false, createdByAdmin: false, isActive: true, role: "user", boostedUntil: null, likedBy: [], joinedAt: new Date().toISOString(), plan: null };
    updateDb({ users: [...db.users, newUser] });
    setCurrentUser(newUser);
    setPage("browse");
    showToast("Account created! Welcome 🎉", "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("landing");
    showToast("Logged out successfully", "info");
  };

  const browseUsers = () => {
    let users = db.users.filter(u => u.isActive && u.id !== currentUser?.id);
    // Boosted users first
    users.sort((a, b) => {
      const aB = isBoosted(a) ? 1 : 0, bB = isBoosted(b) ? 1 : 0;
      return bB - aB;
    });
    return users;
  };

  const props = { db, updateDb, currentUser, setCurrentUser, lang, setLang, darkMode, setDarkMode, page, setPage, t, toast, showToast, modal, setModal, selectedUser, setSelectedUser, handleLike, hasLiked, isUserPremium, isBoosted, handleSubscribe, handleBoost, handleLogin, handleRegister, handleLogout, browseUsers, notifications, setNotifications };

  return (
    <div style={{minHeight:"100vh",paddingBottom:currentUser&&page!=="admin"?"72px":"0"}}>
      {toast && <Toast toast={toast} />}
      {modal === "premium" && <PremiumModal {...props} />}
      {modal === "payment" && <PaymentModal {...props} />}
      {modal === "profile" && selectedUser && <ProfileModal {...props} />}
      {modal === "boost" && <BoostModal {...props} />}
      {modal === "createSeed" && <CreateSeedModal {...props} />}
      {modal === "editProfile" && <EditProfileModal {...props} />}

      {page === "landing" && <LandingPage {...props} />}
      {page === "login" && <LoginPage {...props} />}
      {page === "register" && <RegisterPage {...props} />}
      {page === "browse" && <BrowsePage {...props} />}
      {page === "myprofile" && <MyProfilePage {...props} />}
      {page === "premium" && <PremiumPage {...props} />}
      {page === "admin" && <AdminPage {...props} />}
      {page === "settings" && <SettingsPage {...props} />}
      {page === "likes" && <LikesPage {...props} />}

      {currentUser && currentUser.role !== "admin" && <BottomNav {...props} />}
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return <div className={`toast toast-${toast.type}`}>{toast.msg}</div>;
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ page, setPage, currentUser, db, isUserPremium }) {
  const notifCount = (currentUser?.likedBy?.length || 0);
  return (
    <nav className="bottom-nav">
      {[
        { key: "browse", icon: <Icon.Home />, label: "Browse" },
        { key: "likes", icon: <Icon.Heart filled={false}/>, label: "Likes", badge: !isUserPremium(currentUser) && notifCount > 0 },
        { key: "myprofile", icon: <Icon.User />, label: "Profile" },
        { key: "premium", icon: <Icon.Crown />, label: "Premium" },
        { key: "settings", icon: <Icon.Settings />, label: "Settings" },
      ].map(item => (
        <button key={item.key} className={`bottom-nav-item${page===item.key?" active":""}`} onClick={() => setPage(item.key)}>
          <span style={{position:"relative"}}>{item.icon}{item.badge&&<span className="notification-dot"/>}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ t, setPage, darkMode, setDarkMode, lang, setLang }) {
  return (
    <div style={{minHeight:"100vh"}} className="hero-gradient">
      {/* Nav */}
      <nav className="nav">
        <div className="serif" style={{fontSize:"20px",fontWeight:700}}><span className="gold-text">{t.appName}</span></div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <select className="select" value={lang} onChange={e=>setLang(e.target.value)} style={{width:"auto",padding:"6px 10px",fontSize:"12px"}}>
            <option value="en">🇬🇧 EN</option>
            <option value="sw">🇹🇿 SW</option>
            <option value="fr">🇫🇷 FR</option>
          </select>
          <button className="btn btn-ghost" onClick={()=>setDarkMode(d=>!d)}>{darkMode?<Icon.Sun/>:<Icon.Moon/>}</button>
          <button className="btn btn-outline btn-sm" onClick={()=>setPage("login")}>{t.login}</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{paddingTop:"100px",paddingBottom:"60px",textAlign:"center",padding:"120px 24px 60px"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:"16px"}}>
          <span className="badge badge-gold" style={{fontSize:"12px"}}>🌍 East Africa's #1 Premium Platform</span>
        </div>
        <h1 className="serif" style={{fontSize:"clamp(36px,8vw,80px)",lineHeight:1.1,marginBottom:"20px"}}>
          <span className="gold-text">Connect.</span><br />
          <span style={{color:"var(--text)"}}>Discover.</span><br />
          <span style={{color:"var(--text2)"}}>Belong.</span>
        </h1>
        <p style={{fontSize:"18px",color:"var(--text2)",maxWidth:"480px",margin:"0 auto 40px",lineHeight:1.7}}>{t.tagline}</p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-gold" style={{fontSize:"16px",padding:"14px 32px"}} onClick={()=>setPage("register")}>{t.joinNow}</button>
          <button className="btn btn-outline" style={{padding:"14px 32px"}} onClick={()=>setPage("login")}>{t.login}</button>
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:"32px",justifyContent:"center",marginTop:"60px",flexWrap:"wrap"}}>
          {[["50K+","Active Members"],["6","Countries"],["99%","Secure"],["24/7","Support"]].map(([n,l])=>(
            <div key={n} style={{textAlign:"center"}}>
              <div className="serif" style={{fontSize:"28px",fontWeight:700}} ><span className="gold-text">{n}</span></div>
              <div style={{fontSize:"12px",color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{padding:"40px 24px",maxWidth:"900px",margin:"0 auto"}}>
        <h2 className="serif" style={{textAlign:"center",fontSize:"32px",marginBottom:"32px"}}>Why <span className="gold-text">Premium?</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px"}}>
          {[
            {icon:"💛",title:"See Who Likes You",desc:"Discover who's interested in you instantly"},
            {icon:"📱",title:"Unlock Phone Numbers",desc:"Connect directly with your matches"},
            {icon:"⚡",title:"Boost Your Profile",desc:"Appear first in searches for 24 hours"},
            {icon:"♾️",title:"Unlimited Likes",desc:"Like as many profiles as you want"},
          ].map(f=>(
            <div key={f.title} className="card" style={{padding:"24px"}}>
              <div style={{fontSize:"32px",marginBottom:"12px"}}>{f.icon}</div>
              <h3 style={{fontSize:"16px",marginBottom:"8px"}}>{f.title}</h3>
              <p style={{fontSize:"14px",color:"var(--text2)",lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{textAlign:"center",padding:"40px 24px",color:"var(--text3)",fontSize:"13px",borderTop:"1px solid var(--border)"}}>
        <div className="serif" style={{fontSize:"20px",marginBottom:"8px"}}><span className="gold-text">{t.appName}</span></div>
        <p>© 2024 Waauza Utamutz · Premium Connections · East Africa</p>
        <p style={{marginTop:"8px"}}>Kenya · Tanzania · Uganda · Rwanda · Ethiopia · Nigeria</p>
      </footer>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ t, setPage, handleLogin, lang, setLang, darkMode, setDarkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} className="hero-gradient">
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setPage("landing")} style={{marginBottom:"16px"}}>← Back</button>
          <h1 className="serif gold-text" style={{fontSize:"32px"}}>{t.appName}</h1>
          <p style={{color:"var(--text2)",marginTop:"8px"}}>{forgotMode ? t.resetPassword : t.login}</p>
        </div>

        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"20px",padding:"32px"}}>
          {!forgotMode ? (
            <>
              <div style={{marginBottom:"16px"}}>
                <div className="label">{t.email}</div>
                <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div style={{marginBottom:"24px"}}>
                <div className="label">{t.password}</div>
                <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <button className="btn btn-gold btn-full" onClick={()=>handleLogin(email,password)}>
                {t.login}
              </button>
              <div style={{textAlign:"center",marginTop:"16px"}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>setForgotMode(true)} style={{color:"var(--accent)"}}>
                  {t.forgotPassword}
                </button>
              </div>

              {/* Demo credentials */}
              <div style={{marginTop:"20px",padding:"12px",background:"var(--bg2)",borderRadius:"10px",fontSize:"12px",color:"var(--text3)"}}>
                <strong style={{color:"var(--text2)"}}>Demo Login:</strong>
                <div>User: amina@demo.com / demo123</div>
                <div>Admin: admin@waauza.com / Admin@2024</div>
              </div>
            </>
          ) : (
            <>
              {!otpSent ? (
                <>
                  <div style={{marginBottom:"16px"}}>
                    <div className="label">{t.email}</div>
                    <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
                  </div>
                  <button className="btn btn-gold btn-full" onClick={()=>{setOtpSent(true)}}>{t.sendOtp}</button>
                </>
              ) : (
                <>
                  <div style={{textAlign:"center",padding:"12px",background:"var(--bg2)",borderRadius:"10px",marginBottom:"16px",fontSize:"13px",color:"var(--text2)"}}>
                    OTP sent to {email}. Demo OTP: <strong style={{color:"var(--accent)"}}>123456</strong>
                  </div>
                  <div style={{marginBottom:"16px"}}>
                    <div className="label">{t.otp}</div>
                    <input className="input" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456"/>
                  </div>
                  <button className="btn btn-gold btn-full" onClick={()=>{if(otp==="123456"){setForgotMode(false);setOtpSent(false);} }}>{t.verifyOtp}</button>
                </>
              )}
              <button className="btn btn-ghost btn-sm" onClick={()=>{setForgotMode(false);setOtpSent(false);}} style={{marginTop:"12px",width:"100%"}}>{t.back}</button>
            </>
          )}
        </div>

        <p style={{textAlign:"center",marginTop:"20px",color:"var(--text2)",fontSize:"14px"}}>
          {t.noAccount}{" "}
          <button className="btn btn-ghost btn-sm" onClick={()=>setPage("register")} style={{color:"var(--accent)",padding:"0"}}>{t.register}</button>
        </p>

        <div style={{display:"flex",gap:"8px",justifyContent:"center",marginTop:"16px"}}>
          {["en","sw","fr"].map(l=>(
            <button key={l} className={`btn btn-ghost btn-sm${lang===l?" btn-outline":""}`} onClick={()=>setLang(l)} style={{padding:"4px 10px",fontSize:"11px"}}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ t, setPage, handleRegister, lang }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"", bio:"", country:"Tanzania", region:"", area:"", gender:"", birthDate:"", language: lang });
  const [step, setStep] = useState(1);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const countryData = LOCATIONS[form.country] || LOCATIONS["Other"];
  const regions = Object.keys(countryData.regions);
  const areas = form.region ? (countryData.regions[form.region] || []) : [];

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} className="hero-gradient">
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>step===1?setPage("landing"):setStep(s=>s-1)} style={{marginBottom:"12px"}}>← {t.back}</button>
          <h1 className="serif gold-text" style={{fontSize:"28px"}}>{t.register}</h1>
          <div style={{display:"flex",gap:"4px",justifyContent:"center",marginTop:"12px"}}>
            {[1,2,3].map(s=><div key={s} style={{width:"32px",height:"3px",borderRadius:"2px",background:step>=s?"var(--accent)":"var(--border)",transition:"background .3s"}}/>)}
          </div>
          <div style={{fontSize:"12px",color:"var(--text3)",marginTop:"6px"}}>Hatua {step} ya 3</div>
        </div>

        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"20px",padding:"28px"}}>
          {step === 1 && (
            <>
              <div style={{marginBottom:"14px"}}>
                <div className="label">{t.name}</div>
                <input className="input" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Jina lako kamili"/>
              </div>
              <div style={{marginBottom:"14px"}}>
                <div className="label">{t.email}</div>
                <input className="input" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="wewe@mfano.com"/>
              </div>
              <div style={{marginBottom:"20px"}}>
                <div className="label">{t.password}</div>
                <input className="input" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Herufi 6 au zaidi"/>
              </div>
              <div style={{marginBottom:"14px"}}>
                <div className="label">⚤ Jinsia / Gender</div>
                <select className="select" value={form.gender||""} onChange={e=>set("gender",e.target.value)}>
                  <option value="">-- Chagua Jinsia --</option>
                  <option value="male">👨 Mwanaume</option>
                  <option value="female">👩 Mwanamke</option>
                  <option value="other">🧑 Nyingine</option>
                </select>
              </div>
              <div style={{marginBottom:"20px"}}>
                <div className="label">🎂 Tarehe ya Kuzaliwa</div>
                <input className="input" type="date" value={form.birthDate||""} onChange={e=>set("birthDate",e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().split("T")[0]}
                />
                <div style={{fontSize:"11px",color:"var(--text3)",marginTop:"4px"}}>⚠️ Lazima uwe na umri wa miaka 18+</div>
              </div>
              <button className="btn btn-gold btn-full" onClick={()=>{if(form.name&&form.email&&form.password.length>=6&&form.gender&&form.birthDate)setStep(2);else alert("Jaza sehemu zote — jina, email, nywila, jinsia na tarehe ya kuzaliwa");}}>Endelea →</button>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{marginBottom:"14px"}}>
                <div className="label">🌍 {t.country}</div>
                <select className="select" value={form.country} onChange={e=>{set("country",e.target.value);set("region","");set("area","");}}>
                  {COUNTRIES.map(c=><option key={c} value={c}>{LOCATIONS[c]?.flag||"🌍"} {c}</option>)}
                </select>
              </div>
              <div style={{marginBottom:"14px"}}>
                <div className="label">📍 Mkoa / Region</div>
                <select className="select" value={form.region} onChange={e=>{set("region",e.target.value);set("area","");}}>
                  <option value="">-- Chagua Mkoa --</option>
                  {regions.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {form.region && (
                <div style={{marginBottom:"14px"}}>
                  <div className="label">🏘️ Mtaa / Area</div>
                  <select className="select" value={form.area} onChange={e=>set("area",e.target.value)}>
                    <option value="">-- Chagua Mtaa --</option>
                    {areas.map(a=><option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              )}
              {form.area && (
                <div style={{padding:"10px 14px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",borderRadius:"10px",marginBottom:"14px",fontSize:"13px"}}>
                  📍 <strong style={{color:"var(--accent2)"}}>{form.area}, {form.region}</strong> — {LOCATIONS[form.country]?.flag} {form.country}
                </div>
              )}
              <div style={{marginBottom:"20px"}}>
                <div className="label">{t.phone}</div>
                <input className="input" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+255 700 000000"/>
              </div>
              <button className="btn btn-gold btn-full" onClick={()=>{if(form.country&&form.region)setStep(3);}}>Endelea →</button>
            </>
          )}
          {step === 3 && (
            <>
              <div style={{marginBottom:"14px"}}>
                <div className="label">{t.bio}</div>
                <textarea className="input" value={form.bio} onChange={e=>set("bio",e.target.value)} placeholder="Jielezeee kidogo... 😊" style={{resize:"vertical",minHeight:"80px"}}/>
              </div>
              <div style={{marginBottom:"14px"}}>
                <div className="label">{t.language}</div>
                <select className="select" value={form.language} onChange={e=>set("language",e.target.value)}>
                  <option value="en">🇬🇧 English</option>
                  <option value="sw">🇹🇿 Kiswahili</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
              </div>
              <div style={{padding:"12px",background:"var(--bg2)",borderRadius:"10px",marginBottom:"16px",fontSize:"13px",color:"var(--text2)"}}>
                <div>👤 <strong>{form.name}</strong></div>
                <div>📍 {form.area&&`${form.area}, `}{form.region} — {LOCATIONS[form.country]?.flag} {form.country}</div>
                <div>📧 {form.email}</div>
              </div>
              <button className="btn btn-gold btn-full" style={{padding:"14px",fontSize:"15px"}} onClick={()=>handleRegister({...form,profileImage:`https://randomuser.me/api/portraits/${["men","women"][Math.floor(Math.random()*2)]}/${Math.floor(Math.random()*80)}.jpg`})}>
                {t.joinNow} 🎉
              </button>
            </>
          )}
        </div>

        <p style={{textAlign:"center",marginTop:"20px",color:"var(--text2)",fontSize:"14px"}}>
          {t.haveAccount}{" "}
          <button className="btn btn-ghost btn-sm" onClick={()=>setPage("login")} style={{color:"var(--accent)",padding:"0"}}>{t.login}</button>
        </p>
      </div>
    </div>
  );
}

// ─── BROWSE PAGE ──────────────────────────────────────────────────────────────
function BrowsePage({ t, browseUsers, currentUser, setSelectedUser, setModal, handleLike, hasLiked, isUserPremium, isBoosted, setPage }) {
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("All");
  const users = browseUsers();

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.country.toLowerCase().includes(search.toLowerCase());
    const matchCountry = filterCountry === "All" || u.country === filterCountry;
    return matchSearch && matchCountry;
  });

  return (
    <div style={{paddingTop:"72px"}}>
      {/* Top bar */}
      <div className="nav" style={{padding:"0 16px"}}>
        <span className="serif gold-text" style={{fontSize:"18px",fontWeight:700}}>{t.appName}</span>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {!isUserPremium(currentUser) && (
            <button className="btn btn-gold btn-sm" onClick={()=>setPage("premium")}>
              <Icon.Crown/> {t.premium}
            </button>
          )}
          {isUserPremium(currentUser) && <span className="badge badge-gold"><Icon.Crown/> Premium</span>}
        </div>
      </div>

      <div style={{padding:"16px"}}>
        {/* Search */}
        <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
          <div style={{position:"relative",flex:1}}>
            <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}><Icon.Search/></span>
            <input className="input" style={{paddingLeft:"40px"}} placeholder={t.search+"..."} value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="select" style={{width:"auto",minWidth:"110px"}} value={filterCountry} onChange={e=>setFilterCountry(e.target.value)}>
            <option>All</option>
            {COUNTRIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Premium Banner */}
        {!isUserPremium(currentUser) && (
          <div style={{background:"linear-gradient(135deg,rgba(201,168,76,.15),rgba(168,85,247,.1))",border:"1px solid rgba(201,168,76,.3)",borderRadius:"14px",padding:"16px",marginBottom:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"}}>
            <div>
              <div style={{fontSize:"13px",fontWeight:600,color:"var(--accent2)"}}>🔓 Unlock Premium Features</div>
              <div style={{fontSize:"12px",color:"var(--text3)",marginTop:"2px"}}>See who liked you, unlock phones & more</div>
            </div>
            <button className="btn btn-gold btn-sm" onClick={()=>setPage("premium")}>Upgrade</button>
          </div>
        )}

        {/* Profile Grid */}
        <div className="profile-grid">
          {filtered.map(user => (
            <ProfileCard key={user.id} user={user} currentUser={currentUser} t={t}
              onLike={()=>handleLike(user.id)} liked={hasLiked(user.id)}
              isPremium={isUserPremium(currentUser)} isBoosted={isBoosted(user)}
              onClick={()=>{setSelectedUser(user);setModal("profile")}}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"60px 20px",color:"var(--text3)"}}>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>🔍</div>
            <p>No profiles found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE CARD ─────────────────────────────────────────────────────────────
function ProfileCard({ user, currentUser, t, onLike, liked, isPremium, isBoosted: boosted, onClick }) {
  const isPrem = user.isPremium || user.premiumExpiry;
  return (
    <div className="profile-card" onClick={onClick}>
      <img src={user.profileImage || `https://randomuser.me/api/portraits/men/${user.id.charCodeAt(1)%80}.jpg`} alt={user.name} loading="lazy"/>
      <div className="profile-card-overlay">
        <div className="badges">
          {user.isSeedAccount && <span className="badge badge-teal" style={{fontSize:"10px"}}>{t.seedBadge}</span>}
          {isPrem && !user.isSeedAccount && <span className="badge badge-gold" style={{fontSize:"10px"}}><Icon.Crown/>VIP</span>}
          {boosted && <span className="badge badge-purple" style={{fontSize:"10px"}}>⚡</span>}
        </div>
        <button className={`like-btn${liked?" liked":""}`} onClick={e=>{e.stopPropagation();onLike();}} style={{color:liked?"var(--rose)":"white"}}>
          <Icon.Heart filled={liked}/>
        </button>
        <div style={{fontSize:"14px",fontWeight:600}}>{user.name}</div>
        <div style={{fontSize:"12px",color:"rgba(255,255,255,.8)",marginBottom:"2px"}}>
          {user.gender==="female"?"👩":"👨"} {user.age ? `${user.age} yrs` : ""} {user.gender==="female"?"Female":"Male"}
        </div>
        <div style={{fontSize:"12px",color:"rgba(255,255,255,.7)",display:"flex",gap:"4px",alignItems:"center",flexWrap:"wrap"}}>
          {LOCATIONS[user.country]?.flag||"🌍"} {user.area ? `${user.area}, ` : ""}{user.region || user.country}
          {user.likedBy?.length > 0 && isPremium && <span style={{marginLeft:"auto"}}>💛 {user.likedBy.length}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────
function ProfileModal({ selectedUser: user, currentUser, t, setModal, handleLike, hasLiked, isUserPremium, setPage }) {
  if (!user) return null;
  const isPrem = isUserPremium(currentUser);
  const liked = hasLiked(user.id);

  return (
    <div className="modal-overlay" onClick={()=>setModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:"440px",padding:"0",overflow:"hidden"}}>
        {/* Photo */}
        <div style={{position:"relative",aspectRatio:"4/5"}}>
          <img src={user.profileImage} alt={user.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 40%)"}}/>
          <button className="btn btn-ghost" onClick={()=>setModal(null)} style={{position:"absolute",top:"12px",right:"12px",background:"rgba(0,0,0,.5)",borderRadius:"50%",padding:"8px"}}>
            <Icon.X/>
          </button>
          <div style={{position:"absolute",bottom:"0",left:"0",right:"0",padding:"20px"}}>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"8px"}}>
              {user.isSeedAccount && <span className="badge badge-teal">{t.seedBadge}</span>}
              {user.isPremium && <span className="badge badge-gold"><Icon.Crown/>Premium</span>}
            </div>
            <h2 className="serif" style={{fontSize:"24px"}}>{user.name}</h2>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"6px"}}>
              <span style={{fontSize:"13px",color:"rgba(255,255,255,.75)"}}>{user.gender==="female"?"👩":"👨"} {user.age ? `${user.age} yrs` : ""}</span>
              <span style={{fontSize:"13px",color:"rgba(255,255,255,.75)"}}>·</span>
              <span style={{fontSize:"13px",color:"rgba(255,255,255,.75)"}}>{LOCATIONS[user.country]?.flag||"🌍"} {user.area ? `${user.area}, ` : ""}{user.region ? `${user.region}, ` : ""}{user.country}</span>
            </div>
          </div>
        </div>

        <div style={{padding:"20px"}}>
          {user.bio && <p style={{fontSize:"14px",color:"var(--text2)",lineHeight:1.7,marginBottom:"16px"}}>{user.bio}</p>}

          {/* Phone */}
          <div style={{background:"var(--bg2)",borderRadius:"12px",padding:"14px",marginBottom:"16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{color:"var(--accent)"}}><Icon.Phone/></span>
              <span style={{fontSize:"14px"}}>
                {isPrem ? user.phone || "+254 ••• ••••••" : <span style={{color:"var(--text3)"}}>{t.phoneHidden}</span>}
              </span>
            </div>
            {!isPrem && (
              <button className="btn btn-gold btn-sm" onClick={()=>{setModal("premium");}}>
                <Icon.Lock/> {t.unlockPhone}
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{display:"flex",gap:"10px"}}>
            <button className={`btn${liked?" btn-outline":"btn-gold"} btn-full`} onClick={()=>handleLike(user.id)}>
              <Icon.Heart filled={liked}/> {liked ? t.liked : t.like}
            </button>
            {user.isSeedAccount && user.chatLink && (
              <a href={user.chatLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{textDecoration:"none",flexShrink:0,color:"var(--teal)",borderColor:"var(--teal)"}}>
                <Icon.Whatsapp/> {t.chatWith}
              </a>
            )}
          </div>

          {/* Liked by count */}
          {user.likedBy?.length > 0 && (
            <div style={{textAlign:"center",marginTop:"12px",fontSize:"13px",color:"var(--text3)"}}>
              💛 {isPrem ? `${user.likedBy.length} people liked this profile` : `${user.likedBy.length}+ likes — upgrade to see`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PREMIUM PAGE ─────────────────────────────────────────────────────────────
function PremiumPage({ t, currentUser, isUserPremium, setModal, setPage }) {
  const isPrem = isUserPremium(currentUser);
  return (
    <div style={{paddingTop:"72px"}}>
      <div className="nav">
        <button className="btn btn-ghost" onClick={()=>setPage("browse")}>← {t.back}</button>
        <span className="serif gold-text" style={{fontSize:"16px"}}>{t.premiumFeatures}</span>
        <div/>
      </div>
      <div style={{padding:"20px",maxWidth:"600px",margin:"0 auto"}}>
        {isPrem ? (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:"64px",marginBottom:"16px"}}>👑</div>
            <h2 className="serif" style={{fontSize:"28px",marginBottom:"8px"}}>You're Premium!</h2>
            <p style={{color:"var(--text2)",marginBottom:"8px"}}>Expires: {new Date(currentUser.premiumExpiry).toLocaleDateString()}</p>
            <span className="badge badge-gold">Plan: {currentUser.plan?.toUpperCase()}</span>
            <div className="divider"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"20px"}}>
              {["✅ See who liked you","✅ Unlock phone numbers","✅ Unlimited likes","✅ Boost profile","✅ Priority listing","✅ Featured badge"].map(f=>(
                <div key={f} style={{padding:"12px",background:"var(--surface)",borderRadius:"10px",fontSize:"13px",textAlign:"left"}}>{f}</div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{textAlign:"center",marginBottom:"32px",padding:"20px 0"}}>
              <div style={{fontSize:"48px",marginBottom:"12px"}}>👑</div>
              <h2 className="serif" style={{fontSize:"32px",marginBottom:"8px"}}>
                Go <span className="gold-text">Premium</span>
              </h2>
              <p style={{color:"var(--text2)"}}>Unlock all features & find your perfect match</p>
            </div>

            {/* Features list */}
            <div style={{marginBottom:"28px"}}>
              {[
                {icon:"💛",t:"See Who Liked You",d:"Never miss a connection"},
                {icon:"📱",t:"Unlock Phone Numbers",d:"Chat directly, no limits"},
                {icon:"♾️",t:"Unlimited Likes",d:"Like as many profiles as you want"},
                {icon:"⚡",t:"Boost Profile",d:"Appear first in search for 24h"},
                {icon:"⭐",t:"Featured Badge",d:"Stand out from the crowd"},
              ].map(f=>(
                <div key={f.t} style={{display:"flex",gap:"14px",alignItems:"center",padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{fontSize:"24px",flexShrink:0}}>{f.icon}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:"15px"}}>{f.t}</div>
                    <div style={{fontSize:"13px",color:"var(--text3)"}}>{f.d}</div>
                  </div>
                  <span style={{marginLeft:"auto",color:"var(--teal)"}}><Icon.Check/></span>
                </div>
              ))}
            </div>

            <PlanSelector t={t} setModal={setModal}/>
          </>
        )}
      </div>
    </div>
  );
}

function PlanSelector({ t, setModal }) {
  const [selected, setSelected] = useState("monthly");
  return (
    <>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"20px"}}>
        {Object.entries(PLANS).map(([key, plan]) => (
          <div key={key} onClick={()=>setSelected(key)} style={{border:`2px solid ${selected===key?"var(--accent)":"var(--border)"}`,borderRadius:"14px",padding:"16px",cursor:"pointer",transition:"all .2s",position:"relative",background:selected===key?"rgba(201,168,76,.05)":"transparent"}}>
            {plan.popular && <span style={{position:"absolute",top:"-10px",left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,var(--accent),var(--accent2))",color:"#1a1200",fontSize:"10px",fontWeight:700,padding:"3px 10px",borderRadius:"20px",whiteSpace:"nowrap"}}>POPULAR</span>}
            <div style={{fontWeight:600,fontSize:"14px",marginBottom:"4px"}}>{plan.label}</div>
            <div className="serif" style={{fontSize:"22px",fontWeight:700}}><span className="gold-text">${plan.price}</span></div>
            <div style={{fontSize:"11px",color:"var(--text3)"}}>/{plan.duration===1?"day":plan.duration===7?"week":plan.duration===30?"month":"year"}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-gold btn-full" style={{fontSize:"16px",padding:"16px"}} onClick={()=>setModal({type:"payment",plan:selected})}>
        <Icon.Crown/> {t.subscribe} — ${PLANS[selected].price}
      </button>
    </>
  );
}

// ─── PREMIUM MODAL ────────────────────────────────────────────────────────────
function PremiumModal({ t, setModal }) {
  return (
    <div className="modal-overlay" onClick={()=>setModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h2 className="serif">{t.premiumFeatures}</h2>
          <button className="btn btn-ghost" onClick={()=>setModal(null)}><Icon.X/></button>
        </div>
        <div style={{textAlign:"center",padding:"10px 0 20px"}}>
          <div style={{fontSize:"48px",marginBottom:"8px"}}>👑</div>
          <p style={{color:"var(--text2)",marginBottom:"20px"}}>Upgrade to unlock this feature</p>
          <PlanSelector t={t} setModal={setModal}/>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL (PESAPAL LIVE) ────────────────────────────────────────────
function PaymentModal({ modal, t, setModal, handleSubscribe, showToast, currentUser }) {
  const [method, setMethod] = useState("mpesa");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [pesapalUrl, setPesapalUrl] = useState(null);
  const plan = typeof modal === "object" ? modal.plan : "monthly";

  const initiatePesapalPayment = async () => {
    if (!phone) { showToast("Weka nambari ya simu", "error"); return; }
    setProcessing(true);
    try {
      // Step 1: Get Pesapal token
      const tokenRes = await fetch("https://pay.pesapal.com/v3/api/Auth/RequestToken", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          consumer_key: PESAPAL_CONFIG.CONSUMER_KEY,
          consumer_secret: PESAPAL_CONFIG.CONSUMER_SECRET
        })
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.token) {
        // Keys hazijawekwa bado — tumia demo mode
        throw new Error("DEMO_MODE");
      }

      // Step 2: Submit order
      const orderId = `WU-${Date.now()}`;
      const orderRes = await fetch("https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${tokenData.token}`
        },
        body: JSON.stringify({
          id: orderId,
          currency: "TZS",
          amount: PLANS[plan].price * 2700, // Convert USD to TZS approx
          description: `Waauza Utamutz - ${PLANS[plan].label} Premium`,
          callback_url: PESAPAL_CONFIG.CALLBACK_URL,
          notification_id: "",
          branch: "Waauza Utamutz",
          billing_address: {
            phone_number: phone,
            email_address: currentUser?.email || "",
            first_name: currentUser?.name?.split(" ")[0] || "User",
            last_name: currentUser?.name?.split(" ")[1] || "",
            country_code: "TZ",
          }
        })
      });
      const orderData = await orderRes.json();
      if (orderData.redirect_url) {
        setPesapalUrl(orderData.redirect_url);
        setProcessing(false);
      } else {
        throw new Error("No redirect URL");
      }
    } catch (err) {
      setProcessing(false);
      if (err.message === "DEMO_MODE" || PESAPAL_CONFIG.CONSUMER_KEY === "bGur9I0CXbkqqjKMblbl+rIUGCQqG+Zr") {
        // Demo mode — simulate payment
        setTimeout(() => { setDone(true); setTimeout(() => handleSubscribe(plan), 1500); }, 2000);
        setProcessing(true);
      } else {
        showToast("Tatizo la malipo. Jaribu tena.", "error");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={()=>!processing&&!pesapalUrl&&setModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {done ? (
          <div style={{textAlign:"center",padding:"20px"}}>
            <div style={{fontSize:"64px",marginBottom:"16px"}}>🎉</div>
            <h2 className="serif" style={{marginBottom:"8px"}}>{t.paymentSuccess}</h2>
            <p style={{color:"var(--teal)"}}>{t.premiumUnlocked}</p>
          </div>
        ) : pesapalUrl ? (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
              <h2 className="serif" style={{fontSize:"18px"}}>Malipo ya Pesapal</h2>
              <button className="btn btn-ghost btn-sm" onClick={()=>setPesapalUrl(null)}>✕</button>
            </div>
            <div style={{background:"var(--bg2)",borderRadius:"12px",padding:"14px",marginBottom:"16px",fontSize:"13px",color:"var(--text2)",textAlign:"center"}}>
              <div style={{marginBottom:"8px"}}>Bonyeza kitufe chini kulipa kupitia Pesapal</div>
              <div style={{fontSize:"12px",color:"var(--text3)"}}>M-Pesa · Airtel Money · Tigo Pesa · Halo Pesa · Visa · Mastercard</div>
            </div>
            <a href={pesapalUrl} target="_blank" rel="noopener noreferrer"
              className="btn btn-gold btn-full"
              style={{textDecoration:"none",padding:"16px",fontSize:"15px",marginBottom:"10px"}}
              onClick={()=>{ setTimeout(()=>{handleSubscribe(plan);setModal(null);}, 3000); }}>
              💳 Lipa Sasa — TZS {(PLANS[plan].price * 2500).toLocaleString()}
            </a>
            <button className="btn btn-ghost btn-full btn-sm" onClick={()=>{ handleSubscribe(plan); showToast("Malipo yamethibitishwa! ✅","success"); }}>
              ✅ Nimethibitisha malipo yangu
            </button>
          </div>
        ) : (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <h2 className="serif">{t.selectPayment}</h2>
              <button className="btn btn-ghost" onClick={()=>setModal(null)}>✕</button>
            </div>
            {plan && (
              <div style={{background:"var(--bg2)",borderRadius:"12px",padding:"14px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"var(--text2)"}}>Plan: <strong style={{color:"var(--text)"}}>{PLANS[plan]?.label}</strong></span>
                <span className="serif" style={{fontSize:"20px"}}><span className="gold-text">${PLANS[plan]?.price}</span></span>
              </div>
            )}
            {/* Payment methods */}
            <div style={{display:"grid",gap:"10px",marginBottom:"20px"}}>
              {[
                {key:"mpesa",label:"M-Pesa",icon:"📱",sub:"Lipa Na M-Pesa — Tanzania"},
                {key:"airtel",label:"Airtel Money",icon:"🔴",sub:"Airtel Money Tanzania"},
                {key:"tigo",label:"Tigo Pesa / Halo Pesa",icon:"🟡",sub:"Tigo Pesa · Halopesa"},
                {key:"card",label:"Visa / Mastercard",icon:"💳",sub:"Kadi ya benki"},
              ].map(m=>(
                <div key={m.key} onClick={()=>setMethod(m.key)} style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px",border:`2px solid ${method===m.key?"var(--accent)":"var(--border)"}`,borderRadius:"12px",cursor:"pointer",transition:"all .2s",background:method===m.key?"rgba(201,168,76,.05)":"transparent"}}>
                  <span style={{fontSize:"22px"}}>{m.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:"14px"}}>{m.label}</div>
                    <div style={{fontSize:"12px",color:"var(--text3)"}}>{m.sub}</div>
                  </div>
                  {method===m.key && <span style={{color:"var(--accent)"}}>✓</span>}
                </div>
              ))}
            </div>
            <div style={{marginBottom:"16px"}}>
              <div className="label">📱 Nambari ya Simu</div>
              <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+255 700 000000"/>
            </div>
            <button className="btn btn-gold btn-full" style={{padding:"14px",fontSize:"15px"}} onClick={initiatePesapalPayment} disabled={processing}>
              {processing ? "⏳ Inaandaa..." : `Lipa $${PLANS[plan]?.price} Sasa`}
            </button>
            <p style={{textAlign:"center",fontSize:"12px",color:"var(--text3)",marginTop:"12px"}}>
              🔒 Malipo salama kupitia Pesapal · PCI-DSS Certified · BOT Licensed
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── BOOST MODAL ─────────────────────────────────────────────────────────────
function BoostModal({ t, setModal, handleBoost }) {
  return (
    <div className="modal-overlay" onClick={()=>setModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",padding:"10px 0"}}>
          <div style={{fontSize:"48px",marginBottom:"12px"}}>⚡</div>
          <h2 className="serif" style={{marginBottom:"8px"}}>{t.boostProfile}</h2>
          <p style={{color:"var(--text2)",marginBottom:"24px"}}>Appear first in search & browse for 24 hours</p>
          <div style={{background:"var(--bg2)",borderRadius:"12px",padding:"16px",marginBottom:"20px"}}>
            <div className="serif" style={{fontSize:"28px"}}><span className="gold-text">$2.99</span></div>
            <div style={{fontSize:"13px",color:"var(--text3)"}}>for 24 hours</div>
          </div>
          <button className="btn btn-gold btn-full" style={{marginBottom:"10px"}} onClick={()=>{handleBoost();setModal(null);}}>
            {t.boostNow}
          </button>
          <button className="btn btn-ghost btn-full" onClick={()=>setModal(null)}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── MY PROFILE PAGE ──────────────────────────────────────────────────────────
function MyProfilePage({ currentUser, t, setModal, isUserPremium, isBoosted, handleBoost, setPage, db }) {
  if (!currentUser) { setPage("login"); return null; }
  const isPrem = isUserPremium(currentUser);
  const boosted = isBoosted(currentUser);
  const likedBy = db.users.filter(u => currentUser.likedBy?.includes(u.id));

  return (
    <div style={{paddingTop:"72px"}}>
      <div className="nav">
        <span className="serif gold-text" style={{fontSize:"16px"}}>{t.profile}</span>
        <button className="btn btn-ghost btn-sm" onClick={()=>setModal("editProfile")}>
          <Icon.Edit/> Edit
        </button>
      </div>
      <div style={{padding:"16px",maxWidth:"560px",margin:"0 auto"}}>
        {/* Profile header */}
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <div style={{position:"relative",display:"inline-block",marginBottom:"12px"}}>
            <img src={currentUser.profileImage} alt={currentUser.name} className="avatar" style={{width:"100px",height:"100px"}}/>
            {isPrem && <span style={{position:"absolute",bottom:"4px",right:"4px",background:"linear-gradient(135deg,var(--accent),var(--accent2))",borderRadius:"50%",width:"24px",height:"24px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px"}}>👑</span>}
          </div>
          <h2 className="serif" style={{fontSize:"24px",marginBottom:"4px"}}>{currentUser.name}</h2>
          <p style={{color:"var(--text2)",fontSize:"14px",marginBottom:"8px"}}>🌍 {currentUser.country}</p>
          <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
            {isPrem && <span className="badge badge-gold"><Icon.Crown/> Premium</span>}
            {boosted && <span className="badge badge-purple">⚡ Boosted</span>}
          </div>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <div className="card" style={{padding:"16px",marginBottom:"16px"}}>
            <div className="label">About</div>
            <p style={{fontSize:"14px",color:"var(--text2)",lineHeight:1.7}}>{currentUser.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"16px"}}>
          {[
            {n: currentUser.likedBy?.length || 0, l:"Likes Received"},
            {n: db.likes.filter(l=>l.senderId===currentUser.id).length, l:"Likes Given"},
            {n: isPrem ? "✓" : "—", l:"Premium"},
          ].map(s=>(
            <div key={s.l} className="stat-card">
              <div className="serif" style={{fontSize:"22px",fontWeight:700}}><span className="gold-text">{s.n}</span></div>
              <div style={{fontSize:"11px",color:"var(--text3)",marginTop:"4px"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Phone */}
        <div className="card" style={{padding:"16px",marginBottom:"16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div className="label">Phone Number</div>
              <div style={{fontSize:"14px",marginTop:"4px"}}>{currentUser.phone || "Not set"}</div>
            </div>
            <span style={{color:"var(--accent)"}}><Icon.Phone/></span>
          </div>
        </div>

        {/* Who liked you */}
        <div className="card" style={{padding:"16px",marginBottom:"16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
            <div className="label">{t.seeLikes} ({likedBy.length})</div>
            {!isPrem && <button className="btn btn-gold btn-sm" onClick={()=>setPage("premium")}>Unlock</button>}
          </div>
          {isPrem ? (
            likedBy.length > 0 ? (
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                {likedBy.map(u=>(
                  <div key={u.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 12px",background:"var(--bg2)",borderRadius:"20px"}}>
                    <img src={u.profileImage} className="avatar" style={{width:"28px",height:"28px"}}/>
                    <span style={{fontSize:"13px"}}>{u.name}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{fontSize:"13px",color:"var(--text3)"}}>No likes yet. Keep browsing!</p>
          ) : (
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {likedBy.slice(0,3).map(u=>(
                <div key={u.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 12px",background:"var(--bg2)",borderRadius:"20px"}}>
                  <img src={u.profileImage} className="avatar premium-blur" style={{width:"28px",height:"28px"}}/>
                  <span style={{fontSize:"13px",filter:"blur(4px)"}}>Hidden User</span>
                </div>
              ))}
              {likedBy.length > 3 && <div style={{padding:"8px 12px",background:"var(--bg2)",borderRadius:"20px",fontSize:"13px",color:"var(--text3)"}}>+{likedBy.length-3} more</div>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{display:"grid",gap:"10px"}}>
          {!isPrem && (
            <button className="btn btn-gold btn-full" style={{padding:"14px"}} onClick={()=>setPage("premium")}>
              <Icon.Crown/> {t.premium}
            </button>
          )}
          <button className="btn btn-outline btn-full" style={{padding:"14px",color:boosted?"var(--purple)":"var(--text2)",borderColor:boosted?"var(--purple)":"var(--border)"}} onClick={()=>!boosted&&setModal("boost")}>
            <Icon.Zap/> {boosted ? t.boosted : t.boostNow}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT PROFILE MODAL ───────────────────────────────────────────────────────
function EditProfileModal({ currentUser, setCurrentUser, db, updateDb, t, setModal, showToast }) {
  const [form, setForm] = useState({ name: currentUser.name||"", bio: currentUser.bio||"", phone: currentUser.phone||"", country: currentUser.country||"Tanzania", region: currentUser.region||"", area: currentUser.area||"", gender: currentUser.gender||"", birthDate: currentUser.birthDate||"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const countryData = LOCATIONS[form.country] || LOCATIONS["Other"];
  const regions = Object.keys(countryData.regions);
  const areas = form.region ? (countryData.regions[form.region] || []) : [];

  const save = () => {
    const age = form.birthDate ? new Date().getFullYear() - new Date(form.birthDate).getFullYear() : currentUser.age;
    const updated = { ...currentUser, ...form, age };
    const updatedUsers = db.users.map(u => u.id === currentUser.id ? updated : u);
    setCurrentUser(updated);
    updateDb({ users: updatedUsers });
    setModal(null);
    showToast(t.profileUpdated, "success");
  };

  return (
    <div className="modal-overlay" onClick={()=>setModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h2 className="serif">Edit Profile</h2>
          <button className="btn btn-ghost" onClick={()=>setModal(null)}><Icon.X/></button>
        </div>
        <div style={{display:"grid",gap:"12px"}}>
          <div><div className="label">{t.name}</div><input className="input" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
          <div><div className="label">{t.bio}</div><textarea className="input" value={form.bio} onChange={e=>set("bio",e.target.value)} style={{resize:"vertical",minHeight:"80px"}}/></div>
          <div><div className="label">{t.phone}</div><input className="input" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+255 700 000000"/></div>
          <div>
            <div className="label">🌍 {t.country}</div>
            <select className="select" value={form.country} onChange={e=>{set("country",e.target.value);set("region","");set("area","");}}>
              {COUNTRIES.map(c=><option key={c} value={c}>{LOCATIONS[c]?.flag||"🌍"} {c}</option>)}
            </select>
          </div>
          <div>
            <div className="label">📍 Mkoa / Region</div>
            <select className="select" value={form.region} onChange={e=>{set("region",e.target.value);set("area","");}}>
              <option value="">-- Chagua Mkoa --</option>
              {regions.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {form.region && (
            <div>
              <div className="label">🏘️ Mtaa / Area</div>
              <select className="select" value={form.area} onChange={e=>set("area",e.target.value)}>
                <option value="">-- Chagua Mtaa --</option>
                {areas.map(a=><option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          {form.area && (
            <div style={{padding:"8px 12px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",borderRadius:"8px",fontSize:"13px"}}>
              📍 <strong style={{color:"var(--accent2)"}}>{form.area}, {form.region}</strong> — {LOCATIONS[form.country]?.flag} {form.country}
            </div>
          )}
          <div>
            <div className="label">⚤ Jinsia / Gender</div>
            <select className="select" value={form.gender} onChange={e=>set("gender",e.target.value)}>
              <option value="">-- Chagua --</option>
              <option value="male">👨 Mwanaume</option>
              <option value="female">👩 Mwanamke</option>
              <option value="other">🧑 Nyingine</option>
            </select>
          </div>
          <div>
            <div className="label">🎂 Tarehe ya Kuzaliwa</div>
            <input className="input" type="date" value={form.birthDate} onChange={e=>set("birthDate",e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().split("T")[0]}
            />
          </div>
          <div style={{padding:"10px 12px",background:"var(--bg2)",borderRadius:"10px",fontSize:"12px",color:"var(--text3)"}}>
            📸 Picha/video upload inahitaji Supabase Storage — tutaconnect hivi karibuni.
          </div>
        </div>
        <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
          <button className="btn btn-gold btn-full" onClick={save}><Icon.Check/> {t.save}</button>
          <button className="btn btn-outline" onClick={()=>setModal(null)}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── LIKES PAGE ───────────────────────────────────────────────────────────────
function LikesPage({ currentUser, db, t, isUserPremium, setPage, setSelectedUser, setModal }) {
  const isPrem = isUserPremium(currentUser);
  const likedBy = db.users.filter(u => currentUser?.likedBy?.includes(u.id));
  const myLikes = db.users.filter(u => db.likes.some(l => l.senderId === currentUser?.id && l.receiverId === u.id));

  return (
    <div style={{paddingTop:"72px"}}>
      <div className="nav">
        <span className="serif gold-text" style={{fontSize:"16px"}}>Likes</span>
        {!isPrem && <button className="btn btn-gold btn-sm" onClick={()=>setPage("premium")}><Icon.Crown/> Unlock</button>}
      </div>
      <div style={{padding:"16px",maxWidth:"560px",margin:"0 auto"}}>
        <div className="tab" style={{marginBottom:"20px"}}>
          {["Liked You","You Liked"].map((tab,i)=>(
            <button key={tab} className={`tab-btn${i===0?" active":""}`} id={`liketab-${i}`}
              onClick={e=>{document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");}}>
              {tab} {i===0?`(${likedBy.length})`:`(${myLikes.length})`}
            </button>
          ))}
        </div>

        {/* Liked You */}
        <div id="liketab-0-content">
          {!isPrem ? (
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>🔒</div>
              <h3 className="serif" style={{marginBottom:"8px"}}>{likedBy.length} people liked your profile</h3>
              <p style={{color:"var(--text2)",marginBottom:"20px",fontSize:"14px"}}>Upgrade to Premium to see who</p>
              <div style={{display:"flex",justifyContent:"center",gap:"-8px",marginBottom:"20px"}}>
                {likedBy.slice(0,5).map((u,i)=>(
                  <img key={u.id} src={u.profileImage} className="avatar premium-blur" style={{width:"50px",height:"50px",marginLeft:i>0?"-12px":"0",zIndex:5-i}}/>
                ))}
              </div>
              <button className="btn btn-gold" onClick={()=>setPage("premium")}><Icon.Crown/> {t.premium}</button>
            </div>
          ) : (
            <div>
              {likedBy.length === 0 ? (
                <div style={{textAlign:"center",padding:"40px 20px",color:"var(--text3)"}}>
                  <div style={{fontSize:"48px",marginBottom:"12px"}}>💛</div>
                  <p>No likes yet. Keep browsing!</p>
                </div>
              ) : (
                <div style={{display:"grid",gap:"10px"}}>
                  {likedBy.map(u=>(
                    <div key={u.id} className="card" style={{padding:"14px",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer"}} onClick={()=>{setSelectedUser(u);setModal("profile");}}>
                      <img src={u.profileImage} className="avatar" style={{width:"52px",height:"52px"}}/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600}}>{u.name}</div>
                        <div style={{fontSize:"13px",color:"var(--text3)"}}>{u.country}</div>
                      </div>
                      <span style={{color:"var(--rose)"}}><Icon.Heart filled={true}/></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ t, lang, setLang, darkMode, setDarkMode, currentUser, handleLogout, setPage }) {
  return (
    <div style={{paddingTop:"72px"}}>
      <div className="nav">
        <span className="serif gold-text" style={{fontSize:"16px"}}>{t.settings}</span>
        <div/>
      </div>
      <div style={{padding:"16px",maxWidth:"480px",margin:"0 auto"}}>
        {/* Profile summary */}
        {currentUser && (
          <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",marginBottom:"20px"}}>
            <img src={currentUser.profileImage} className="avatar" style={{width:"52px",height:"52px"}}/>
            <div>
              <div style={{fontWeight:600}}>{currentUser.name}</div>
              <div style={{fontSize:"13px",color:"var(--text3)"}}>{currentUser.email}</div>
            </div>
          </div>
        )}

        {[
          {
            title:"Appearance",
            items:[
              {label:"Theme",element:<button className="btn btn-outline btn-sm" onClick={()=>setDarkMode(d=>!d)}>{darkMode?<><Icon.Sun/> Light</>:<><Icon.Moon/> Dark</>}</button>}
            ]
          },
          {
            title:"Language",
            items:[
              {label:t.language, element:(
                <select className="select" value={lang} onChange={e=>setLang(e.target.value)} style={{width:"auto",padding:"6px 10px",fontSize:"13px"}}>
                  <option value="en">🇬🇧 English</option>
                  <option value="sw">🇹🇿 Swahili</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
              )}
            ]
          },
          {
            title:"Privacy",
            items:[
              {label:"Phone number visibility",element:<span className="badge badge-teal">Premium only</span>},
              {label:"Profile visibility",element:<span className="badge badge-teal">Public</span>},
            ]
          }
        ].map(section=>(
          <div key={section.title} style={{marginBottom:"20px"}}>
            <div className="label" style={{marginBottom:"10px"}}>{section.title}</div>
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",overflow:"hidden"}}>
              {section.items.map((item,i)=>(
                <div key={item.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderTop:i>0?"1px solid var(--border)":"none"}}>
                  <span style={{fontSize:"14px"}}>{item.label}</span>
                  {item.element}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Subscription info */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",padding:"16px",marginBottom:"20px"}}>
          <div className="label" style={{marginBottom:"8px"}}>Subscription</div>
          {currentUser?.isPremium ? (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span className="badge badge-gold"><Icon.Crown/> Premium Active</span>
              <span style={{fontSize:"13px",color:"var(--text3)"}}>Exp: {new Date(currentUser.premiumExpiry).toLocaleDateString()}</span>
            </div>
          ) : (
            <button className="btn btn-gold btn-sm" onClick={()=>setPage("premium")}><Icon.Crown/> Upgrade to Premium</button>
          )}
        </div>

        <button className="btn btn-danger btn-full" style={{padding:"14px"}} onClick={handleLogout}>
          {t.logout}
        </button>

        <p style={{textAlign:"center",fontSize:"12px",color:"var(--text3)",marginTop:"20px"}}>
          Waauza Utamutz v1.0 · East Africa Premium Connections<br/>
          support@waauza.com
        </p>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ db, updateDb, t, setModal, showToast, handleLogout, currentUser }) {
  const [tab, setTab] = useState("analytics");

  const totalUsers = db.users.filter(u=>!u.isSeedAccount).length;
  const premiumUsers = db.users.filter(u=>u.isPremium && !u.isSeedAccount).length;
  const seedAccounts = db.users.filter(u=>u.isSeedAccount).length;
  const totalRevenue = db.subscriptions.reduce((a,s)=>a+s.amount,0);

  const toggleActive = (userId) => {
    const updated = db.users.map(u => u.id === userId ? {...u, isActive: !u.isActive} : u);
    updateDb({ users: updated });
    showToast("User status updated", "info");
  };

  const deleteUser = (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    updateDb({ users: db.users.filter(u => u.id !== userId) });
    showToast("User deleted", "error");
  };

  return (
    <div style={{minHeight:"100vh"}}>
      {/* Admin nav */}
      <div className="nav">
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <span style={{color:"var(--accent)"}}><Icon.Shield/></span>
          <span className="serif gold-text" style={{fontSize:"18px"}}>Admin Panel</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>{t.logout}</button>
      </div>

      <div style={{paddingTop:"80px",display:"flex",minHeight:"100vh"}}>
        {/* Sidebar */}
        <div style={{width:"200px",borderRight:"1px solid var(--border)",padding:"20px 0",flexShrink:0,display:"flex",flexDirection:"column",gap:"4px"}}>
          {[
            {key:"analytics",label:"Analytics",icon:<Icon.Star/>},
            {key:"users",label:"All Users",icon:<Icon.User/>},
            {key:"seeds",label:"Seed Accounts",icon:<Icon.Crown/>},
            {key:"subscriptions",label:"Subscriptions",icon:<Icon.Zap/>},
          ].map(item=>(
            <button key={item.key} className={`btn btn-ghost${tab===item.key?" active":""}`}
              style={{justifyContent:"flex-start",gap:"10px",borderRadius:0,padding:"12px 20px",color:tab===item.key?"var(--accent)":"var(--text2)",background:tab===item.key?"rgba(201,168,76,.1)":"transparent",borderLeft:tab===item.key?"3px solid var(--accent)":"3px solid transparent"}}
              onClick={()=>setTab(item.key)}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,padding:"24px",overflow:"auto"}}>
          {tab === "analytics" && (
            <div className="fade-in">
              <h2 className="serif" style={{fontSize:"24px",marginBottom:"24px"}}>Dashboard</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px",marginBottom:"28px"}}>
                {[
                  {label:"Total Users",value:totalUsers,icon:"👥",color:"var(--teal)"},
                  {label:"Premium Users",value:premiumUsers,icon:"👑",color:"var(--accent)"},
                  {label:"Seed Accounts",value:seedAccounts,icon:"💎",color:"var(--purple)"},
                  {label:"Total Revenue",value:`$${totalRevenue.toFixed(2)}`,icon:"💰",color:"var(--teal)"},
                  {label:"Total Likes",value:db.likes.length,icon:"💛",color:"var(--rose)"},
                  {label:"Active Boosts",value:db.boosts.length,icon:"⚡",color:"var(--purple)"},
                ].map(stat=>(
                  <div key={stat.label} className="stat-card">
                    <div style={{fontSize:"28px",marginBottom:"8px"}}>{stat.icon}</div>
                    <div className="serif" style={{fontSize:"28px",fontWeight:700,color:stat.color}}>{stat.value}</div>
                    <div style={{fontSize:"12px",color:"var(--text3)",marginTop:"4px"}}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Country breakdown */}
              <div className="card" style={{padding:"20px"}}>
                <h3 style={{marginBottom:"16px",fontSize:"16px"}}>Users by Country</h3>
                {COUNTRIES.slice(0,-1).map(country => {
                  const count = db.users.filter(u=>u.country===country).length;
                  if (!count) return null;
                  return (
                    <div key={country} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                      <span style={{width:"100px",fontSize:"13px",color:"var(--text2)"}}>{country}</span>
                      <div style={{flex:1,height:"8px",background:"var(--bg2)",borderRadius:"4px",overflow:"hidden"}}>
                        <div style={{width:`${(count/db.users.length)*100}%`,height:"100%",background:"linear-gradient(90deg,var(--accent),var(--accent2))",borderRadius:"4px",transition:"width .5s"}}/>
                      </div>
                      <span style={{fontSize:"13px",fontWeight:600,width:"20px"}}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="fade-in">
              <h2 className="serif" style={{fontSize:"24px",marginBottom:"20px"}}>All Users ({db.users.filter(u=>!u.isSeedAccount).length})</h2>
              <div style={{display:"grid",gap:"10px"}}>
                {db.users.filter(u=>!u.isSeedAccount).map(user=>(
                  <div key={user.id} className="card" style={{padding:"14px",display:"flex",alignItems:"center",gap:"12px"}}>
                    <img src={user.profileImage} className="avatar" style={{width:"44px",height:"44px"}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:"14px"}}>{user.name}</div>
                      <div style={{fontSize:"12px",color:"var(--text3)"}}>{user.email} · {user.country}</div>
                      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"4px"}}>
                        {user.isPremium && <span className="badge badge-gold" style={{fontSize:"10px"}}>Premium</span>}
                        {!user.isActive && <span className="badge badge-rose" style={{fontSize:"10px"}}>Inactive</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>toggleActive(user.id)}>
                        {user.isActive ? t.deactivate : t.activate}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteUser(user.id)}>
                        <Icon.Trash/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "seeds" && (
            <div className="fade-in">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
                <h2 className="serif" style={{fontSize:"24px"}}>Seed Accounts ({db.users.filter(u=>u.isSeedAccount).length})</h2>
                <button className="btn btn-gold" onClick={()=>setModal("createSeed")}><Icon.Plus/> {t.createSeed}</button>
              </div>
              <div style={{display:"grid",gap:"10px"}}>
                {db.users.filter(u=>u.isSeedAccount).map(user=>(
                  <div key={user.id} className="card" style={{padding:"16px"}}>
                    <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
                      <img src={user.profileImage} className="avatar" style={{width:"52px",height:"52px"}}/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600}}>{user.name}</div>
                        <div style={{fontSize:"12px",color:"var(--text3)"}}>{user.country}</div>
                        <div style={{display:"flex",gap:"6px",marginTop:"6px",flexWrap:"wrap"}}>
                          <span className="badge badge-teal" style={{fontSize:"10px"}}>Seed</span>
                          <span className={`badge ${user.isActive?"badge-teal":"badge-rose"}`} style={{fontSize:"10px"}}>{user.isActive?"Active":"Inactive"}</span>
                          {user.chatLink && <span className="badge badge-purple" style={{fontSize:"10px"}}>WhatsApp ✓</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:"6px",flexDirection:"column"}}>
                        <button className="btn btn-outline btn-sm" onClick={()=>toggleActive(user.id)}>
                          {user.isActive ? t.deactivate : t.activate}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={()=>deleteUser(user.id)}><Icon.Trash/> Delete</button>
                      </div>
                    </div>
                    {user.phone && (
                      <div style={{marginTop:"10px",padding:"8px 12px",background:"var(--bg2)",borderRadius:"8px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px"}}>
                        <span style={{color:"var(--accent)"}}><Icon.Phone/></span>
                        {user.phone}
                        {user.chatLink && <a href={user.chatLink} target="_blank" rel="noopener noreferrer" style={{marginLeft:"auto",color:"var(--teal)",textDecoration:"none",fontSize:"12px"}}>Open WhatsApp →</a>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "subscriptions" && (
            <div className="fade-in">
              <h2 className="serif" style={{fontSize:"24px",marginBottom:"20px"}}>Subscriptions ({db.subscriptions.length})</h2>
              <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid var(--border)"}}>
                      {["User","Plan","Amount","Start","End","Status"].map(h=>(
                        <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:"12px",color:"var(--text3)",textTransform:"uppercase",letterSpacing:".8px"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {db.subscriptions.map(sub=>{
                      const user = db.users.find(u=>u.id===sub.userId);
                      return (
                        <tr key={sub.id} style={{borderBottom:"1px solid var(--border)"}}>
                          <td style={{padding:"12px 16px",fontSize:"14px"}}>{user?.name||sub.userId}</td>
                          <td style={{padding:"12px 16px"}}><span className="badge badge-gold">{sub.planType}</span></td>
                          <td style={{padding:"12px 16px",color:"var(--teal)",fontWeight:600}}>${sub.amount}</td>
                          <td style={{padding:"12px 16px",fontSize:"13px",color:"var(--text3)"}}>{new Date(sub.startDate).toLocaleDateString()}</td>
                          <td style={{padding:"12px 16px",fontSize:"13px",color:"var(--text3)"}}>{new Date(sub.endDate).toLocaleDateString()}</td>
                          <td style={{padding:"12px 16px"}}><span className="badge badge-teal">{sub.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {db.subscriptions.length === 0 && (
                  <div style={{textAlign:"center",padding:"40px",color:"var(--text3)"}}>No subscriptions yet</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CREATE SEED MODAL ────────────────────────────────────────────────────────
function CreateSeedModal({ db, updateDb, t, setModal, showToast }) {
  const [form, setForm] = useState({ name:"", phone:"", country:"Kenya", bio:"", whatsapp:"", chatLink:"", profileImage:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const create = () => {
    if (!form.name || !form.phone) { showToast("Name and phone required","error"); return; }
    const newSeed = {
      id: `seed${Date.now()}`, ...form,
      email: `seed${Date.now()}@waauza.com`, password: "seed123",
      isPremium: true, premiumExpiry: "2099-12-31", isSeedAccount: true,
      createdByAdmin: true, isActive: true, role: "user",
      boostedUntil: null, likedBy: [], joinedAt: new Date().toISOString(),
      chatLink: form.chatLink || (form.whatsapp ? `https://wa.me/${form.whatsapp.replace(/[^0-9]/g,"")}` : ""),
      profileImage: form.profileImage || `https://randomuser.me/api/portraits/women/${Math.floor(Math.random()*80)}.jpg`,
      plan: "yearly", language: "en"
    };
    updateDb({ users: [...db.users, newSeed] });
    setModal(null);
    showToast("Seed account created! 💎", "success");
  };

  return (
    <div className="modal-overlay" onClick={()=>setModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h2 className="serif">{t.createSeed}</h2>
          <button className="btn btn-ghost" onClick={()=>setModal(null)}><Icon.X/></button>
        </div>
        <div style={{display:"grid",gap:"12px"}}>
          <div><div className="label">{t.name} *</div><input className="input" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Display name"/></div>
          <div><div className="label">{t.phone} *</div><input className="input" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+255 700 000000"/></div>
          <div><div className="label">WhatsApp Number</div><input className="input" value={form.whatsapp} onChange={e=>set("whatsapp",e.target.value)} placeholder="+255700000000 (no spaces)"/></div>
          <div><div className="label">{t.country}</div><select className="select" value={form.country} onChange={e=>set("country",e.target.value)}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><div className="label">{t.bio}</div><textarea className="input" value={form.bio} onChange={e=>set("bio",e.target.value)} style={{resize:"vertical",minHeight:"60px"}} placeholder="Short bio..."/></div>
          <div><div className="label">Profile Image URL (optional)</div><input className="input" value={form.profileImage} onChange={e=>set("profileImage",e.target.value)} placeholder="https://..."/></div>
          <div style={{padding:"10px 12px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",borderRadius:"10px",fontSize:"12px",color:"var(--text2)"}}>
            💡 WhatsApp link will auto-generate from the number above. Seed accounts are marked <code style={{color:"var(--accent)"}}>is_seed_account = true</code> internally.
          </div>
        </div>
        <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
          <button className="btn btn-gold btn-full" onClick={create}><Icon.Plus/> Create Seed Account</button>
          <button className="btn btn-outline" onClick={()=>setModal(null)}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}
