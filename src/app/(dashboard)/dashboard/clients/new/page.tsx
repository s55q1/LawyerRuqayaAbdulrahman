import { getSession, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewClientForm from "@/components/dashboard/clients/NewClientForm";

export default async function NewClientPage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) {
    redirect("/dashboard/clients");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-700">عميل جديد</h1>
        <p className="text-gray-500 text-sm mt-1">أدخل بيانات العميل الجديد</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <NewClientForm />
      </div>
    </div>
  );
}
