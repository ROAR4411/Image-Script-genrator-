import React, { useState } from "react";
import {
  History as HistoryIcon, Heart, Search, Trash2, ArrowRight,
  FileText, Sparkles, MessageSquare, Hash, BookOpen, Layers, Copy, Check, Download, ChevronDown, ChevronUp
} from "lucide-react";
import { HistoryItem, ActiveTab } from "../types";

interface HistoryAndFavoritesProps {
  viewType: "history" | "favorites";
  history: HistoryItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryAndFavorites({
  viewType,
  history,
  onToggleFavorite,
  onDeleteHistory,
  onClearAll
}: HistoryAndFavoritesProps) {
  const [search, setSearch] = useState("");
  const [filterTool, setFilterTool] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "script": return <FileText className="h-4.5 w-4.5 text-blue-400" />;
      case "image": return <Layers className="h-4.5 w-4.5 text-indigo-400" />;
      case "hook": return <Sparkles className="h-4.5 w-4.5 text-amber-400" />;
      case "story": return <BookOpen className="h-4.5 w-4.5 text-red-400" />;
      case "caption": return <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />;
      case "hashtag": return <Hash className="h-4.5 w-4.5 text-pink-400" />;
      case "title": return <Sparkles className="h-4.5 w-4.5 text-purple-400" />;
      case "description": return <Search className="h-4.5 w-4.5 text-emerald-400" />;
      case "prompt": return <Sparkles className="h-4.5 w-4.5 text-teal-400" />;
      default: return <Sparkles className="h-4.5 w-4.5 text-slate-400" />;
    }
  };

  const getToolLabel = (tool: string) => {
    switch (tool) {
      case "script": return "Script Generator";
      case "image": return "Image Generator";
      case "hook": return "Hook Generator";
      case "story": return "Story Generator";
      case "caption": return "Caption Generator";
      case "hashtag": return "Hashtag Generator";
      case "title": return "Title Generator";
      case "description": return "SEO Description";
      case "prompt": return "Prompt Generator";
      default: return "AI Generator";
    }
  };

  // Filter list
  const filteredItems = history.filter((item) => {
    // Search filter
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          JSON.stringify(item.output).toLowerCase().includes(search.toLowerCase());
    
    // Tool filter
    const matchesTool = filterTool === "all" || item.tool === filterTool;

    // Tab Type filter
    const matchesView = viewType === "history" ? true : item.isFavorite;

    return matchesSearch && matchesTool && matchesView;
  });

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header card with filters */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 text-indigo-400">
            {viewType === "history" ? <HistoryIcon className="h-5 w-5" /> : <Heart className="h-5 w-5 text-pink-400" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {viewType === "history" ? "Generative Workspace History" : "Your Saved Favorites"}
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              {viewType === "history"
                ? "Browse, favorite, and export all your past AI creations."
                : "A collection of your selected high-retention scripts and tags."}
            </p>
          </div>
        </div>

        {/* Clear All action (only for History tab) */}
        {viewType === "history" && history.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Entire History</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search within content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs font-bold text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Tool Filter Selector */}
        <select
          value={filterTool}
          onChange={(e) => setFilterTool(e.target.value)}
          className="w-full sm:w-48 px-3 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs font-bold text-slate-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All Generators</option>
          <option value="script">Scripts</option>
          <option value="image">Artwork</option>
          <option value="hook">Hooks</option>
          <option value="story">Stories</option>
          <option value="caption">Captions</option>
          <option value="hashtag">Hashtags</option>
          <option value="title">Titles</option>
          <option value="description">SEO Description</option>
          <option value="prompt">Prompts</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
            <Layers className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-300">No items detected</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We couldn't locate any logs matching your current filters. Start generating above to log entries.
            </p>
          </div>
        </div>
      )}

      {/* Item list */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 ${
                isExpanded ? "border-indigo-500/50 bg-slate-900/30" : "border-slate-800/60 bg-slate-900/10 hover:border-slate-800"
              }`}
            >
              {/* Item Header bar */}
              <div
                className="flex items-center justify-between p-4.5 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Tool Badge */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                    {getToolIcon(item.tool)}
                  </div>
                  
                  <div>
                    <div className="text-sm font-bold text-white max-w-sm sm:max-w-md md:max-w-lg truncate">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-extrabold text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase">
                        {getToolLabel(item.tool)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        • {item.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  {/* Favorite toggle */}
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-2 rounded-xl border transition ${
                      item.isFavorite
                        ? "border-pink-500/20 bg-pink-500/10 text-pink-400"
                        : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${item.isFavorite ? "fill-pink-400" : ""}`} />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteHistory(item.id)}
                    className="p-2 rounded-xl border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>

                  {/* Accordion indicator */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-900 transition"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Item Expanded Content Body */}
              {isExpanded && (
                <div className="border-t border-slate-800/40 p-5 pt-4 space-y-4 text-xs">
                  {/* Inputs Summary panel */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850/80 text-slate-400">
                    <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wide">Original Prompt Metrics:</span>
                    <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {Object.entries(item.inputs).map(([key, value]) => {
                        if (!value) return null;
                        return (
                          <div key={key} className="truncate">
                            <span className="text-slate-600 capitalize font-bold">{key}:</span>{" "}
                            <span className="text-slate-300 font-semibold">{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Output render layouts (similar to generator layouts) */}
                  <div className="p-4.5 rounded-xl border border-slate-850 bg-slate-900/30 text-slate-300 leading-relaxed font-semibold">
                    {item.tool === "script" && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="text-[9px] font-extrabold text-blue-400 tracking-wider uppercase">Opening Hook</div>
                          <div className="text-sm text-slate-200">{item.output.hook}</div>
                        </div>
                        <div className="space-y-1 border-t border-slate-850 pt-3">
                          <div className="text-[9px] font-extrabold text-indigo-400 tracking-wider uppercase">Body Narrative</div>
                          <div className="text-sm text-slate-300 whitespace-pre-line">{item.output.body}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-3">
                          <div className="space-y-1">
                            <div className="text-[9px] font-extrabold text-purple-400 tracking-wider uppercase">Ending Outro</div>
                            <div className="text-xs text-slate-300">{item.output.ending}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[9px] font-extrabold text-rose-400 tracking-wider uppercase">CTA Action</div>
                            <div className="text-xs text-slate-300 font-bold">{item.output.cta}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.tool === "image" && (
                      <div className="space-y-3">
                        <img
                          src={item.output.imageUrl}
                          alt={item.title}
                          className="rounded-xl max-h-60 border border-slate-800 object-contain mx-auto"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-center">
                          <button
                            onClick={() => handleCopyText(item.output.imageUrl, "img")}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300 transition"
                          >
                            {copiedKey === "img" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>Copy Image Link</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {item.tool === "hook" && item.output.hooks && (
                      <div className="space-y-2">
                        {item.output.hooks.map((hook: string, idx: number) => (
                          <div key={idx} className="flex gap-2 text-xs py-1.5 border-b border-slate-850/60 last:border-0">
                            <span className="font-mono text-indigo-400 font-bold">#{idx + 1}</span>
                            <span className="text-slate-200 font-bold">{hook}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.tool === "title" && item.output.titles && (
                      <div className="space-y-2">
                        {item.output.titles.map((title: string, idx: number) => (
                          <div key={idx} className="flex gap-2 text-xs py-1.5 border-b border-slate-850/60 last:border-0">
                            <span className="font-mono text-purple-400 font-bold">{idx + 1}.</span>
                            <span className="text-slate-200 font-bold">{title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.tool === "description" && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-semibold">{item.output.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.output.tags?.map((tag: string, idx: number) => (
                            <span key={idx} className="text-[9px] font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.tool === "hashtag" && item.output.hashtags && (
                      <div className="flex flex-wrap gap-2">
                        {item.output.hashtags.map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs font-bold bg-slate-900 border border-slate-850 px-2.5 py-1 rounded text-pink-400">{tag}</span>
                        ))}
                      </div>
                    )}

                    {item.tool === "caption" && (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-200 whitespace-pre-line font-bold leading-relaxed">{item.output.caption}</p>
                        <div className="space-y-1 pt-2 border-t border-slate-850">
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Alternative Hooks:</span>
                          {item.output.alternatives?.map((alt: string, idx: number) => (
                            <p key={idx} className="text-xs text-slate-400 leading-normal italic">- "{alt}"</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.tool === "story" && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white text-center">{item.output.title}</h4>
                        {item.output.chapters?.map((chap: any, idx: number) => (
                          <div key={idx} className="space-y-1">
                            <div className="text-[10px] text-red-400 font-bold">{chap.title}</div>
                            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{chap.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.tool === "prompt" && (
                      <div className="space-y-3">
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">{item.output.prompt}</pre>
                        <p className="text-xs text-slate-400"><span className="text-teal-400 font-bold">Outcome Target:</span> {item.output.expectedOutcome}</p>
                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
