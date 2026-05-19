export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    // 1. Find user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "البريد الإلكتروني المدخل غير مسجل لدينا أو الحساب غير نشط" }, { status: 404 });
    }

    // 2. Generate secure random UUID token and 1-hour expiration
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // 3. Save the token and expiry date to the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    // 4. Construct the reset link
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    // 5. Send the email
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || `"مكتب المحامية رقية" <${smtpUser}>`;

    const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

    if (isSmtpConfigured) {
      // Create transport
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpPort === "465", // SSL/TLS
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Send mail
      await transporter.sendMail({
        from: smtpFrom,
        to: user.email,
        subject: "🔒 طلب إعادة تعيين كلمة المرور - مكتب المحامية رقية عبد الرحمن",
        text: `مرحباً ${user.name}، لإعادة تعيين كلمة المرور الخاصة بك يرجى فتح هذا الرابط: ${resetLink}`,
        html: `
          <div dir="rtl" style="font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #d4a373; margin: 0; font-size: 24px; font-weight: bold; border-bottom: 2px solid rgba(212, 163, 115, 0.2); padding-bottom: 15px;">مكتب المحامية رقية عبد الرحمن</h2>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">نظام إدارة المكتب الذكي</p>
            </div>
            
            <div style="background-color: rgba(255, 255, 255, 0.02); padding: 30px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 30px;">
              <h3 style="color: #f8fafc; font-size: 18px; margin-top: 0; margin-bottom: 15px;">طلب استعادة كلمة المرور</h3>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                مرحباً <strong>${user.name}</strong>،<br>
                لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في النظام. لإعادة التعيين، يرجى الضغط على الزر التالي:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: linear-gradient(135deg, #c9975b 0%, #d4a373 50%, #e6b980 100%); color: #1a1000; text-decoration: none; padding: 14px 30px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(212, 163, 115, 0.3);">إعادة تعيين كلمة المرور</a>
              </div>
              
              <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; margin-top: 25px;">
                أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:
              </p>
              <p dir="ltr" style="background-color: rgba(0, 0, 0, 0.2); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #d4a373; overflow-x: auto; word-break: break-all; text-align: left; border: 1px solid rgba(255, 255, 255, 0.05);">
                ${resetLink}
              </p>
              
              <div style="height: 1px; background-color: rgba(255, 255, 255, 0.06); margin: 25px 0;"></div>
              
              <p style="color: #ef4444; font-size: 13px; margin: 0;">
                ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تكن أنت من طلب هذا التغيير، يمكنك تجاهل هذا البريد بأمان.
              </p>
            </div>
            
            <div style="text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">جميع الحقوق محفوظة © مكتب المحامية رقية عبد الرحمن</p>
            </div>
          </div>
        `,
      });
    } else {
      // SMTP is not configured: fallback to logging to the console (development mode)
      console.log("\n==========================================================================");
      console.log("🔒 [DEVELOPMENT MODE] PASSWORD RESET REQUEST");
      console.log(`👤 User: ${user.name} (${user.email})`);
      console.log(`🔗 Reset Link: ${resetLink}`);
      console.log("==========================================================================\n");
    }

    return NextResponse.json({
      success: true,
      message: isSmtpConfigured
        ? "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح"
        : "تم توليد رابط الاستعادة بنجاح (بيئة التطوير: يرجى التحقق من كونسول السيرفر لرؤية الرابط)",
      debug: !isSmtpConfigured,
    });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة طلبك، يرجى المحاولة لاحقاً" }, { status: 500 });
  }
}
