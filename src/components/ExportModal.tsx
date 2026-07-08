import React, { useState, useEffect } from "react";
import { X, FileText, Download, Check, Copy, Settings, Calendar, Layers, ChevronRight, Sparkles } from "lucide-react";
import { jsPDF } from "jspdf";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: string;
  topic: string;
  result: any;
  inputs?: any; // Additional fallback input configuration parameters
}

export default function ExportModal({ isOpen, onClose, tool, topic, result, inputs }: ExportModalProps) {
  const [format, setFormat] = useState<"txt" | "md" | "pdf">("pdf");
  const [filename, setFilename] = useState("");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeFormatting, setIncludeFormatting] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-populate clean, URL-safe sanitized filename on open
  useEffect(() => {
    if (isOpen) {
      const slug = (topic || "script")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^_+|_+$)/g, "")
        .substring(0, 30);
      setFilename(`scriptforge_${tool}_${slug || "draft"}`);
      setCopied(false);
    }
  }, [isOpen, tool, topic]);

  if (!isOpen || !result) return null;

  // 1. Process and organize results into structured title/content segments
  const getSectionsAndMetadata = () => {
    const sections: { title: string; content: string }[] = [];
    
    // Standard workspace configuration indicators
    const meta: { [key: string]: string } = {
      tool: tool,
      topic: topic || "N/A",
      language: inputs?.language || "English",
    };

    if (inputs?.platform) meta.platform = inputs.platform;
    if (inputs?.tone) meta.tone = inputs.tone;
    if (inputs?.length) meta.length = inputs.length;
    if (inputs?.genre) meta.genre = inputs.genre;
    if (inputs?.modelTarget) meta.modelTarget = inputs.modelTarget;

    // Build structural outputs based on tool type
    if (tool === "script") {
      if (result.hook) sections.push({ title: "Opening Hook (0-3s)", content: result.hook });
      if (result.body) sections.push({ title: "Body Narrative", content: result.body });
      if (result.ending) sections.push({ title: "Ending Outro", content: result.ending });
      if (result.cta) sections.push({ title: "Call to Action", content: result.cta });
      if (includeFormatting && result.formattingAdvice) {
        sections.push({ title: "Formatting & Director's Advice", content: result.formattingAdvice });
      }
    } else if (tool === "hook" && result.hooks) {
      sections.push({
        title: "Generated Viral Hooks",
        content: result.hooks.map((h: string, i: number) => `${i + 1}. ${h}`).join("\n\n")
      });
    } else if (tool === "title" && result.titles) {
      sections.push({
        title: "Generated Titles",
        content: result.titles.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n\n")
      });
    } else if (tool === "description") {
      if (result.description) sections.push({ title: "SEO Description", content: result.description });
      if (result.tags) sections.push({ title: "Suggested Hash Tags", content: result.tags.join(", ") });
      if (result.seoScoreExplanation) sections.push({ title: "SEO Score Explanation", content: result.seoScoreExplanation });
    } else if (tool === "hashtag" && result.hashtags) {
      sections.push({ title: "Catalyst Hashtags", content: result.hashtags.join(" ") });
    } else if (tool === "caption") {
      if (result.caption) sections.push({ title: "Main Caption", content: result.caption });
      if (result.alternatives) {
        sections.push({
          title: "Alternative Hook Formats",
          content: result.alternatives.map((a: string, i: number) => `- "${a}"`).join("\n")
        });
      }
    } else if (tool === "story") {
      if (result.title) sections.push({ title: "Story Title", content: result.title });
      if (result.chapters) {
        result.chapters.forEach((ch: any) => {
          sections.push({ title: ch.title || "Chapter Draft", content: ch.content || "" });
        });
      }
    } else if (tool === "prompt") {
      if (result.prompt) sections.push({ title: "Generated Prompt Block", content: result.prompt });
      if (result.tips) {
        sections.push({ title: "Engineering Guardrails", content: result.tips.map((t: string, i: number) => `- ${t}`).join("\n") });
      }
      if (result.expectedOutcome) sections.push({ title: "Expected Output Target", content: result.expectedOutcome });
    } else {
      // Fallback for custom objects or string results
      if (typeof result === "string") {
        sections.push({ title: "AI Generation", content: result });
      } else {
        Object.entries(result).forEach(([k, v]) => {
          if (v && typeof v === "string") {
            sections.push({ title: k, content: v });
          } else if (v && Array.isArray(v)) {
            sections.push({ title: k, content: v.join("\n") });
          }
        });
      }
    }

    return { sections, meta };
  };

  const { sections, meta } = getSectionsAndMetadata();

  // 2. Format outputs as Plain Text (.txt) string
  const getTXTContent = () => {
    let outputText = "";
    if (includeMetadata) {
      outputText += `=== SCRIPTFORGE AI WORKSPACE DRAFT ===\n`;
      Object.entries(meta).forEach(([key, val]) => {
        outputText += `${key.toUpperCase()}: ${val}\n`;
      });
      outputText += `DATE: ${new Date().toLocaleString()}\n`;
      outputText += `======================================\n\n`;
    } else {
      outputText += `=== SCRIPTFORGE AI EXPORT ===\n\n`;
    }

    sections.forEach((sec) => {
      outputText += `[${sec.title.toUpperCase()}]\n`;
      outputText += `${sec.content}\n\n`;
    });

    outputText += `Generated via ScriptForge Studio AI — Creative Suite.`;
    return outputText;
  };

  // 3. Format outputs as Markdown (.md) string
  const getMDContent = () => {
    let outputMarkdown = "";
    if (includeMetadata) {
      outputMarkdown += `# ScriptForge AI Workspace Draft\n\n`;
      outputMarkdown += `| Configuration | Attribute Value |\n`;
      outputMarkdown += `| :--- | :--- |\n`;
      Object.entries(meta).forEach(([key, val]) => {
        outputMarkdown += `| **${key.toUpperCase()}** | ${val} |\n`;
      });
      outputMarkdown += `| **DATE** | ${new Date().toLocaleString()} |\n\n`;
      outputMarkdown += `---\n\n`;
    } else {
      outputMarkdown += `# ScriptForge AI Export\n\n`;
    }

    sections.forEach((sec) => {
      outputMarkdown += `## ${sec.title}\n\n`;
      outputMarkdown += `${sec.content}\n\n`;
    });

    outputMarkdown += `*Generated via [ScriptForge AI](https://scriptforge.ai) — Advanced Creative Suite.*`;
    return outputMarkdown;
  };

  // 4. Trigger standard download streams based on selected formats
  const handleExport = () => {
    setIsExporting(true);
    const finalFilename = filename.trim() || `scriptforge_${tool}_export`;

    setTimeout(() => {
      try {
        if (format === "txt") {
          const content = getTXTContent();
          const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${finalFilename}.txt`;
          link.click();
          URL.revokeObjectURL(url);
        } else if (format === "md") {
          const content = getMDContent();
          const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${finalFilename}.md`;
          link.click();
          URL.revokeObjectURL(url);
        } else if (format === "pdf") {
          const doc = new jsPDF();
          let y = 15;
          const margin = 15;
          const pageWidth = 210; // A4 dimension
          const pageHeight = 297; // A4 dimension
          const maxLineWidth = pageWidth - margin * 2; // 180mm

          // 1. Sleek corporate Navy slate header block
          doc.setFillColor(15, 23, 42); // slate-900
          doc.rect(0, 0, pageWidth, 42, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(20);
          doc.text("SCRIPTFORGE AI STUDIO", margin, 18);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(156, 163, 175); // gray-400
          doc.text("Advanced Creative Intelligence Document Engine", margin, 24);

          doc.setFontSize(8);
          doc.text(`Timestamp: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, 30);

          y = 52; // initial pointer below header banner

          // 2. Metadata Gray Information Container
          if (includeMetadata) {
            doc.setFillColor(243, 244, 246); // gray-100
            doc.rect(margin, y, maxLineWidth, 24, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(75, 85, 99); // gray-600
            doc.text("WORKSPACE PARAMETERS", margin + 5, y + 6);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128); // gray-500

            let metaLine = "";
            Object.entries(meta).forEach(([k, v]) => {
              if (v) metaLine += `${k.toUpperCase()}: ${v}   |   `;
            });
            if (metaLine.endsWith("   |   ")) metaLine = metaLine.slice(0, -7);

            const splitMeta = doc.splitTextToSize(metaLine, maxLineWidth - 10);
            doc.text(splitMeta, margin + 5, y + 13);

            y += 34; // spacing below metadata box
          }

          // 3. Section Chapters / Narrative Outputs
          sections.forEach((sec) => {
            // New page check for Section Header block
            if (y > pageHeight - 32) {
              doc.addPage();
              y = 20;
            }

            // Indigo Accent Line & Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(79, 70, 229); // indigo-600
            doc.text(sec.title.toUpperCase(), margin, y);
            y += 6;

            // Thin Horizontal separator line
            doc.setDrawColor(229, 231, 235); // gray-200
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 8;

            // Content Wrapping Paragraph text
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(55, 65, 81); // gray-700

            // Split and print paragraph lines safely with overflow page additions
            const lines = doc.splitTextToSize(sec.content, maxLineWidth);
            lines.forEach((line: string) => {
              if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
                // Preserve style variables on newly generated document page
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(55, 65, 81);
              }
              doc.text(line, margin, y);
              y += 6;
            });

            y += 10; // extra padding after section blocks
          });

          // Add Dynamic Footer on all document pages
          const totalPages = doc.internal.pages.length - 1;
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 10);
            doc.text("Forged via ScriptForge Studio (https://scriptforge.ai)", margin, pageHeight - 10);
          }

          doc.save(`${finalFilename}.pdf`);
        }
      } catch (err) {
        console.error("Export operation failed:", err);
      } finally {
        setIsExporting(false);
        onClose();
      }
    }, 1200); // realistic premium loader feeling
  };

  const handleCopyClipboard = () => {
    let text = "";
    if (format === "txt") text = getTXTContent();
    else if (format === "md") text = getMDContent();
    else {
      // PDF fallback representation
      text = `=== SCRIPTFORGE PDF LAYOUT EXPORT ===\n\n`;
      sections.forEach((s) => {
        text += `${s.title.toUpperCase()}\n${s.content}\n\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pb-4 border-b border-slate-900">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            <span>Document Dispatch Hub</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Export Options</h3>
          <p className="text-xs text-slate-400 font-semibold">Choose your layout specifications and format parameters for immediate export.</p>
        </div>

        {/* Modal Body: Left and Right panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
          
          {/* LEFT: Export parameters selectors */}
          <div className="md:col-span-6 space-y-5">
            {/* 1. Format selector (Tabs) */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Target Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["pdf", "txt", "md"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      format === fmt
                        ? "border-indigo-500 bg-indigo-600/15 text-indigo-300 shadow-md shadow-indigo-500/5"
                        : "border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-base uppercase tracking-wider font-extrabold">{fmt}</span>
                    <span className="text-[9px] text-slate-500">
                      {fmt === "pdf" ? "Rich PDF" : fmt === "txt" ? "Plain Text" : "Markdown"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Custom Filename */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Filename
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value.replace(/[^a-zA-Z0-9_\-]/g, ""))}
                  placeholder="e.g. scriptforge_draft"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold uppercase">
                  .{format}
                </span>
              </div>
            </div>

            {/* 3. Output Configuration Toggles */}
            <div className="space-y-2.5 pt-1">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Document Settings
              </label>
              
              {/* Toggle Metadata */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-900 cursor-pointer select-none hover:bg-slate-900/50 transition">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-200">Include Metadata Banner</span>
                    <span className="block text-[9px] text-slate-500">Adds platform, prompt tone, and date parameters.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                />
              </label>

              {/* Toggle Formatting Tips */}
              {tool === "script" && result.formattingAdvice && (
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-900 cursor-pointer select-none hover:bg-slate-900/50 transition">
                  <div className="flex items-center gap-2.5">
                    <Settings className="h-4 w-4 text-slate-500" />
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-200">Include Formatting Tips</span>
                      <span className="block text-[9px] text-slate-500">Appends director formatting advice blocks.</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeFormatting}
                    onChange={(e) => setIncludeFormatting(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                  />
                </label>
              )}
            </div>
          </div>

          {/* RIGHT: Document structure visualizer preview */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div className="space-y-2 flex-1 flex flex-col">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Document Structure Preview
              </label>
              
              <div className="flex-1 min-h-[180px] p-4 bg-slate-950 border border-slate-850 rounded-2xl font-mono text-[10px] text-slate-400 overflow-y-auto max-h-[220px] scrollbar-thin select-none">
                {/* Simulated File Header */}
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-900 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{filename || "untitled"}.{format}</span>
                </div>
                
                {/* Structure simulation preview block */}
                <div className="space-y-3 pt-3">
                  {includeMetadata && (
                    <div className="p-2 rounded bg-slate-900/40 border border-slate-900/80 text-slate-500 italic space-y-0.5">
                      <div>[Metadata Header Block]</div>
                      <div>TOOL: {tool.toUpperCase()}</div>
                      <div>TOPIC: {(topic || "Creative").substring(0, 24)}...</div>
                    </div>
                  )}

                  {sections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-indigo-400 font-bold text-[9px] uppercase">
                        {format === "md" ? `## ${sec.title}` : `[${sec.title.toUpperCase()}]`}
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full" />
                      <div className="h-2 w-5/6 bg-slate-900 rounded-full" />
                      <div className="h-2 w-4/5 bg-slate-900 rounded-full" />
                    </div>
                  ))}
                  
                  <div className="pt-2 text-[9px] text-slate-600 text-center italic">
                    — End of dynamic segment rendering —
                  </div>
                </div>
              </div>
            </div>

            {/* Micro details indicator */}
            <div className="pt-4 flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
              <FileText className="h-4 w-4 shrink-0" />
              <span>Estimating {sections.length} layout content layers ready.</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="pt-6 mt-6 border-t border-slate-900 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <button
            onClick={handleCopyClipboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-850 bg-slate-900/50 hover:bg-slate-900 py-3 px-5 text-xs font-bold text-slate-300 transition-all cursor-pointer active:scale-98"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied Draft Payload!" : "Copy to Clipboard"}</span>
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-850 py-3 px-5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-2 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 disabled:opacity-50 min-w-[140px]"
            >
              {isExporting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing Draft...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download File</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
