import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CMSManager from "@/components/dashboard/cms/CMSManager";

export default async function CMSPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return <CMSManager />;
}
