import React, { useState } from "react";
import { Check, Sparkles, Zap, Shield, Coffee, ChevronRight, AlertCircle, Award } from "lucide-react";
import { UserProfile } from "../types";

interface PricingViewProps {
  user: UserProfile;
  onUpgradePlan: (plan: "Free" | "Pro" | "Enterprise") => void;
}

export default function PricingView({ user, onUpgradePlan }: PricingViewProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const tiers = [
    {
      id: "Free",
      name: "Starter Free",
      price: "$0",
      period: "forever",
      desc: "Perfect for testing the waters and planning basic scripts.",
      icon: Zap,
      color: "from-blue-500/10 to-indigo-500/10 border-slate-800",
      iconColor: "text-blue-400",
      features: [
        "50 monthly generation credits",
        "All 8 specialized text tools",
        "Standard generation speeds",
        "Secure local workspace history",
        "Single-user dashboard access"
      ],
      buttonText: "Current Plan",
      isPopular: false
    },
    {
      id: "Pro",
      name: "Creator Pro",
      price: "$19",
      period: "month",
      desc: "Built for active content creators and social media marketers.",
      icon: Sparkles,
      color: "from-indigo-600/20 via-purple-600/15 to-slate-950/40 border-indigo-500/40 shadow-xl shadow-indigo-500/5",
      iconColor: "text-indigo-400",
      features: [
        "Unlimited text script generations",
        "1,000 premium high-res image renders/mo",
        "3x faster priority response speed",
        "Unlimited history & saved favorites",
        "Full formatting & video director tips",
        "Priority Customer Support"
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true
    },
    {
      id: "Enterprise",
      name: "Studio Enterprise",
      price: "$49",
      period: "month",
      desc: "Designed for production agencies, studios, and high-volume teams.",
      icon: Shield,
      color: "from-amber-500/10 to-orange-500/5 border-slate-800",
      iconColor: "text-amber-400",
      features: [
        "Everything included in Creator Pro",
        "Multi-user team workspace spaces",
        "Custom brand voice training presets",
        "Dedicated high-speed API keys proxy",
        "Custom platform integrations",
        "24/7 Dedicated Account Manager"
      ],
      buttonText: "Get Enterprise",
      isPopular: false
    }
  ];

  const handleSubscribe = async (tierId: string) => {
    if (tierId === "Free") return;
    
    setErrorMsg("");
    setLoading(tierId);

    try {
      // Trigger Stripe checkout session API
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plan: tierId,
          userId: user.isLoggedIn ? authCurrentUserUid() : "anonymous_eval_user",
          email: user.email || "eval@scriptforge.ai",
          successUrl: window.location.origin
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with billing server");
      }

      const data = await response.json();
      if (data.url) {
        // Redirect user to real Stripe Checkout or local sandbox completion
        window.location.href = data.url;
      } else {
        throw new Error("No payment session URL received");
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during checkout setup.");
      setLoading(null);
    }
  };

  // Helper to obtain current user uid safely if logged in
  const authCurrentUserUid = () => {
    try {
      const { auth } = require("../firebase");
      return auth.currentUser?.uid || "mock_uid_123";
    } catch {
      return "mock_uid_123";
    }
  };

  return (
    <div className="space-y-12 text-left max-w-6xl mx-auto px-4 pb-20">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Award className="h-3.5 w-3.5" />
          <span>Flexible Workspace Plans</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Supercharge Your Content Pipeline
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          Whether you are a solo creator, rising influencer, or digital studio, we have an account level custom-tailored for your production scale.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 flex items-center gap-2 max-w-xl mx-auto animate-in fade-in duration-200">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const TierIcon = tier.icon;
          const isCurrent = user.plan === tier.id || (tier.id === "Free" && !user.plan);
          
          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 bg-slate-900/10 backdrop-blur-md hover:-translate-y-1 ${tier.color}`}
            >
              {/* Popular Ribbon badge */}
              {tier.isPopular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-slate-950/80 border border-slate-800 ${tier.iconColor}`}>
                      <TierIcon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{tier.desc}</p>
                </div>

                {/* Pricing info */}
                <div className="py-2">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  {tier.period !== "forever" && (
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">
                      / {tier.period}
                    </span>
                  )}
                </div>

                {/* Features list */}
                <div className="border-t border-slate-900 pt-5 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Included Features
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-900/50">
                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isCurrent || loading !== null}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? "bg-slate-950/60 border border-slate-850 text-slate-500 cursor-not-allowed"
                      : tier.isPopular
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/10 hover:from-blue-500 hover:to-purple-500 active:scale-98"
                      : "bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 active:scale-98"
                  }`}
                >
                  <span>
                    {loading === tier.id 
                      ? "Processing Transaction..." 
                      : isCurrent 
                      ? "Your Current Active Plan" 
                      : tier.buttonText
                    }
                  </span>
                  {!isCurrent && loading !== tier.id && <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alternative payment / Support Creator */}
      <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <Coffee className="h-6 w-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">Support ScriptForge Developers Directly!</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl font-medium">
              Love the platform and want to support our independent developer workflow without subscribing? Consider buying us a coffee! Every drop supports our fast server response proxies.
            </p>
          </div>
        </div>
        <a
          href="https://buymeacoffee.com/roarfardeen"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-3.5 px-6 text-xs font-bold transition shadow-lg shadow-amber-500/10 active:scale-95 shrink-0"
        >
          <span>Support via BuyMeACoffee</span>
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

    </div>
  );
}
