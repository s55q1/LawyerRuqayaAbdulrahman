import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, CASE_STATUS_LABELS } from "@/lib/utils";
import { Users, Phone, Mail, MapPin, Scale } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getSession();

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      cases: {
        include: { lawyer: true },
        orderBy: { createdAt: "desc" },
      },
      contracts: true,
    },
  });

  if (!client) notFound();

  const totalContractValue = client.contracts.reduce((s, c) => s + c.totalAmount, 0);
  const totalPaid = client.contracts.reduce((s, c) => s + c.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/clients" className="text-gray-400 hover:text-primary-700 text-sm">← العملاء</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-6">
            <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
              <Users className="w-10 h-10 text-primary-700" />
            </div>
            <h1 className="text-xl font-bold text-primary-700">{client.name}</h1>
            <p className="text-gray-500 text-sm">عميل منذ {formatDate(client.createdAt)}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold flex-shrink-0" />
              <span dir="ltr">{client.phone}</span>
            </div>
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{client.email}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{client.address}</span>
              </div>
            )}
            {client.nationalId && (
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-gold flex-shrink-0" />
                <span dir="ltr">{client.nationalId}</span>
              </div>
            )}
          </div>

          {client.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">ملاحظات</p>
              <p className="text-sm text-gray-600">{client.notes}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xl font-bold text-green-600">{client.cases.length}</div>
              <div className="text-xs text-gray-500">قضية</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-600">{client.contracts.length}</div>
              <div className="text-xs text-gray-500">عقد</div>
            </div>
          </div>
        </div>

        {/* Cases */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary-700">قضايا العميل</h2>
              <Link href={`/dashboard/cases/new?clientId=${client.id}`} className="text-gold text-sm hover:underline">
                + قضية جديدة
              </Link>
            </div>
            {client.cases.length === 0 ? (
              <p className="text-gray-400 text-center py-8">لا توجد قضايا</p>
            ) : (
              <div className="space-y-2">
                {client.cases.map((c) => (
                  <Link key={c.id} href={`/dashboard/cases/${c.id}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{c.title}</div>
                        <div className="text-xs text-gray-500">{c.caseNumber} · {c.lawyer?.name || "غير محدد"}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        c.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                        c.status === "WON" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {CASE_STATUS_LABELS[c.status]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
