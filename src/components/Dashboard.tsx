import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Flame,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Hash,
  Search,
  BookOpen,
  Coffee,
  Check,
  ChevronDown,
  ChevronUp,
  Star
} from "lucide-react";
import { ActiveTab } from "../types";
import { FEATURES, STATISTICS, TESTIMONIALS, FAQ_ITEMS, PRICING_TIERS } from "../data";

interface DashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export default function Dashboard({ onNavigate, onOpenAuth, isLoggedIn }: DashboardProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "Image": return ImageIcon;
      case "Search": return Search;
      case "Zap": return Zap;
      case "Hash": return Hash;
      case "BookOpen": return BookOpen;
      default: return Sparkles;
    }
  };

  return (
    <div id="dashboard-view" className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 text-center max-w-5xl mx-auto px-4">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-inner backdrop-blur-md hover:border-indigo-400/50 transition-all cursor-pointer">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
          <span>ScriptForge AI 2.0 is Live with Gemini 3.5 Flash Support</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Unleash the Ultimate <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Creator Pipeline
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Generate production-ready video scripts, viral hooks, click-worthy titles, chapters, SEO descriptions, and jaw-dropping AI artwork in under two seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate("script")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/20 hover:from-blue-500 hover:to-purple-500 hover:shadow-indigo-500/35 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Generating Free</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={isLoggedIn ? () => onNavigate("settings") : onOpenAuth}
            className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md px-8 py-4 text-base font-bold text-slate-200 hover:bg-slate-800/80 hover:text-white transition-all duration-300 hover:border-slate-700 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoggedIn ? "Manage Settings" : "Sign Up Securely"}
          </button>
        </div>

        {/* Dashboard Preview Frame Mockup */}
        <div className="mt-16 relative rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3 shadow-2xl shadow-indigo-500/5 backdrop-blur-sm max-w-4xl mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent rounded-2xl opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity" />
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-900 text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/40" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <span className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>
            <div className="text-xs bg-slate-900 px-4 py-1 rounded-md border border-slate-800/50 font-mono">
              scriptforge.ai/dashboard
            </div>
            <div className="w-12" />
          </div>
          {/* Mock Body */}
          <div className="p-4 sm:p-6 text-left grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-mono text-indigo-400">INPUT ENGINE</span>
              </div>
              <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
              <div className="h-16 w-full bg-slate-800/50 rounded-lg animate-pulse" />
              <div className="h-9 w-full bg-indigo-600/30 border border-indigo-500/20 rounded-lg" />
            </div>
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/30 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">LIVE METRICS</span>
                <div className="text-3xl font-bold text-white">99.4% SEO Score</div>
                <div className="text-xs text-slate-400">Viral content tags computed instantly via Gemini model.</div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-12 bg-slate-800 rounded" />
                <div className="h-6 w-16 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEAUTIFUL STATISTICS */}
      <section className="border-y border-slate-900 bg-slate-950/40 py-12 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATISTICS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white bg-gradient-to-r from-indigo-200 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUICK START - MAIN WORKSPACE CARDS */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Launch Your Tools Instantly
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Access our specialized, highly tuned AI generators crafted specifically for social media and copywriting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((tool, idx) => {
            const Icon = getToolIcon(tool.icon);
            // Derive navigation tab based on feature titles
            let targetTab: ActiveTab = "script";
            if (tool.title.includes("Art")) targetTab = "image";
            else if (tool.title.includes("SEO")) targetTab = "description";
            else if (tool.title.includes("Hook")) targetTab = "hook";
            else if (tool.title.includes("Hashtag")) targetTab = "hashtag";
            else if (tool.title.includes("Story")) targetTab = "story";

            return (
              <div
                key={idx}
                onClick={() => onNavigate(targetTab)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 shadow-md hover:shadow-xl hover:shadow-indigo-500/5 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Glowing Border Background */}
                <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-tr ${tool.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                {/* Icon Box */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${tool.color} p-3 mb-5 text-white shadow-md shadow-slate-950/30`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {tool.title}
                </h3>
                
                <p className="mt-3 text-sm text-slate-400 font-medium leading-relaxed">
                  {tool.desc}
                </p>

                {/* Arrow trigger on hover */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Open Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PREMIUM TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Trusted by the Web's Top Creators
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm">
            Here's what social media managers, copywriters, and influencers are achieving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((test, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 border-t border-slate-850 pt-4">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-10 w-10 rounded-full border border-slate-800 shadowobject-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white">{test.name}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING TIERS */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Plans for Creators of All Sizes
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm">
            Save hundreds of hours with automated production strategies. No contract required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border bg-slate-900/20 p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                tier.isPopular
                  ? "border-indigo-500 shadow-xl shadow-indigo-500/5 bg-slate-900/40 scale-105"
                  : "border-slate-800/80"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 px-4 py-1 text-[10px] font-bold text-white tracking-widest uppercase shadow">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="mt-2 text-xs text-slate-400 font-medium leading-relaxed">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-xs text-slate-500 font-semibold">/{tier.period}</span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 border-t border-slate-800/50 pt-6">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onNavigate("script")}
                  className={`w-full rounded-xl py-3 px-4 text-sm font-bold transition-all duration-200 active:scale-98 ${
                    tier.isPopular
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/10 hover:from-blue-500 hover:to-purple-500"
                      : "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 max-w-sm mx-auto text-sm">
            Everything you need to know about billing, setup, and key parameters.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800/70 bg-slate-900/10 backdrop-blur-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-white"
                >
                  <span className="font-semibold text-sm sm:text-base">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-800/40 p-5 pt-4 text-sm text-slate-400 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PREMIUM FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/60 pt-16 pb-12 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">ScriptForge AI</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Crafting premium automation interfaces for modern digital creators, content copywriters, and enterprise brands in 2026.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-white">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="hover:text-indigo-400 cursor-pointer" onClick={() => onNavigate("script")}>Script Writer</li>
              <li className="hover:text-indigo-400 cursor-pointer" onClick={() => onNavigate("image")}>Art Generator</li>
              <li className="hover:text-indigo-400 cursor-pointer" onClick={() => onNavigate("hook")}>Viral Hooks</li>
              <li className="hover:text-indigo-400 cursor-pointer" onClick={() => onNavigate("hashtag")}>Hashtag Catalyst</li>
            </ul>
          </div>

          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="hover:text-indigo-400 cursor-pointer">API Keys Proxy</li>
              <li className="hover:text-indigo-400 cursor-pointer" onClick={() => onNavigate("settings")}>Custom Presets</li>
              <li className="hover:text-indigo-400 cursor-pointer">Community Guild</li>
              <li className="hover:text-indigo-400 cursor-pointer">Security Ledger</li>
            </ul>
          </div>

          <div className="space-y-4 text-sm">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Coffee className="h-4 w-4" />
              <span>Support Developer</span>
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Created with passion to build a highly functional creator studio. Show your support with a small coffee boost!
            </p>
            <a
              href="https://buymeacoffee.com/roarfardeen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-colors"
            >
              <span>Buy Me a Coffee</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-semibold uppercase tracking-wider">
          <div>
            © 2026 ScriptForge AI. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Execution</span>
            <span className="hover:text-slate-400 cursor-pointer">GDPR Compliance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
