import TopBar from "@/components/TopBar";
import MetricCard from "@/components/MetricCard";
import PerformanceChart from "@/components/charts/PerformanceChart";
import EngagementChart from "@/components/charts/EngagementChart";
import PlatformSummary from "@/components/PlatformSummary";
import TopPosts from "@/components/TopPosts";
import ChatInterface from "@/components/ChatInterface";
import { overview } from "@/lib/mock-data";
import { Eye, Heart, Users, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="لوحة التحكم" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label={overview.totalViews.label}
            value={overview.totalViews.value}
            change={overview.totalViews.change}
            icon={Eye}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            description="عبر جميع المنصات"
          />
          <MetricCard
            label={overview.totalEngagement.label}
            value={overview.totalEngagement.value}
            change={overview.totalEngagement.change}
            icon={Heart}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
            description="إعجابات، تعليقات، مشاركات"
          />
          <MetricCard
            label={overview.totalFollowers.label}
            value={overview.totalFollowers.value}
            change={overview.totalFollowers.change}
            icon={Users}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            description="مجموع المتابعين"
          />
          <MetricCard
            label={overview.salesFromSocial.label}
            value={overview.salesFromSocial.value}
            change={overview.salesFromSocial.change}
            icon={ShoppingBag}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            currency={overview.salesFromSocial.currency}
            description="مبيعات مصدرها السوشيال"
          />
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <PerformanceChart />
          </div>
          <PlatformSummary />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <TopPosts />
          </div>
          <div>
            <EngagementChart />
          </div>
        </div>

        {/* AI Chat mini widget */}
        <div>
          <ChatInterface compact />
        </div>
      </main>
    </div>
  );
}
