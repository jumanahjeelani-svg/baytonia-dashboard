"use client";

import { AlertTriangle, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    title: "تحويل الحساب إلى بروفيشنال",
    desc: "في انستجرام: الإعدادات ← نوع الحساب ← الانتقال إلى حساب احترافي (بيزنس أو مبدع)",
  },
  {
    title: "ربط بصفحة فيسبوك",
    desc: "في انستجرام: الإعدادات ← الحسابات المرتبطة ← اربط بصفحة فيسبوك (أنشئ صفحة بسيطة إن لم يكن لديك)",
  },
  {
    title: "إعادة توليد التوكن",
    desc: 'في Meta for Developers: Graph API Explorer ← اختر تطبيقك ← Generate Access Token ← تأكد من تضمين الصفحة',
  },
  {
    title: "تحديث .env.local",
    desc: "استبدل قيمة INSTAGRAM_ACCESS_TOKEN بالتوكن الجديد وأعد تشغيل السيرفر",
  },
];

export default function SetupGuide({ error, hint }: { error: string; hint: string }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch("/api/instagram/revalidate", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={20} />
        <div>
          <p className="text-amber-800 font-semibold text-sm">{error}</p>
          <p className="text-amber-600 text-xs mt-1">{hint}</p>
        </div>
      </div>

      <h2 className="text-slate-800 font-bold text-lg mb-4">خطوات الربط</h2>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-4">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
              {i + 1}
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">{step.title}</p>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "جاري التحقق..." : "تم الإعداد — تحديث"}
        </button>
        <a
          href="https://developers.facebook.com/tools/explorer/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ExternalLink size={14} />
          فتح Graph API Explorer
        </a>
      </div>
    </div>
  );
}
