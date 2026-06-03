import TopBar from "@/components/TopBar";
import { LucideIcon, Construction } from "lucide-react";

export default function PlaceholderPage({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  color?: string;
}) {
  const Ico = Icon ?? Construction;
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title={title} />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div
            className={`w-20 h-20 rounded-3xl ${color ?? "bg-slate-100"} flex items-center justify-center mx-auto mb-6`}
          >
            <Ico size={36} className={color ? "text-white" : "text-slate-400"} />
          </div>
          <h2 className="text-slate-800 font-bold text-xl mb-2">{title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
          <button className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors">
            قريباً
          </button>
        </div>
      </main>
    </div>
  );
}
