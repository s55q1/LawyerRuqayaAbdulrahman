export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "الرمز وكلمة المرور الجديدة مطلوبان" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "يجب أن تكون كلمة المرور مكونة من 6 خانات على الأقل" }, { status: 400 });
    }

    // 1. Find user with valid and active token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(), // Expires date is in the future
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "رابط استعادة كلمة المرور غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد" }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password and invalidate the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // 4. Invalidate all active sessions for this user (force re-login on all devices)
    await prisma.accountSession.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة طلبك، يرجى المحاولة لاحقاً" }, { status: 500 });
  }
}
