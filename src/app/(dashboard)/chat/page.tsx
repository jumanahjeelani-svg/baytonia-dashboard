"use client";

import ChatInterface from "@/components/ChatInterface";
import {
  TrendingUp, Eye, Heart, Users, ShoppingBag,
  MessageSquare, Lightbulb, BarChart2,
} from "lucide-react";

const TOPIC_GROUPS = [
  {
    icon: BarChart2, label: "الأداء العام", color: "text-indigo-600 bg-indigo-50",
    questions: ["كيف كان الأداء هذا الشهر؟", "ما هي المنصة الأفضل أداءً؟", "قارن أداء المنصات الثلاث"],
  },
  {
    icon: TrendingUp, label: "النمو والاتجاهات", color: "text-emerald-600 bg-emerald-50",
    questions: ["ما هي اتجاهات النمو؟", "كيف تطور عدد المتابعين؟", "ما هو أسرع المنصات نمواً؟"],
  },
  {
    icon: Eye, label: "المشاهدات والوصول", color: "text-blue-600 bg-blue-50",
    questions: ["كم مشاهدة حصلنا عليها؟", "أي المنصات أعلى وصولاً؟", "كيف نزيد المشاهدات؟"],
  },
  {
    icon: Heart, label: "التفاعل", color: "text-rose-600 bg-rose-50",
    questions: ["ما هو معدل التفاعل لكل منصة؟", "ما هي أنواع المحتوى الأعلى تفاعلاً؟", "كيف نحسن معدل التفاعل؟"],
  },
  {
    icon: Users, label: "الجمهور", color: "text-amber-600 bg-amber-50",
    questions: ["من هو جمهورنا المستهدف؟", "ما هي الفئة العمرية الأكبر؟", "ما هي أفضل أوقات النشر؟"],
  },
  {
    icon: ShoppingBag, label: "المبيعات", color: "text-violet-600 bg-violet-50",
    questions: ["كم حققنا من مبيعات بالسوشيال؟", "أي منصة تحقق أعلى مبيعات؟", "كيف نزيد التحويلات؟"],
  },
  {
    icon: Lightbulb, label: "المحتوى", color: "text-orange-600 bg-orange-50",
    questions: ["ما هي أفكار محتوى مقترحة؟", "ما هو أفضل نوع محتوى لبيتونيا؟", "ما هي الهاشتاقات الأفضل؟"],
  },
  {
    icon: MessageSquare, label: "التوصيات", color: "text-teal-600 bg-teal-50",
    questions: ["ما هي توصياتك لتحسين الأداء؟", "ما هي أولويات العمل القادمة؟", "كيف نبني استراتيجية محتوى؟"],
  },
];

export default function ChatPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <main className="flex-1 overflow-hidden flex gap-5 p-5">
        <aside className="w-64 shrink-0 overflow-y-auto space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-slate-700 font-bold text-sm mb-1">المساعد الذكي لبيتونيا</p>
            <p className="text-slate-400 text-xs leading-relaxed">اسأل عن أداء السوشيال ميديا وستحصل على تحليل مبني على بياناتك الفعلية.</p>
          </div>
          {TOPIC_GROUPS.map(({ icon: Icon, label, color, questions }) => (
            <details key={label} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <summary className="flex items-center gap-2.5 px-4 py-3 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}><Icon size={14} /></div>
                <span className="text-slate-700 font-semibold text-xs flex-1">{label}</span>
                <span className="text-slate-400 text-xs group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-3 pb-3 space-y-1 border-t border-slate-100">
                {questions.map((q) => (
                  <button key={q} data-question={q}
                    className="w-full text-right text-xs text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-violet-700 transition-colors block"
                    onClick={() => {
                      const input = document.querySelector<HTMLTextAreaElement>("textarea[placeholder]");
                      if (input) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")!.set!;
                        nativeInputValueSetter.call(input, q);
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.focus();
                      }
                    }}
                  >{q}</button>
                ))}
              </div>
            </details>
          ))}
        </aside>
        <div className="flex-1 min-w-0"><ChatInterface /></div>
      </main>
    </div>
  );
}
