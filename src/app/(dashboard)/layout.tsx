import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--navy-900)" }}>

      <DashboardSidebar user={session} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={session} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
