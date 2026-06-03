import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/mock-data";

interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  currency?: string;
  description?: string;
}

export default function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  currency,
  description,
}: MetricCardProps) {
  const isPositive = change >= 0;
  const displayValue = currency
    ? formatCurrency(value)
    : formatNumber(value);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={iconColor} size={22} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </span>
      </div>

      <p className="text-slate-500 text-sm mb-1">{label}</p>
      <p className="text-slate-900 text-2xl font-bold">
        {displayValue}
        {currency && <span className="text-base font-medium text-slate-500 mr-1">{currency}</span>}
      </p>
      {description && (
        <p className="text-slate-400 text-xs mt-1">{description}</p>
      )}
    </div>
  );
}
