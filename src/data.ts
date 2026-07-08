export const PLATFORMS = [
  { id: "YouTube", name: "YouTube", icon: "Youtube" },
  { id: "Instagram", name: "Instagram", icon: "Instagram" },
  { id: "Facebook", name: "Facebook", icon: "Facebook" },
  { id: "X", name: "X", icon: "Twitter" },
  { id: "LinkedIn", name: "LinkedIn", icon: "Linkedin" }
];

export const LANGUAGES = [
  { id: "English", name: "English (US/UK)", flag: "🇺🇸" },
  { id: "Hindi", name: "Hindi (हिंदी)", flag: "🇮🇳" },
  { id: "Hinglish", name: "Hinglish (English-Hindi Mix)", flag: "🇮🇳" }
];

export const TONES = [
  { id: "Professional", name: "Professional", desc: "Polished & authoritative" },
  { id: "Casual", name: "Casual", desc: "Friendly & conversational" },
  { id: "Witty", name: "Witty / Humorous", desc: "Clever & amusing" },
  { id: "Bold", name: "Bold & Punchy", desc: "High energy & direct" },
  { id: "Excited", name: "Excited", desc: "Hype-heavy & enthusiastic" },
  { id: "Informative", name: "Educational", desc: "Clear, factual & detailed" },
  { id: "Dramatic", name: "Dramatic", desc: "Suspenseful & emotional" }
];

export const LENGTHS = [
  { id: "Short", name: "Short (~30s / 150 words)", desc: "Perfect for Shorts/Reels" },
  { id: "Medium", name: "Medium (~2m / 500 words)", desc: "Standard video or post" },
  { id: "Long", name: "Long (~5m+ / 1200 words)", desc: "Deep dive or full article" }
];

export const IMAGE_STYLES = [
  { id: "Realistic", name: "Photorealistic", desc: "Stunning real-world detail", icon: "Camera" },
  { id: "3D", name: "3D Render", desc: "Octane Rendered 3D art", icon: "Box" },
  { id: "Anime", name: "Anime Style", desc: "Vibrant hand-drawn animation", icon: "Sparkles" },
  { id: "Pixar", name: "Pixar / Disney", desc: "Friendly cartoon characters", icon: "Smile" },
  { id: "Fantasy", name: "Fantasy", desc: "Magical illustration and lands", icon: "Wand2" },
  { id: "Cyberpunk", name: "Cyberpunk", desc: "Neon, rain-slicked tech cities", icon: "Zap" },
  { id: "Logo", name: "Vector Logo", desc: "Minimalist corporate icon", icon: "Layers" },
  { id: "Thumbnail", name: "YT Thumbnail", desc: "High contrast CTR optimized", icon: "Tv" },
  { id: "Poster", name: "Movie Poster", desc: "Dramatic movie title & layout", icon: "Flame" },
  { id: "Product", name: "Product Catalog", desc: "Studio lighting setup", icon: "ShoppingBag" }
];

export const IMAGE_RATIOS = [
  { id: "1:1", name: "Square (1:1)", desc: "Instagram Post", dimensions: "1024 x 1024" },
  { id: "16:9", name: "Landscape (16:9)", desc: "YouTube / Twitter", dimensions: "1024 x 576" },
  { id: "9:16", name: "Vertical (9:16)", desc: "TikTok / Reels", dimensions: "576 x 1024" },
  { id: "4:3", name: "Classic (4:3)", desc: "Standard Frame", dimensions: "1024 x 768" },
  { id: "3:4", name: "Portrait (3:4)", desc: "LinkedIn Blog", dimensions: "768 x 1024" }
];

export const STORY_GENRES = [
  { id: "Short Story", name: "⚡ Quick Read", desc: "Engaging short narrative" },
  { id: "Long Story", name: "📖 Epic Tale", desc: "Multi-chapter detailed story" },
  { id: "Kids Story", name: "🧸 Children's Fable", desc: "Friendly, simple, moral lesson" },
  { id: "Horror", name: "👻 Spooky Thriller", desc: "Suspenseful, dark, scary twist" },
  { id: "Motivation", name: "💪 Inspiring Journey", desc: "Overcoming odds and triumph" },
  { id: "Fantasy", name: "🧙 Magic & Myth", desc: "Elves, dragons, epic quests" },
  { id: "Comedy", name: "😂 Laugh Out Loud", desc: "Hilarious characters and tropes" }
];

