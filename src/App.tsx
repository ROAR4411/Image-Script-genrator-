import React, { useState, useEffect } from "react";
import { Menu, Sparkles, User, LogIn, ChevronRight, Award, History as HistoryIcon, Coffee, Sparkle, X, CheckCircle2 } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import Generators from "./components/Generators";
import ImageGenerator from "./components/ImageGenerator";
import HistoryAndFavorites from "./components/HistoryAndFavorites";
import SettingsView from "./components/SettingsView";
import PricingView from "./components/PricingView";
import { ActiveTab, UserProfile, HistoryItem, AppSettings } from "./types";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  // 1. Core States
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // App settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: "dark",
    language: "English",
    notifications: true,
    autoSave: true
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    name: "Alex Rivera",
    email: "alex@scriptforge.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isLoggedIn: false, // Default is logged out, will sync instantly on load
    memberSince: "July 2026",
    plan: "Free"
  });

  // In-app checkout confirmation notification overlay
  const [paymentSuccess, setPaymentSuccess] = useState<{ plan: string; isSandbox: boolean } | null>(null);

  // Workspace Generations History
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "hist-1",
      tool: "script",
      title: "How I built ScriptForge AI in 48 Hours Solo",
      timestamp: "07/08/2026, 10:14 AM",
      inputs: {
        topic: "How I built ScriptForge AI in 48 Hours Solo",
        language: "English",
        platform: "YouTube",
        tone: "Bold",
        length: "Medium"
      },
      output: {
        hook: "🔥 They told me a solo developer couldn't launch a premium SaaS in 48 hours. So I proved them wrong with this...",
        body: "Building a complex creator hub isn't about writing a million lines of code anymore. It's about combining advanced intelligence engines, modular architecture, and extreme design discipline. Here is how I set up the proxy, secured the secrets, and coded the UI using a sleek glass design in standard React. First, I declared types. Next, I wrote a proxy server. Here's exactly how you can replicate it.",
        ending: "No excuses. You can launch your dream product this weekend.",
        cta: "👉 Subscribe to my channel for the complete source breakdown and grab the codebase in the description!",
        formattingAdvice: "Incorporate fast b-roll cuts of visual designs, terminal codes, and coffee cups. Keep the pacing sharp and high energy."
      },
      isFavorite: true
    },
    {
      id: "hist-2",
      tool: "description",
      title: "Complete Guide to React 19 State Managers",
      timestamp: "07/08/2026, 09:42 AM",
      inputs: {
        topic: "Complete Guide to React 19 State Managers",
        language: "English",
        platform: "YouTube"
      },
      output: {
        description: "Are you confused about how to manage state in React 19? In this full masterclass, we explore custom local state managers, context sync, and durable storage fallbacks. We build simple, robust systems that sync directly with server APIs while keeping credentials hidden from the frontend.",
        tags: ["#React19", "#StateManagement", "#CodingTutorial", "#WebDev"],
        seoScoreExplanation: "High density of core keywords in opening paragraph. Properly parsed tags and brief description matching modern CTR indicators."
      },
      isFavorite: false
    }
  ]);

  // Load from LocalStorage if present
  useEffect(() => {
    const savedHistory = localStorage.getItem("sf_history");
    const savedSettings = localStorage.getItem("sf_settings");
    const savedUser = localStorage.getItem("sf_user");

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // 1. Listen for real Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const loggedInUser: UserProfile = {
              name: data.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Creative Maven",
              email: firebaseUser.email || "",
              avatar: data.avatar || firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              isLoggedIn: true,
              memberSince: data.memberSince || "July 2026",
              plan: data.plan || "Free"
            };
            setUser(loggedInUser);
            localStorage.setItem("sf_user", JSON.stringify(loggedInUser));
          } else {
            // First time signup via google/email, save doc in firestore
            const defaultProfile: UserProfile = {
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Creative Maven",
              email: firebaseUser.email || "",
              avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              isLoggedIn: true,
              memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
              plan: "Free"
            };
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              name: defaultProfile.name,
              email: defaultProfile.email,
              avatar: defaultProfile.avatar,
              plan: "Free",
              memberSince: defaultProfile.memberSince
            });
            setUser(defaultProfile);
            localStorage.setItem("sf_user", JSON.stringify(defaultProfile));
          }
        } catch (err) {
          console.warn("Firestore sync warning on auth load:", err);
          const loggedInUser: UserProfile = {
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Creative Maven",
            email: firebaseUser.email || "",
            avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            isLoggedIn: true,
            memberSince: "July 2026",
            plan: "Free"
          };
          setUser(loggedInUser);
          localStorage.setItem("sf_user", JSON.stringify(loggedInUser));
        }
      } else {
        // User is logged out
        setUser({
          name: "",
          email: "",
          avatar: "",
          isLoggedIn: false,
          memberSince: "",
          plan: "Free"
        });
        localStorage.removeItem("sf_user");
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Check for successful Stripe redirect params on mount
  useEffect(() => {
    const checkPaymentRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const planParam = params.get("plan");
      const sandboxParam = params.get("sandbox");
      
      if (payment === "success" && planParam) {
        const normalizedPlan = planParam === "Pro" || planParam === "Creator Pro" ? "Pro" : "Enterprise";
        
        // Show the in-app confirmation notification overlay
        setPaymentSuccess({
          plan: normalizedPlan === "Pro" ? "Creator Pro" : "Studio Enterprise",
          isSandbox: sandboxParam === "true"
        });

        // Strip the parameters from URL smoothly without reloading
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };
    checkPaymentRedirect();
  }, []);

  // Save changes to localStorage helper
  const saveHistoryToStorage = (updatedHistory: HistoryItem[]) => {
    setHistory(updatedHistory);
    localStorage.setItem("sf_history", JSON.stringify(updatedHistory));
  };

  const handleSaveToHistory = (item: Omit<HistoryItem, "id" | "timestamp" | "isFavorite">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      isFavorite: false
    };
    const updated = [newItem, ...history];
    saveHistoryToStorage(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveHistoryToStorage(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to wipe your workspace history? This is irreversible.")) {
      saveHistoryToStorage([]);
    }
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem("sf_user", JSON.stringify(profile));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
    const emptyUser = {
      name: "",
      email: "",
      avatar: "",
      isLoggedIn: false,
      memberSince: "",
      plan: "Free" as const
    };
    setUser(emptyUser);
    localStorage.removeItem("sf_user");
    setActiveTab("dashboard");
  };

  const handleUpgradePlan = async (plan: "Free" | "Pro" | "Enterprise") => {
    const updated = { ...user, plan };
    setUser(updated);
    localStorage.setItem("sf_user", JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, { plan }, { merge: true });
        console.log(`Firestore plan upgraded to: ${plan}`);
      } catch (err) {
        console.warn("Firestore upgrade write error:", err);
      }
    }
  };

  // Render correct main panel content based on tab
  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} onOpenAuth={() => setIsAuthOpen(true)} isLoggedIn={user.isLoggedIn} />;
      case "image":
        return <ImageGenerator isLoggedIn={user.isLoggedIn} onSaveToHistory={handleSaveToHistory} />;
      case "history":
        return (
          <HistoryAndFavorites
            viewType="history"
            history={history}
            onToggleFavorite={handleToggleFavorite}
            onDeleteHistory={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        );
      case "favorites":
        return (
          <HistoryAndFavorites
            viewType="favorites"
            history={history}
            onToggleFavorite={handleToggleFavorite}
            onDeleteHistory={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        );
      case "settings":
        return (
          <SettingsView
            settings={settings}
            setSettings={(s) => {
              setSettings(s);
              localStorage.setItem("sf_settings", JSON.stringify(s));
            }}
            user={user}
            onUpgradePlan={handleUpgradePlan}
            onNavigateToPricing={() => setActiveTab("pricing")}
          />
        );
      case "pricing":
        return (
          <PricingView
            user={user}
            onUpgradePlan={handleUpgradePlan}
          />
        );
      case "support":
        return (
          <div className="py-20 text-center space-y-6 max-w-lg mx-auto p-6 rounded-3xl border border-slate-800 bg-slate-900/10 backdrop-blur-md">
            <div className="mx-auto h-16 w-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
              <Coffee className="h-8 w-8 text-amber-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Support ScriptForge Developer</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Hi! I am the developer behind ScriptForge AI. If this platform is making your social media scripting workflow smoother and faster, consider supporting me with a small boost. Every coffee keeps the servers and diffusion engines active!
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://buymeacoffee.com/roarfardeen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-amber-400 active:scale-95 transition"
              >
                <span>Buy Me a Coffee on BuyMeACoffee</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        );
      // All specialized text generators
      case "script":
      case "hook":
      case "title":
      case "description":
      case "hashtag":
      case "caption":
      case "story":
      case "prompt":
        return (
          <Generators
            tool={activeTab}
            isLoggedIn={user.isLoggedIn}
            onSaveToHistory={handleSaveToHistory}
            favorites={history.filter((i) => i.isFavorite)}
            onToggleFavoriteInList={handleToggleFavorite}
          />
        );
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} onOpenAuth={() => setIsAuthOpen(true)} isLoggedIn={user.isLoggedIn} />;
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 flex overflow-hidden font-sans bg-slate-950 transition-colors ${settings.theme === "light" ? "light-mode-theme bg-slate-50 text-slate-950" : ""}`}>
      {/* Background Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* LEFT PANEL: Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* RIGHT PANEL: Workspace Body */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* TOP BAR NAV */}
        <header className="h-16 header-glass px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Context Header Name */}
            <div>
              <h1 className="text-sm font-extrabold text-white capitalize flex items-center gap-1.5 uppercase tracking-widest font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>{activeTab === "dashboard" ? "System Core Overview" : `${activeTab} workspace`}</span>
              </h1>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-4">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1">
                  <Award className="h-3 w-3 text-indigo-400" />
                  <span>{user.plan} CREATOR</span>
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  onClick={() => setIsAuthOpen(true)}
                  className="h-8 w-8 rounded-full border border-slate-800 cursor-pointer object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/25 px-3.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTAINER CONTENT VIEW */}
        <main className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-thumb-slate-900">
          {renderMainContent()}
        </main>
      </div>

      {/* Authentication & Profile Modal popup */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        user={user}
      />

      {/* Stripe Payment Success Confirmation Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-950 p-6 sm:p-8 text-center shadow-2xl shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-300">
            {/* Corner Close */}
            <button
              onClick={() => setPaymentSuccess(null)}
              className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Glowing Icon */}
            <div className="mx-auto h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                <Sparkle className="h-5 w-5 text-indigo-400 animate-spin duration-3000" />
                <span>Subscription Active!</span>
              </h3>
              <p className="text-sm text-slate-300 font-semibold leading-relaxed">
                Thank you! Your workspace has been instantly upgraded to the <span className="text-indigo-400 font-bold">{paymentSuccess.plan}</span> tier.
              </p>
              {paymentSuccess.isSandbox ? (
                <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-[11px] text-indigo-300 font-medium leading-relaxed mt-2">
                  🛡️ <strong className="font-bold">Sandbox Mode Activated:</strong> Simulated checkout completed successfully with full mock credentials. Feel free to explore all premium creator tools.
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-[11px] text-indigo-300 font-medium leading-relaxed mt-2">
                  ✨ Real-time production subscription active. Manage your invoices via Settings.
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setPaymentSuccess(null);
                  setActiveTab("dashboard");
                }}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 py-3.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-indigo-500 transition-all shadow-lg shadow-emerald-500/15 active:scale-95 cursor-pointer"
              >
                Launch Premium Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
