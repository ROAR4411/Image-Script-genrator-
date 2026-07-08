import React from "react";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Zap,
  BookOpen,
  MessageSquare,
  Hash,
  Sparkles,
  Search,
  History as HistoryIcon,
  Heart,
  Settings as SettingsIcon,
  Coffee,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { ActiveTab, UserProfile } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  onLogout: () => void;
  onOpenAuth: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onOpenAuth,
  sidebarOpen,
  setSidebarOpen
}: SidebarProps) {
  
  const menuGroups = [
    {
      title: "Core Platforms",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "script", label: "Script Generator", icon: FileText },
        { id: "image", label: "Image Generator", icon: ImageIcon },
      ]
    },
    {
      title: "Creator Tools",
      items: [
        { id: "hook", label: "Hook Generator", icon: Zap },
        { id: "story", label: "Story Generator", icon: BookOpen },
        { id: "caption", label: "Caption Generator", icon: MessageSquare },
        { id: "hashtag", label: "Hashtag Generator", icon: Hash },
        { id: "title", label: "Title Generator", icon: Sparkles },
        { id: "description", label: "SEO Description", icon: Search },
        { id: "prompt", label: "Prompt Master", icon: Sparkles },
      ]
    },
    {
      title: "Workspace",
      items: [
        { id: "history", label: "History Log", icon: HistoryIcon },
        { id: "favorites", label: "Saved Favorites", icon: Heart },
        { id: "pricing", label: "Pricing & Billing", icon: CreditCard },
        { id: "settings", label: "Settings", icon: SettingsIcon },
      ]
    }
  ];

  const handleNav = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close on mobile
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col sidebar-glass text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav("dashboard")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                ScriptForge
              </span>
              <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                AI
              </span>
            </div>
          </div>
          <button
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-800">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500/90">
                {group.title}
              </h4>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNav(item.id as ActiveTab)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group relative ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white shadow-inner border border-indigo-500/20"
                            : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                        }`}
                      >
                        {/* Selected Indicator Light */}
                        {isActive && (
                          <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-md bg-indigo-500" />
                        )}
                        <IconComponent
                          className={`h-4 w-4 transition-colors duration-200 ${
                            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Support Coffee Button */}
          <div className="pt-2">
            <a
              href="https://buymeacoffee.com/roarfardeen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3.5 py-3 text-sm font-semibold text-amber-400 transition-all duration-300 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <Coffee className="h-4 w-4 text-amber-400" />
              <span>Buy Me a Coffee</span>
            </a>
          </div>
        </div>

        {/* User Account Bar */}
        <div className="border-t border-white/5 p-4 bg-slate-900/10">
          {user.isLoggedIn ? (
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-950/20 border border-white/5">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav("settings")}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full border border-indigo-500/40 shadow-inner object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold text-white max-w-[120px] truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" />
                    {user.plan} PLAN
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / Join Free</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