export const PROMPT_TARGETS = [
  { id: "Gemini", name: "Google Gemini", desc: "Highly structured and factual reasoning" },
  { id: "ChatGPT", name: "OpenAI ChatGPT", desc: "Conversational & versatile assistance" },
  { id: "Claude", name: "Anthropic Claude", desc: "Nuanced, creative, and code-safe outputs" },
  { id: "Image Models", name: "Midjourney & Flux", desc: "Highly descriptive image prompts" }
];

export const FAQ_ITEMS = [
  {
    question: "What is ScriptForge AI?",
    answer: "ScriptForge AI is an all-in-one content creation workspace. It leverages advanced Gemini AI models to generate professional video scripts, viral hooks, SEO descriptions, trending hashtags, engaging stories, and high-quality AI images in seconds."
  },
  {
    question: "How do I secure my API keys?",
    answer: "ScriptForge AI routes all generation requests through a secure server proxy. Your GEMINI_API_KEY is never exposed to the client or browser, ensuring maximum security and compliance with enterprise standards."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, every registered account gets 50 free credits per month to test script, title, caption, and image generation. Upgrade to Pro for unlimited generation, faster response times, and premium outputs."
  },
  {
    question: "Can I download and export my scripts?",
    answer: "Absolutely! You can copy text with a single click, export descriptions and scripts to standard TXT, or download formatted drafts to keep your content pipeline organized."
  }
];

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "Perfect for testing the waters and occasional posts.",
    features: [
      "50 monthly generation credits",
      "All text generators included",
      "Standard output speeds",
      "Save up to 5 scripts",
      "Secure local history"
    ],
    buttonText: "Get Started Free",
    isPopular: false
  },
  {
    name: "Creator Pro",
    price: "$19",
    period: "month",
    desc: "Built for active content creators and social managers.",
    features: [
      "Unlimited text generations",
      "1,000 premium image renders/mo",
      "3x faster server priority responses",
      "Unlimited History & Favorites",
      "Export as PDF, TXT and DocX",
      "Advanced 20+ viral hook strategies",
      "Priority customer support"
    ],
    buttonText: "Upgrade to Pro",
    isPopular: true
  },
  {
    name: "Studio Enterprise",
    price: "$49",
    period: "month",
    desc: "Designed for content agencies and design studios.",
    features: [
      "Everything in Creator Pro",
      "Multi-user team workspace",
      "Custom brand voice training presets",
      "Dedicated high-speed API keys proxy",
      "Custom integrations",
      "24/7 account manager"
    ],
    buttonText: "Contact Sales",
    isPopular: false
  }
];

export const FEATURES = [
  {
    title: "AI Script Forge",
    desc: "Generate professional scripts with openings, body copy, transitions, CTA, and visual cues tailored for YT, TikTok, or Instagram.",
    icon: "FileText",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Stunning Art Generator",
    desc: "Create magnificent visual assets, posters, or thumbnails with customized aspects using photorealistic or 3D render styles.",
    icon: "Image",
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "SEO Description Suite",
    desc: "Generate perfectly structured, high-ranking, keyword-rich SEO summaries with dynamic hashtag suggestions for maximum CTR.",
    icon: "Search",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Viral Hook Lab",
    desc: "Craft up to 20 attention-snatching viral headlines to secure top engagement and hook viewers in the crucial first 3 seconds.",
    icon: "Zap",
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Hashtag Catalyst",
    desc: "Instantly discover and group high-relevancy trending tags with volume indicators to boost your content visibility organically.",
    icon: "Hash",
    color: "from-rose-500 to-red-600"
  },
  {
    title: "Creative Storysmith",
    desc: "Produce motivating, terrifying, humorous, or kids' fantasy stories divided into elegant visual chapters for narration scripts.",
    icon: "BookOpen",
    color: "from-violet-500 to-fuchsia-600"
  }
];

export const STATISTICS = [
  { value: "48.2M", label: "Creators Empowered" },
  { value: "1.2Sec", label: "Avg Generation Speed" },
  { value: "99.8%", label: "Satisfaction Rate" },
  { value: "4.9/5", label: "Trustpilot Score" }
];

export const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Full-Time YouTuber (2M+ Subs)",
    quote: "ScriptForge AI saved me hours of brainstorming. The script generator builds perfectly-paced segments, and the viral hooks tripled my short retention rates!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Samir Mehta",
    role: "SaaS Social Media Lead",
    quote: "The caption and hashtag suites are exceptionally polished. Having LinkedIn, Twitter, and Instagram variations generated from one topic in 2 seconds is pure sorcery.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Elena Rostova",
    role: "Digital Artist & Copywriter",
    quote: "The visual image generator fallback is incredibly smart, returning stunning high-CTR thumbnails and posters that match my custom prompts beautifully.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  }
];
