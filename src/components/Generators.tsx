import React, { useState } from "react";
import {
  FileText, Zap, Sparkles, Search, Hash, MessageSquare, BookOpen,
  Copy, Check, Download, Heart, RefreshCw, Layers, AlertCircle, Trash, Star, Play
} from "lucide-react";
import { ActiveTab, PlatformType, LanguageType, ToneType, LengthType, HistoryItem } from "../types";
import { PLATFORMS, LANGUAGES, TONES, LENGTHS, STORY_GENRES, PROMPT_TARGETS } from "../data";
import ExportModal from "./ExportModal";

interface GeneratorsProps {
  tool: ActiveTab;
  isLoggedIn: boolean;
  onSaveToHistory: (item: Omit<HistoryItem, "id" | "timestamp" | "isFavorite">) => void;
  favorites: HistoryItem[];
  onToggleFavoriteInList: (itemId: string) => void;
}

export default function Generators({
  tool,
  isLoggedIn,
  onSaveToHistory,
  favorites,
  onToggleFavoriteInList
}: GeneratorsProps) {
  // Common States
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<LanguageType>("English");
  const [platform, setPlatform] = useState<PlatformType>("YouTube");
  const [tone, setTone] = useState<ToneType>("Professional");
  const [length, setLength] = useState<LengthType>("Medium");
  const [audience, setAudience] = useState("General Public");
  const [category, setCategory] = useState("Education & Tech");
  
  // Specialized states
  const [keywords, setKeywords] = useState("");
  const [emojiStrength, setEmojiStrength] = useState<"Low" | "Medium" | "High">("Medium");
  const [storyGenre, setStoryGenre] = useState("Fantasy");
  const [promptTarget, setPromptTarget] = useState("Gemini");
  const [promptContext, setPromptContext] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleGenerate = async () => {
    if (!topic && tool !== "story") {
      alert("Please specify a topic or core subject to generate!");
      return;
    }
    
    setLoading(true);
    setResult(null);
    setIsSaved(false);
    
    // Build inputs based on selected tool
    const inputs: any = {
      topic,
      language,
      platform,
      tone,
      length,
      audience,
      category,
      keywords,
      emojiStrength,
      genre: storyGenre,
      modelTarget: promptTarget,
      context: promptContext
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, inputs })
      });
      const data = await response.json();
      setResult(data);
      
      // Auto save to history
      onSaveToHistory({
        tool,
        title: topic || `${storyGenre} Story`,
        inputs,
        output: data
      });
    } catch (err) {
      console.error("Failed to generate content:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Copy individual string to clipboard
  const copyToClipboard = (text: string, key?: string, idx?: number) => {
    navigator.clipboard.writeText(text);
    if (idx !== undefined) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } else if (key) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    }
  };

  // Helper: Download output as a clean draft text file
  const handleDownload = () => {
    if (!result) return;
    let textContent = `=== SCRIPTFORGE AI GENERATION ===\n`;
    textContent += `Tool: ${tool.toUpperCase()}\n`;
    textContent += `Topic: ${topic || "Creative"}\n`;
    textContent += `Timestamp: ${new Date().toLocaleString()}\n`;
    textContent += `=================================\n\n`;

    if (tool === "script") {
      textContent += `[OPENING HOOK]\n${result.hook}\n\n`;
      textContent += `[BODY CONTENT]\n${result.body}\n\n`;
      textContent += `[ENDING OUTRO]\n${result.ending}\n\n`;
      textContent += `[CALL TO ACTION]\n${result.cta}\n\n`;
      textContent += `[FORMATTING ADVICE]\n${result.formattingAdvice}\n`;
    } else if (tool === "hook" && result.hooks) {
      result.hooks.forEach((hook: string, idx: number) => {
        textContent += `${idx + 1}. ${hook}\n`;
      });
    } else if (tool === "title" && result.titles) {
      result.titles.forEach((title: string, idx: number) => {
        textContent += `${idx + 1}. ${title}\n`;
      });
    } else if (tool === "description") {
      textContent += `[SEO DESCRIPTION]\n${result.description}\n\n`;
      textContent += `[SUGGESTED TAGS]\n${result.tags?.join(" ")}\n\n`;
      textContent += `[SEO BREAKDOWN]\n${result.seoScoreExplanation}\n`;
    } else if (tool === "hashtag" && result.hashtags) {
      textContent += `[HASHTAGS]\n${result.hashtags?.join("\n")}\n`;
    } else if (tool === "caption") {
      textContent += `[MAIN CAPTION]\n${result.caption}\n\n`;
      textContent += `[ALTERNATIVES]\n`;
      result.alternatives?.forEach((alt: string, idx: number) => {
        textContent += `${idx + 1}. ${alt}\n`;
      });
    } else if (tool === "story") {
      textContent += `TITLE: ${result.title}\n\n`;
      result.chapters?.forEach((chap: any, idx: number) => {
        textContent += `${chap.title}\n${chap.content}\n\n`;
      });
    } else if (tool === "prompt") {
      textContent += `[GENERATED PROMPT]\n${result.prompt}\n\n`;
      textContent += `[TIPS]\n${result.tips?.join("\n")}\n\n`;
      textContent += `[EXPECTED OUTCOME]\n${result.expectedOutcome}\n`;
    }

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scriptforge_${tool}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Render Tool Icon
  const getToolIcon = () => {
    switch (tool) {
      case "script": return <FileText className="h-6 w-6 text-blue-400" />;
      case "hook": return <Zap className="h-6 w-6 text-amber-400" />;
      case "title": return <Sparkles className="h-6 w-6 text-purple-400" />;
      case "description": return <Search className="h-6 w-6 text-emerald-400" />;
      case "hashtag": return <Hash className="h-6 w-6 text-pink-400" />;
      case "caption": return <MessageSquare className="h-6 w-6 text-indigo-400" />;
      case "story": return <BookOpen className="h-6 w-6 text-red-400" />;
      case "prompt": return <Sparkles className="h-6 w-6 text-teal-400" />;
      default: return <Sparkles className="h-6 w-6 text-indigo-400" />;
    }
  };

  // Custom tool headers/info
  const getToolTitle = () => {
    switch (tool) {
      case "script": return "AI Script Forge";
      case "hook": return "Viral Hook Lab";
      case "title": return "CTR Title Architect";
      case "description": return "SEO Description Suite";
      case "hashtag": return "Hashtag Catalyst";
      case "caption": return "Caption Designer";
      case "story": return "Creative Storysmith";
      case "prompt": return "Expert Prompt Engineer";
      default: return "AI Creator Studio";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: Generator Configurations Form */}
      <div className="lg:col-span-5 space-y-6">
        <div className="panel-glass p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/60">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/50">
              {getToolIcon()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{getToolTitle()}</h2>
              <p className="text-xs text-slate-400 font-medium">Fine-tune your parameters and launch generating.</p>
            </div>
          </div>

          {/* Prompt / Topic Input */}
          {tool !== "story" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                What is your core subject or video topic?
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. 5 secrets about learning Next.js in 2026, or How to start your SaaS on a budget..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 input-glass text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                What is your story about? (Plot / Concept)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. A young programmer discovers a forgotten mainframe that is powered by an ancient spirit of wisdom..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 input-glass text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          )}

          {/* Multi-Selectors based on tool requirements */}
          <div className="grid grid-cols-2 gap-4">
            {/* 1. Language selector for multi-language outputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageType)}
                className="w-full px-3.5 py-2.5 input-glass text-xs font-bold text-slate-300 focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Platform selector */}
            {tool !== "story" && tool !== "prompt" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as PlatformType)}
                  className="w-full px-3.5 py-2.5 input-glass text-xs font-bold text-slate-300 focus:outline-none"
                >
                  {PLATFORMS.map((plat) => (
                    <option key={plat.id} value={plat.id}>
                      {plat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 3. Story Genre if Story Generator */}
            {tool === "story" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Genre Style
                </label>
                <select
                  value={storyGenre}
                  onChange={(e) => setStoryGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 input-glass text-xs font-bold text-slate-300 focus:outline-none"
                >
                  {STORY_GENRES.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Prompt Model Target if Prompt Generator */}
            {tool === "prompt" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Target Model
                </label>
                <select
                  value={promptTarget}
                  onChange={(e) => setPromptTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 input-glass text-xs font-bold text-slate-300 focus:outline-none"
                >
                  {PROMPT_TARGETS.map((target) => (
                    <option key={target.id} value={target.id}>
                      {target.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 5. Tone selection */}
            {tool !== "hashtag" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tone Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneType)}
                  className="w-full px-3.5 py-2.5 input-glass text-xs font-bold text-slate-300 focus:outline-none"
                >
                  {TONES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 6. Script Length selector */}
            {(tool === "script" || tool === "description" || tool === "story") && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Duration / Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as LengthType)}
                  className="w-full px-3.5 py-2.5 input-glass text-xs font-bold text-slate-300 focus:outline-none"
                >
                  {LENGTHS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Specialized Fields */}
          {tool === "script" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Audience Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Beginners"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2 input-glass text-xs font-semibold text-slate-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Niche Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finance & Stock"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 input-glass text-xs font-semibold text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          )}

          {tool === "description" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Focus SEO Keywords (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. tutorial, React coding, learn SaaS, beginners tutorial"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-4 py-2.5 input-glass text-xs font-medium text-slate-300 focus:outline-none"
              />
            </div>
          )}

          {tool === "caption" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Emoji Density Strength
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Low", "Medium", "High"] as const).map((density) => (
                  <button
                    key={density}
                    type="button"
                    onClick={() => setEmojiStrength(density)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      emojiStrength === density
                        ? "bg-indigo-600/15 border-indigo-500 text-indigo-300"
                        : "bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tool === "prompt" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Additional Instructions or Constraints (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ask it to output as a table, or keep it short..."
                value={promptContext}
                onChange={(e) => setPromptContext(e.target.value)}
                className="w-full px-4 py-2.5 input-glass text-xs font-medium text-slate-300 focus:outline-none"
              />
            </div>
          )}

          {/* Execute Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl btn-immersive py-3 px-4 text-sm font-bold text-white active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Crafting With Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Beautiful AI Generated Response Panel */}
      <div className="lg:col-span-7">
        <div className="panel-glass p-6 shadow-2xl min-h-[400px] flex flex-col justify-between">
          
          {/* Default state */}
          {!loading && !result && (
            <div className="my-auto text-center space-y-4 max-w-sm mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
                <Layers className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-300">Workspace is Idle</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Fill in your creative subject on the left, and watch the advanced Gemini models forge perfect drafts instantly.
                </p>
              </div>
            </div>
          )}

          {/* Skeleton Loader */}
          {loading && (
            <div className="space-y-6 w-full my-auto">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-900">
                <div className="h-10 w-10 bg-slate-900 rounded-xl animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-1/3 bg-slate-900 rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-slate-900 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-900 rounded animate-pulse" />
                <div className="h-4 w-[90%] bg-slate-900 rounded animate-pulse" />
                <div className="h-4 w-[95%] bg-slate-900 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-900 rounded animate-pulse" />
              </div>
              <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-2">
                <div className="h-3 w-1/4 bg-slate-900 rounded" />
                <div className="h-3 w-1/2 bg-slate-900 rounded" />
              </div>
            </div>
          )}

          {/* Render Result Outputs */}
          {!loading && result && (
            <div className="space-y-6 text-left flex-1">
              
              {/* Output Toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase">
                    Generative Complete
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    title="Export Draft"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-400" />
                    <span>Export Draft</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
                  >
                    {copiedAll ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5 text-white" />}
                    <span>{copiedAll ? "Copied!" : "Copy All"}</span>
                  </button>
                </div>
              </div>

              {/* Specific rendering for SCRIPT */}
              {tool === "script" && (
                <div className="space-y-5 max-h-[450px] overflow-y-auto pr-1">
                  <div className="p-4.5 rounded-xl border border-indigo-500/15 bg-indigo-500/5 space-y-1.5">
                    <div className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase">
                      Opening Hook (First 3 seconds)
                    </div>
                    <p className="text-sm text-slate-200 font-semibold leading-relaxed">
                      {result.hook}
                    </p>
                  </div>

                  <div className="p-4.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1.5">
                    <div className="text-[10px] font-extrabold text-blue-400 tracking-wider uppercase">
                      Body Narrative
                    </div>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                      {result.body}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/20 space-y-1.5">
                      <div className="text-[10px] font-extrabold text-purple-400 tracking-wider uppercase">
                        Ending / Outro
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {result.ending}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/20 space-y-1.5">
                      <div className="text-[10px] font-extrabold text-rose-400 tracking-wider uppercase">
                        CTA Instruction
                      </div>
                      <p className="text-xs text-slate-300 font-bold leading-relaxed">
                        {result.cta}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-850 bg-slate-950 text-xs text-slate-500 leading-relaxed font-semibold italic">
                    💡 <span className="text-slate-400 font-bold">Director's Advice:</span> {result.formattingAdvice}
                  </div>
                </div>
              )}

              {/* Specific rendering for HOOK */}
              {tool === "hook" && result.hooks && (
                <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                  <div className="text-xs text-slate-500 font-bold mb-2">
                    Click any hook line to copy it instantly:
                  </div>
                  {result.hooks.map((hook: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(hook, undefined, idx)}
                      className="group flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/35 hover:border-indigo-500/40 hover:bg-slate-900/60 cursor-pointer transition-all"
                    >
                      <span className="text-[10px] font-mono font-extrabold text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-xs text-slate-200 font-bold leading-relaxed flex-1">
                        {hook}
                      </p>
                      <button className="text-slate-600 group-hover:text-indigo-400 transition-colors">
                        {copiedIdx === idx ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Specific rendering for TITLE */}
              {tool === "title" && result.titles && (
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {result.titles.map((title: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(title, undefined, idx)}
                      className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-850 bg-slate-900/20 hover:border-indigo-500/40 hover:bg-slate-900/50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-900/50 h-5 w-5 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 font-bold leading-normal">
                          {title}
                        </p>
                      </div>
                      <button className="text-slate-600 group-hover:text-indigo-400 shrink-0">
                        {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Specific rendering for SEO DESCRIPTION */}
              {tool === "description" && (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  <div className="p-4.5 rounded-xl border border-slate-850 bg-slate-900/20 space-y-2">
                    <div className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase">
                      SEO Optimized Description
                    </div>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed whitespace-pre-line">
                      {result.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/10 space-y-2">
                    <div className="text-[10px] font-extrabold text-purple-400 tracking-wider uppercase">
                      Suggested Tags & Hashtags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tags?.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          onClick={() => copyToClipboard(tag, undefined, idx)}
                          className="text-[10px] font-bold bg-slate-900/80 border border-slate-800 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-300 px-2 py-1 rounded cursor-pointer transition-all"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4.5 rounded-xl border border-indigo-500/15 bg-indigo-500/5 space-y-1.5 text-xs text-slate-400 leading-relaxed">
                    💡 <span className="text-indigo-300 font-bold">SEO Formula Breakdown:</span> {result.seoScoreExplanation}
                  </div>
                </div>
              )}

              {/* Specific rendering for HASHTAG */}
              {tool === "hashtag" && result.hashtags && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 font-bold">
                    Generated tags based on current trending parameters:
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {result.hashtags.map((tag: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => copyToClipboard(tag.split(" ")[0], undefined, idx)}
                        className="group flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:border-pink-500/40 hover:bg-slate-900/40 cursor-pointer transition"
                      >
                        <span className="text-xs font-bold text-pink-400">{tag}</span>
                        <button className="text-slate-600 group-hover:text-pink-300">
                          {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific rendering for CAPTION */}
              {tool === "caption" && (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  <div className="p-4.5 rounded-xl border border-indigo-500/15 bg-indigo-500/5 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase">
                        Primary Social Caption
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.caption, "caption")}
                        className="text-slate-400 hover:text-indigo-400"
                      >
                        {copiedKey === "caption" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 font-semibold leading-relaxed whitespace-pre-line">
                      {result.caption}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase px-1">
                      Alternative Draft Hooks
                    </div>
                    {result.alternatives?.map((alt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-850 bg-slate-900/15 space-y-2 relative group"
                      >
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                          {alt}
                        </p>
                        <button
                          onClick={() => copyToClipboard(alt, undefined, idx)}
                          className="absolute top-2.5 right-2.5 text-slate-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition"
                        >
                          {copiedIdx === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific rendering for STORY */}
              {tool === "story" && (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  <div className="text-center space-y-1 py-1">
                    <div className="text-[10px] font-extrabold text-red-400 tracking-widest uppercase">
                      Immersive Story Rendered
                    </div>
                    <h3 className="text-lg font-extrabold text-white">{result.title}</h3>
                  </div>

                  {result.chapters?.map((chap: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4.5 rounded-2xl border border-slate-850 bg-slate-900/10 space-y-2.5"
                    >
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                        {chap.title}
                      </h4>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                        {chap.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Specific rendering for PROMPT MASTER */}
              {tool === "prompt" && (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  <div className="p-4.5 rounded-xl border border-teal-500/15 bg-teal-500/5 space-y-2 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-teal-400 tracking-wider uppercase">
                        Expert Prompt Code
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.prompt, "prompt")}
                        className="text-slate-400 hover:text-teal-400"
                      >
                        {copiedKey === "prompt" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-200 font-mono bg-slate-950 p-4.5 rounded-xl border border-slate-850/80 whitespace-pre-wrap overflow-x-auto leading-relaxed shadow-inner">
                      {result.prompt}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/15 space-y-2">
                      <div className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase">
                        Execution Advice
                      </div>
                      <ul className="space-y-2">
                        {result.tips?.map((tip: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-400 font-medium leading-relaxed flex items-start gap-1.5">
                            <span className="text-indigo-400">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/15 space-y-2">
                      <div className="text-[10px] font-extrabold text-pink-400 tracking-wider uppercase">
                        Expected Output Style
                      </div>
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                        {result.expectedOutcome}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Quick Info Box in footer */}
          {!loading && !result && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-slate-900/10 border border-slate-850/60 text-[11px] text-slate-500 font-semibold">
              <AlertCircle className="h-4 w-4 text-indigo-400/80 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Generations consume 1 free startup credit. To increase request token lengths or customize brand voice parameters, connect your enterprise key in the settings panel.
              </div>
            </div>
          )}
          
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        tool={tool}
        topic={topic}
        result={result}
        inputs={{
          language,
          platform,
          tone,
          length,
          audience,
          category,
          keywords,
          emojiStrength,
          genre: storyGenre,
          modelTarget: promptTarget
        }}
      />

    </div>
  );
}
