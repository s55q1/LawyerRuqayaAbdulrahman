import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditCaseForm from "@/components/dashboard/cases/EditCaseForm";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) {
    redirect(`/dashboard/cases/${id}`);
  }

  const [caseData, clients, lawyers] = await Promise.all([
    prisma.case.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: { in: ["LAWYER"] }, isActive: true } }),
  ]);

  if (!caseData) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary-700">تعديل القضية</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <EditCaseForm caseData={caseData} clients={clients} lawyers={lawyers} />
      </div>
    </div>
  );
}
