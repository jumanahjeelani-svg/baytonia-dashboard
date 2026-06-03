import TopBar from "@/components/TopBar";
import SchedulerClient from "@/components/scheduler/SchedulerClient";

export default function SchedulerPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="جدولة المحتوى" />
      <SchedulerClient />
    </div>
  );
}
