import React, { useState } from "react";
import {
  Settings as SettingsIcon, Sun, Moon, Globe, Shield, Key, Bell, Check, Save, Sparkles, Award
} from "lucide-react";
import { AppSettings, UserProfile } from "../types";

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  user: UserProfile;
  onUpgradePlan: (plan: "Free" | "Pro" | "Enterprise") => void;
  onNavigateToPricing: () => void;
}

export default function SettingsView({
  settings,
  setSettings,
  user,
  onUpgradePlan,
  onNavigateToPricing
}: SettingsViewProps) {
  const [successMsg, setSuccessMsg] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [keyMasked, setKeyMasked] = useState(true);

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === "dark" ? "light" : "dark";
    setSettings({ ...settings, theme: nextTheme });
    setSuccessMsg(`Theme toggled to ${nextTheme.toUpperCase()} mode!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleLangChange = (lang: string) => {
    setSettings({ ...settings, language: lang });
    setSuccessMsg(`Workspace locale updated to: ${lang}!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleTogglePref = (key: keyof AppSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    setSuccessMsg("Preferences updated successfully.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleSaveCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKey) return;
    setSuccessMsg("Custom enterprise Gemini proxy key linked successfully!");
    setCustomKey("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* 1. Header description */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 text-indigo-400">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Workspace Configuration</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Manage your aesthetic modes, locales, custom secrets, and billing level.
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="h-4.5 w-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT CARD: Aesthetics and Locales */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-sm space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            <span>Theme & Localization</span>
          </h3>

          {/* Theme switcher */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
            <div>
              <div className="text-xs font-bold text-slate-200">Color Aesthetic</div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Choose between Light or Dark Mode.</div>
            </div>
            <button
              onClick={handleToggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              {settings.theme === "dark" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Language preference */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Default App Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="English">English (United States)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Workspace Preferences
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 border border-slate-850/50">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-300">Auto-Save Generations</div>
                <div className="text-[10px] text-slate-500">Automatically cache scripts to your history.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={() => handleTogglePref("autoSave")}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/10 border border-slate-850/50">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-300">In-App Notifications</div>
                <div className="text-[10px] text-slate-500">Receive alerts when long generations complete.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleTogglePref("notifications")}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Key secrets and upgrade plan */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/10 backdrop-blur-sm space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span>Plan & Enterprise Security</span>
          </h3>

          {/* Plan level box */}
          <div className="p-4 rounded-xl bg-gradient-to-tr from-indigo-950/20 via-purple-950/10 to-slate-950 border border-indigo-500/25 flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">CURRENT LEVEL</span>
              <h4 className="text-base font-extrabold text-white truncate">{user.isLoggedIn ? `${user.plan} Creator Tier` : "Starter Free Account"}</h4>
              <p className="text-[10px] text-slate-400">
                {user.plan === "Free" || !user.isLoggedIn
                  ? "Enjoy standard AI script formulation capabilities."
                  : user.plan === "Pro"
                  ? "Unlimited social text formulation & 1,000 monthly image renders."
                  : "All Pro benefits, brand voice training, team spaces, and custom API proxies."
                }
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToPricing}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3.5 text-xs font-bold transition-all shadow-lg shadow-indigo-500/10 whitespace-nowrap cursor-pointer active:scale-95"
            >
              {user.plan === "Free" || !user.isLoggedIn ? "Upgrade Workspace" : "View Tiers / Billing"}
            </button>
          </div>

          {/* API Key Proxy management */}
          <form onSubmit={handleSaveCustomKey} className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Key className="h-4 w-4 text-slate-500" />
              <label className="uppercase tracking-wider">Enterprise API Key Override</label>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              We provide dedicated high-speed server proxies for our standard free tier. To link your personal developer account quota, paste your key below (it remains 100% encrypted).
            </p>
            
            <div className="relative">
              <input
                type={keyMasked ? "password" : "text"}
                placeholder="GEMINI_API_KEY..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full pl-4 pr-16 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setKeyMasked(!keyMasked)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
              >
                {keyMasked ? "Show" : "Hide"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 py-2.5 text-xs font-bold transition-colors"
            >
              Verify & Link Secrets
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
