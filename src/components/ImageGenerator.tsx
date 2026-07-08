import React, { useState } from "react";
import {
  Image as ImageIcon, Sparkles, RefreshCw, Copy, Check, Download,
  Heart, AlertCircle, Camera, Box, Flame, Layers, Layout, Maximize2, Tv, Wand2, Smile, Zap, ShoppingBag
} from "lucide-react";
import { IMAGE_STYLES, IMAGE_RATIOS } from "../data";
import { HistoryItem } from "../types";

interface ImageGeneratorProps {
  isLoggedIn: boolean;
  onSaveToHistory: (item: Omit<HistoryItem, "id" | "timestamp" | "isFavorite">) => void;
}

export default function ImageGenerator({ isLoggedIn, onSaveToHistory }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(null);

  const getStyleIcon = (iconName: string) => {
    switch (iconName) {
      case "Camera": return <Camera className="h-4 w-4" />;
      case "Box": return <Box className="h-4 w-4" />;
      case "Sparkles": return <Sparkles className="h-4 w-4" />;
      case "Smile": return <Smile className="h-4 w-4" />;
      case "Wand2": return <Wand2 className="h-4 w-4" />;
      case "Zap": return <Zap className="h-4 w-4" />;
      case "Layers": return <Layers className="h-4 w-4" />;
      case "Tv": return <Tv className="h-4 w-4" />;
      case "Flame": return <Flame className="h-4 w-4" />;
      case "ShoppingBag": return <ShoppingBag className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      alert("Please describe the artwork you'd like to forge!");
      return;
    }

    setLoading(true);
    setGeneratedUrl(null);
    setImageSource(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio: selectedRatio,
          style: selectedStyle
        })
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedUrl(data.imageUrl);
        setImageSource(data.source);

        // Auto save to workspace history
        onSaveToHistory({
          tool: "image",
          title: prompt,
          inputs: { style: selectedStyle, ratio: selectedRatio },
          output: { imageUrl: data.imageUrl, source: data.source }
        });
      }
    } catch (error) {
      console.error("Failed to generate artwork:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    const fullPrompt = `${prompt}, style of ${selectedStyle}, highly detailed, masterpiece, 8k resolution`;
    navigator.clipboard.writeText(fullPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    try {
      // If it is a base64 image data-url
      if (generatedUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = generatedUrl;
        link.download = `scriptforge_art_${Date.now()}.png`;
        link.click();
        return;
      }

      // If it is an external URL (fallback link)
      // Fetch the image as blob first to avoid browser navigation
      const res = await fetch(generatedUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `scriptforge_art_${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback direct open link
      window.open(generatedUrl, "_blank");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT: Image parameters config */}
      <div className="lg:col-span-5 space-y-6">
        <div className="panel-glass p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/60">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/50 text-indigo-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Stunning Art Forge</h2>
              <p className="text-xs text-slate-400 font-medium">Create magnificent visual cards and thumbnails.</p>
            </div>
          </div>

          {/* Description prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Describe your visual concept in detail
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. A futuristic workspace featuring an ultra-slim monitor displaying glowing terminal lines, surround-sound speakers, warm volumetric amber light, minimalist style..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 input-glass text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Visual Art Style
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {IMAGE_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-center gap-2.5 p-2.5 text-left rounded-xl border text-xs font-bold transition-all duration-200 ${
                    selectedStyle === style.id
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  <span className="p-1 rounded bg-slate-900 text-slate-400 group-hover:text-indigo-400">
                    {getStyleIcon(style.icon)}
                  </span>
                  <div>
                    <div className="font-bold text-slate-200">{style.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Aspect Ratio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {IMAGE_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedRatio === ratio.id
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-300"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">{ratio.name}</div>
                  <div className="text-[9px] text-slate-500 font-semibold mt-0.5">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl btn-immersive py-3 px-4 text-sm font-bold text-white active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Forging Canvas...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-white" />
                <span>Forge Artwork</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Visual Frame Canvas Output */}
      <div className="lg:col-span-7">
        <div className="panel-glass p-6 shadow-2xl min-h-[480px] flex flex-col justify-between">
          
          {/* Idle default visual state */}
          {!loading && !generatedUrl && (
            <div className="my-auto text-center space-y-4 max-w-sm mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-300">Canvas is Empty</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Compose your artistic theme on the left, pick an aspect ratio, and watch the system forge stunning photorealistic renders.
                </p>
              </div>
            </div>
          )}

          {/* Generating Loading Visual state */}
          {loading && (
            <div className="my-auto text-center space-y-5">
              <div className="relative mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 animate-spin shadow-lg shadow-indigo-500/20">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-200 animate-pulse">Computing Diffusion Vectors...</h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                  Initializing Google Gemini Flash Image layers and parsing details. Please hold.
                </p>
              </div>
            </div>
          )}

          {/* Render Result artwork */}
          {!loading && generatedUrl && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Toolbar header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                    Artwork Render Complete ({imageSource === "gemini" ? "Gemini Native" : "Stable Diffusion fallback"})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    title="Copy Prompt"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
                  >
                    {copiedPrompt ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                    <span>Prompt</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
                  >
                    <Download className="h-3.5 w-3.5 text-white" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>

              {/* Render canvas aspect container */}
              <div className="relative mx-auto max-w-full flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner group">
                <img
                  src={generatedUrl}
                  alt={prompt}
                  className="max-h-[400px] object-contain transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual expand trigger */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <button
                    onClick={() => window.open(generatedUrl, "_blank")}
                    className="p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition active:scale-95"
                    title="Expand Image"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Technical summary details */}
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/25 text-left text-xs text-slate-400 leading-relaxed font-semibold">
                <span className="text-indigo-400 font-bold">Metadata Tag:</span> {prompt} (style: {selectedStyle}, aspect: {selectedRatio})
              </div>
            </div>
          )}

          {/* Workspace credit indicators */}
          {!loading && !generatedUrl && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-slate-900/10 border border-slate-850/60 text-[11px] text-slate-500 font-semibold">
              <AlertCircle className="h-4 w-4 text-indigo-400/80 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                Images require premium computing. Pro tier subscribers enjoy high-resolution 1K-4K exports. Free users get quick previews using high-CTR fallbacks.
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
