export const overview = {
  totalViews: { value: 795000, change: 14.2, label: "إجمالي المشاهدات" },
  totalEngagement: { value: 38200, change: 8.7, label: "إجمالي التفاعل" },
  totalFollowers: { value: 105000, change: 3.5, label: "إجمالي المتابعين" },
  salesFromSocial: { value: 127500, change: 22.1, label: "المبيعات من السوشيال", currency: "ر.س" },
};

export const monthlyPerformance = [
  { month: "يناير", views: 180000, engagement: 8000, followers: 92000, sales: 45000 },
  { month: "فبراير", views: 210000, engagement: 9500, followers: 94800, sales: 52000 },
  { month: "مارس", views: 245000, engagement: 11000, followers: 98000, sales: 68000 },
  { month: "أبريل", views: 290000, engagement: 13500, followers: 101200, sales: 82000 },
  { month: "مايو", views: 325000, engagement: 15000, followers: 103800, sales: 95000 },
  { month: "يونيو", views: 380000, engagement: 18200, followers: 105000, sales: 127500 },
];

export const weeklyEngagement = [
  { day: "الأحد", instagram: 1200, tiktok: 2800, snapchat: 650 },
  { day: "الاثنين", instagram: 950, tiktok: 3200, snapchat: 580 },
  { day: "الثلاثاء", instagram: 1450, tiktok: 2600, snapchat: 720 },
  { day: "الأربعاء", instagram: 1800, tiktok: 4100, snapchat: 890 },
  { day: "الخميس", instagram: 2200, tiktok: 5800, snapchat: 1100 },
  { day: "الجمعة", instagram: 3100, tiktok: 7200, snapchat: 1450 },
  { day: "السبت", instagram: 2800, tiktok: 6500, snapchat: 1300 },
];

export const platforms = [
  {
    id: "instagram",
    name: "انستجرام",
    handle: "@baitonia.sa",
    color: "#E1306C",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
    followers: 45200,
    followersChange: 5.2,
    views: 280000,
    viewsChange: 12.5,
    engagement: 18500,
    engagementRate: 4.1,
    posts: 142,
    status: "متصل",
  },
  {
    id: "tiktok",
    name: "تيك توك",
    handle: "@baitonia.sa",
    color: "#010101",
    bgColor: "bg-slate-50",
    textColor: "text-slate-800",
    borderColor: "border-slate-200",
    followers: 38500,
    followersChange: 8.9,
    views: 520000,
    viewsChange: 28.3,
    engagement: 26200,
    engagementRate: 6.8,
    posts: 87,
    status: "متصل",
  },
  {
    id: "snapchat",
    name: "سناب شات",
    handle: "baitonia.sa",
    color: "#FFFC00",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    followers: 21300,
    followersChange: 2.1,
    views: 95000,
    viewsChange: 5.7,
    engagement: 8500,
    engagementRate: 2.9,
    posts: 210,
    status: "متصل",
  },
];

export const topPosts = [
  {
    id: 1,
    platform: "tiktok",
    platformName: "تيك توك",
    title: "جولة كاملة في شقة مفروشة من بيتونيا",
    views: 280000,
    likes: 18500,
    comments: 2200,
    shares: 4100,
    date: "منذ 3 أيام",
    thumbnail: "🛋️",
  },
  {
    id: 2,
    platform: "instagram",
    platformName: "انستجرام",
    title: "غرفة معيشة بلمسة عصرية وكلاسيكية",
    views: 45000,
    likes: 8200,
    comments: 650,
    shares: 980,
    date: "منذ 5 أيام",
    thumbnail: "🪑",
  },
  {
    id: 3,
    platform: "tiktok",
    platformName: "تيك توك",
    title: "أفكار ديكور لغرفة النوم - تحول مذهل",
    views: 195000,
    likes: 12800,
    comments: 1850,
    shares: 3200,
    date: "منذ أسبوع",
    thumbnail: "🛏️",
  },
  {
    id: 4,
    platform: "instagram",
    platformName: "انستجرام",
    title: "خصومات نهاية الموسم - حتى 40%",
    views: 38000,
    likes: 6100,
    comments: 420,
    shares: 1500,
    date: "منذ أسبوع",
    thumbnail: "🏷️",
  },
  {
    id: 5,
    platform: "snapchat",
    platformName: "سناب شات",
    title: "طقم سفرة رائع لعيد الفطر",
    views: 22000,
    likes: 3200,
    comments: 180,
    shares: 650,
    date: "منذ أسبوعين",
    thumbnail: "🍽️",
  },
];

export const aiSuggestions = [
  "كيف كان أداء انستجرام هذا الشهر؟",
  "ما هو أفضل وقت للنشر؟",
  "أي منصة تحقق أعلى مبيعات؟",
  "ما هي اتجاهات المحتوى الحالية؟",
];

export const chatHistory = [
  {
    id: 1,
    role: "assistant" as const,
    content:
      "مرحباً! أنا مساعدك الذكي لبيتونيا 👋 يمكنني مساعدتك في تحليل أداء حساباتك على منصات التواصل الاجتماعي وتقديم توصيات لتحسين استراتيجيتك. كيف يمكنني مساعدتك اليوم؟",
    timestamp: "10:00 ص",
  },
];

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "م";
  if (num >= 1000) return (num / 1000).toFixed(1) + "ألف";
  return num.toLocaleString("ar-SA");
}

export function formatCurrency(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "م";
  if (num >= 1000) return (num / 1000).toFixed(0) + "ألف";
  return num.toLocaleString("ar-SA");
}
