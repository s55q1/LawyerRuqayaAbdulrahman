export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.phone || !data.message) {
      return NextResponse.json({ error: "الاسم والهاتف والرسالة مطلوبة" }, { status: 400 });
    }

    const msg = await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
      },
    });

    // Notify all legal secretaries
    const secretaries = await prisma.user.findMany({
      where: { role: "LEGAL_SECRETARY" },
      select: { id: true },
    });

    if (secretaries.length > 0) {
      await prisma.notification.createMany({
        data: secretaries.map((s) => ({
          userId: s.id,
          title: "رسالة جديدة من الموقع",
          message: `${data.name} — ${data.subject || "استفسار عام"}`,
          type: "ALERT",
          actionUrl: "/dashboard/messages",
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
